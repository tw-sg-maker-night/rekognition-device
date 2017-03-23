const AWS = require('aws-sdk');
const Stream = require('stream');
const Speaker = require('speaker');
const { spawn } = require('child_process');

function Polly() {
  const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
  });

  // Using a child process as the Speaker module in Node crashed after speaking,
  // I've looked everywhere, apparently there's no solution.
  // Sadly, we'll just have to let it crash silently. :(
  const speaker = spawn('node', ['./src/speaker.js']);

  this.speak = function(text) {
    let params = {
      'Text': text,
      'OutputFormat': 'pcm',
      'VoiceId': 'Geraint'
    }

    Polly.synthesizeSpeech(params, (err, data) => {
      if (err) {
        console.log(err.code)
      } else if (data && data.AudioStream instanceof Buffer) {
        let bufferStream = new Stream.PassThrough();
        bufferStream.end(data.AudioStream);
        bufferStream.pipe(speaker.stdin);
      }
    })
  }
}

module.exports = Polly;
