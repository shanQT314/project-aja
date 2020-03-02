// const { workerData, parentPort } = require('worker_threads');
var speech = require('@google-cloud/speech');
var path = require('path');
var ffmpeg = require('fluent-ffmpeg');

const client = new speech.SpeechClient({
    projectId: 'aja-transcriber',
    keyFilename: './aja.json'
});

let transcribe = function (toTranscribe) {
    ffmpeg(toTranscribe).output('./media/temp.wav')
        .setDuration(30)
        .setStartTime('00:00:00')
        .noVideo()
        .format('wav')
        .outputOptions('-ab', '192k')
        .on('end', function () {
            const fileName = 'temp.wav';

            const file = fs.readFileSync(fileName);
            const audioBytes = file.toString('base64');

            const audio = {
                content: audioBytes,
            };
            const config = {
                encoding: 'LINEAR16',
                sampleRateHertz: 48000,
                languageCode: 'en-US',
                audioChannelCount: 2,
                enableSeparateRecognitionPerChannel: true
            };
            const request = {
                audio: audio,
                config: config,
            };

            client
                .recognize(request)
                .then(data => {
                    const response = data[0];
                    const transcription = response.results
                        .map(result => result.alternatives[0].transcript);
                    return transcription
                })
                .catch(err => {
                    console.error('ERROR:', err);
                });
        })
        .run();
}();

transcribe(workerData);
parentPort.postMessage(workerData);