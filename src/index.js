require('dotenv').config();
const Express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const app = Express();

const port = process.env.PORT || 3000;
const collectionId = process.env.AWS_COLLECTION_ID;
const similarityThreshold = process.env.SIMILARITY_THRESHOLD;
const localDirectory = process.env.LOCAL_DIRECTORY;
const bucketName = process.env.AWS_BUCKET;

AWS.config.update({region: process.env.AWS_REGION});
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();

app.get('/', (req, res) => {
  findAMatchInAwsFaces(getSourceImage()).then(function(match) {
    return getDataFromMatch(match);
  }).then(function(data) {
    actions(data);
  }).catch(function(err) {
    console.log(err);
  });
});

app.listen(port);

function getSourceImage(){
  return fs.readFileSync(
    localDirectory + 'angelina-jolie2.jpeg', 'base64',
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
  playBirthdaySong(data.birthday);
}

function playBirthdaySong(birthday){
  console.log(birthday);
}
