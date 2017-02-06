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
  findAMatchInAwsFaces(getSourceImage());
});

app.listen(port);

function findAMatchInAwsFaces(sourceImage) {
  let params = {
    CollectionId: collectionId,
    Image: {
      Bytes: new Buffer(sourceImage, 'base64')
    },
    FaceMatchThreshold: similarityThreshold,
    MaxFaces: 1
  };

  rekognition.searchFacesByImage(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      if(data.FaceMatches.length>0)
        processMatch(data.FaceMatches[0].Face);
      else
        console.log('No Match Found');
    }
  });
}

function getSourceImage(){
  return fs.readFileSync(
    localDirectory + 'angelina-jolie2.jpeg', 'base64',
    function (err,data) {
      if (err) console.log(err);
      else return data;
    }
  );
}

function processMatch(matched){
  let params = {
    Bucket: bucketName,
    Key: matched.ExternalImageId
  };
  s3.headObject(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      actions(data.Metadata);
    }
  });
}

function actions(data) {
  playBirthdaySong(data.birthday);
}

function playBirthdaySong(birthday){
  console.log(birthday);
}
