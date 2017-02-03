require('dotenv').config();
const Express = require('express');
const AWS = require('aws-sdk');
const app = Express();

const port = process.env.PORT || 3000;
const s3Bucket = process.env.AWS_BUCKET_NAME;
const localDirectory = process.env.LOCAL_DIRECTORY
const similarityThreshold = process.env.SIMILARITY_THRESHOLD

AWS.config.update({region: process.env.AWS_REGION});
const rekognition = new AWS.Rekognition();
const s3 = new AWS.S3({Bucket:s3Bucket});

app.get('/', (req, res) => {
  var params = {
    SimilarityThreshold: similarityThreshold,
    SourceImage: {
      S3Object: {
        Bucket: s3Bucket,
        Name: 'angelina-jolie.jpeg'
      }
    },
    TargetImage: {
     S3Object: {
      Bucket: s3Bucket,
      Name: 'angelina-jolie.jpeg'
     }
    }
   };

   rekognition.compareFaces(params, function(err, data) {
     
     if (err) console.log(err, err.stack); // an error occurred
     else     console.log(data);           // successful response
   });
});

app.listen(port);
