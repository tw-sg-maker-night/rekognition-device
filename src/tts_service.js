const fetch = require('node-fetch');
const util = require('util');
const fs = require('fs');
const Stream = require('stream');
const Speaker = require('speaker');
const { spawn } = require('child_process');
const player = require('play-sound')(opts = {})
const uuid = require('uuid');

const voices = process.env.VOICES.split(",");

function TTSService() {

  this.sing = function(text) {
    let voice = randomVoice();

    let options = {
      method: 'POST',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: 'text='+text+'&voice='+voice
    }

    fetch(process.env.TTS_SERVICE_ENDPOINT, options).then(function(res){
      play(res.body);
      console.log('singing with ' + voice + 'voice');
    });
  }

  function randomVoice() {
    return voices[Math.floor(Math.random() * voices.length)];
  }

  function play(stream) {
    let filePath = 'tts/' + uuid.v1() + '.wav';

    let songFile = fs.createWriteStream(filePath);
    stream.pipe(songFile);

    songFile.on('finish', function() {
      player.play(filePath, function(err){
        if (err) console.log(err);

        console.log("Finished singing. Removing " + filePath);
        fs.unlink(filePath);
      })
    });
  }
}

module.exports = TTSService;
