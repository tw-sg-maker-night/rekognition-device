
function AWSDynamoDBService(AWS) {
  const dynamoDB = new AWS.DynamoDB();

  this.getData = function(obj){
    return new Promise(function(resolve, reject){
      let params = {
        Key: { 'userId': { S: obj.ExternalImageId } },
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
  };

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
  };
}

module.exports = AWSDynamoDBService;
