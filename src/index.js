require('dotenv').config();
const Express = require('express');
const AWS = require('aws-sdk');
const fs = require('fs');
const app = Express();

const port = process.env.PORT || 3000;
const collectionId = process.env.AWS_COLLECTION_ID;
const similarityThreshold = process.env.SIMILARITY_THRESHOLD;
const localDirectory = process.env.LOCAL_DIRECTORY;

AWS.config.update({region: process.env.AWS_REGION});
const rekognition = new AWS.Rekognition();

app.get('/', (req, res) => {
  let sourceImage = fs.readFileSync(localDirectory + 'angelina-jolie2.jpeg', 'base64',
    function (err,data) {
      if (err) console.log(err);
      else return data;
    });

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
     else     console.log(data.FaceMatches[0].Face);          
   });
});

app.listen(port);
