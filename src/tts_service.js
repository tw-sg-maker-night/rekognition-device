const fetch = require('node-fetch');
const util = require('util');
const fs = require('fs');
const Stream = require('stream');
const Speaker = require('speaker');
const { spawn } = require('child_process');
const Sound = require('node-aplay');
var play = require('play');

function TTSService() {
  this.request = function(text) {
    console.log('here');

    fetch('http://localhost:4000/speak', {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'}, // this line is important, if this content-type is not set it wont work
      body: 'text='+text+'&voice=Good'
    }).then(function(res){
        var songFile = fs.createWriteStream('temp.wav');
        res.body.pipe(songFile);

        songFile.on('finish', function() {
          play.sound('temp.wav', function(){
            console.log("completed");
            fs.unlink('temp.wav');
          });
          console.log("after");
        });
    });
  }
}

module.exports = TTSService;
