require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const Birthday = require('../src/actions/birthday');
const chokidar = require('chokidar');

const port = process.env.PORT || 3000;
const collectionId = process.env.AWS_COLLECTION_ID;
const similarityThreshold = process.env.SIMILARITY_THRESHOLD;
const localDirectory = process.env.LOCAL_DIRECTORY;
const bucketName = process.env.AWS_BUCKET;

AWS.config.update({region: process.env.AWS_REGION});
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

const fileWatcher = chokidar.watch(localDirectory, {
  ignoreInitial: true
});

fileWatcher.on('add', function(filePath) {
  console.log('new file added: ' + filePath);

  findAMatchInAwsFaces(getSourceImage(filePath)).then(function(match) {
    return getDataFromMatch(match);
  }).then(function(data) {
    actions(data);
  }).catch(function(err) {
    console.log(err);
  });
});

function getSourceImage(filePath){
  return fs.readFileSync(
    filePath, 'base64',
    function (err,data) {
      if (err) console.log(err);
      else return data;
    }
  );
}

function findAMatchInAwsFaces(sourceImage) {
  return new Promise(function(resolve, reject){
    let params = {
      CollectionId: collectionId,
      Image: {
        Bytes: new Buffer(sourceImage, 'base64')
      },
      FaceMatchThreshold: similarityThreshold,
      MaxFaces: 1
    };

    rekognition.searchFacesByImage(params, function(err, data) {
      if (err) reject(err);
      else {
        if(data.FaceMatches.length>0)
          resolve(data.FaceMatches[0].Face);
        else
          reject('No Match Found');
      }
    });
  });
}

function getDataFromMatch(matched){
  return new Promise(function(resolve, reject){
    let params = {
      Bucket: bucketName,
      Key: matched.ExternalImageId
    };

    s3.headObject(params, function(err, data) {
      if (err) reject(err);
      else resolve(data.Metadata);
    });
  });
}

function actions(data) {
  singBirthdaySongOnBirthday(data.name, data.birthday);
}

function singBirthdaySongOnBirthday(name, birthday){
  let response = new Birthday().action(name, birthday);
  if(response !== null) console.log(response);
}
