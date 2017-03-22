require('dotenv').config();
require('log-timestamp');

const AWS = require('aws-sdk');
const fs = require('fs');
const chokidar = require('chokidar');
const Faced = require('faced');
const faceDetector = new Faced();

const TTSService = require('../src/tts_service');
const Birthday = require('../src/actions/birthday');

const port = process.env.PORT || 3000;
const collectionId = process.env.AWS_COLLECTION_ID;
const similarityThreshold = process.env.SIMILARITY_THRESHOLD;
const localDirectory = process.env.LOCAL_DIRECTORY;
const bucketName = process.env.AWS_BUCKET;

AWS.config.update({region: process.env.AWS_REGION});
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB();

const fileWatcher = chokidar.watch(localDirectory, {
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 1000,
    pollInterval: 100
  }
});

fileWatcher.on('add', function(filePath) {
  console.log('new file added: ' + filePath);

  imageHasAFace(filePath)
  .then(function(){
    return findAMatchInAwsFaces(getSourceImage(filePath));
  }).then(function(match) {
    return getDataFromMatch(match);
  }).then(function(data) {
    actions(data);
  }).catch(function(err) {
    console.log(err);
  });
});

function imageHasAFace(filePath) {
  return new Promise(function(resolve, reject){
    faceDetector.detect(filePath, function (faces, image, filePath) {
      if (faces.length > 0)
        resolve();
      else
        reject('No face detected');
    });
  });
}

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
  return getDataFromAWSDynamoDB(matched);
}

function getDataFromAWSDynamoDB(matched) {
  return new Promise(function(resolve, reject){
    let params = {
      Key: { 'userId': { S: matched.ExternalImageId } },
      TableName: 'HeyOfficeUsers'
    };
    dynamoDB.getItem(params, function(err, data){
      if(err) reject(err, err.stack);
      else {
        console.log(data);
        resolve(processAWSDynamoDBResponseObject(data));
      }
    });
  });
}

function processAWSDynamoDBResponseObject(response) {
  let item = response.Item;
  let keys = Object.keys(item);
  let data = {};
  keys.forEach(function(key) {
    let columnTypeKey = Object.keys(item[key])[0];
    let value = item[key][columnTypeKey];
    data[key] = value;
  });
  console.log(data);
  return data;
}

function getDataFromAWSS3(matched){
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
  sing(birthdaySongOnBirthday(data.name, data.birthday));
}

function sing(response){
  if(response !== null) {
    console.log('singing: ' + response);
    new TTSService().sing(response);
  }
}

function birthdaySongOnBirthday(name, birthday){
  return new Birthday().action(name, birthday);
}
