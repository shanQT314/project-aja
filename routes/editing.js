var ffmpeg = require('fluent-ffmpeg');

module.exports = {
    concatenator: (function (listOfItems, outPutFile) {
        var concatenated = ffmpeg();

        listOfItems.forEach(function (videoName) {
            concatenated.addInput(videoName);
        });

        concatenated.mergeToFile(outPutFile)
            .on('error', function (err) {
                console.log('Error ' + err.message);
            })
            .on('end', function () {
                console.log('Finished!');
            });
    }),

    makeSmaller: (function (path, output) {
        ffmpeg(path)
            .output(output)
            .audioCodec('copy')
            .size('320x200')

            .screenshots({
                timestamps: ['00:01.000'],
                filename: id,
                folder: '/thumbnails/',
                size: '320x240'
            })

            .on('error', function (err) {
                console.log('An error occurred: ' + err.message);
            })
            .on('end', function () {
                console.log('Processing finished !');
            })
            .run();
    }),

    addWaterMark: (function (path, output, text, color, size) {
        ffmpeg(path)
            .output(output)
            .videoFilters({
                filter: 'drawtext',
                options: {
                    fontfile: 'font.ttf',
                    text: text,
                    fontsize: size,
                    fontcolor: color,
                    x: '(main_w/2-text_w/2)',
                    y: 50
                }
            })
            .on('end', function () {
                console.log('Processing finished !');
            })
            .on('error', function (err, stdout, stderr) {
                console.log('error: ' + err.message);
            })
            .run();
    }),

    fadeIn: (function (path, output, time) {
        ffmpeg(path)
            .output(output)
            .videoFilters('fade=in:0:' + String(time) + "00")
            .on('end', function () {
                console.log('Processing finished !');
            })
            .on('error', function (err, stdout, stderr) {
                console.log('error: ' + err.message);
            })
            .run();
    }),

    fadeOut: (function (path, output, time) {
        ffmpeg(path)
            .output(output)
            .videoFilters('fade=in:' + time)
            .on('end', function () {
                console.log('Processing finished !');
            })
            .on('error', function (err, stdout, stderr) {
                console.log('error: ' + err.message);
            })
            .run();
    }),

    speedChange: (function (path, output, speedChange) {
        ffmpeg(path)
            .output(output)
            .videoFilters('setpts=PTS/' + speedChange)
            .audioFilters("atempo=" + speedChange)
            .on('end', function () {
                console.log('Processing finished !');
            })
            .on('error', function (err, stdout, stderr) {
                console.log('error: ' + err.message);
            })
            .run();
    }),

    rotate: (function (path, output, factor) {
        ffmpeg(path)
            .output(output)
            .videoFilters('transpose=' + factor)
            .on('end', function () {
                console.log('Processing finished !');
            })
            .on('error', function (err, stdout, stderr) {
                console.log('error: ' + err.message);
            })
            .run();
    })
}