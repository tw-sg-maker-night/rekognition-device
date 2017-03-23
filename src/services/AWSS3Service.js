
function AWSS3Service(){
  this.getData = function(obj){
    return new Promise(function(resolve, reject){
      let params = {
        Bucket: bucketName,
        Key: obj.ExternalImageId
      };

      s3.headObject(params, function(err, data) {
        if (err) reject(err);
        else resolve(data.Metadata);
      });
    });
  }
}

module.exports = AWSS3Service;
