var datab = require('./db');
var validator = require('validator');
// const { Worker } = require('worker_threads');


var Source = (function () {
    return function item(data, video) {
        this.owner = data.userid;
        this.name = data.videoid;
        this.video = video;
    };
}());

var checker = (function checkProperties(obj) {
    for (var key in obj) {
        if (obj[key] === null || obj[key] === "")
            return false;
    }
    return true;
});

var alphaCheck = (function (text) {
    if (!validator.isAlphanumeric(text) || validator.isEmpty(text)) return false;
    else return true;
});

var emptyCheck = (function (text) {
    if (validator.isEmpty(text)) return false;
    else return true;
});

module.exports = {
    uploadSource: (function (req, res, next) {
        var sourceItem = new Source(req.params, req.file);
        if (!checker(sourceItem)) return res.status(400).end("Invalid arguments");
        else if (req.params.userid !== req.session.user) res.status(401).end("Access Denied");
        else datab.uploadSource(res, sourceItem);

        // const worker = new Worker('./workers.js', { workerData: req.file });

        // worker.on('error', function (err) {
        //     console.log(err);
        // });

        // worker.on('exit', (tags) => {
        //     datab.updateTags(sourceItem, tags);
        // });
    }),
    getVideoInformationByVideoId: (function (req, res, next) {
        if (!alphaCheck(req.params.userid) || !alphaCheck(req.params.videoid)) return res.status(400).end("Invalid arguments")
        else datab.getInfoByVideoId(validator.escape(req.params.userid), validator.escape(req.params.videoid), res);
    }),
    getAllVideosByUserId: (function (req, res, next) {
        if (!alphaCheck(req.params.userid)) return res.status(400).end("Invalid arguments")
        else datab.getAllVideosByUserId(validator.escape(req.params.userid), res);
    }),
    getSource: (function (req, res, next) {
        if (!alphaCheck(req.params.userid) || !alphaCheck(req.params.videoid)) return res.status(400).end("Invalid arguments")
        else datab.getSource(validator.escape(req.params.userid), validator.escape(req.params.videoid), res);
    }),

    deleteSource: (function (req, res, next) {
        if (!alphaCheck(req.params.userid) || !alphaCheck(req.params.videoid)) return res.status(400).end("Invalid arguments")
        else datab.deleteSource(validator.escape(req.params.userid), validator.escape(req.params.videoid), req, res);
    }),

    getNext: (function (req, res, next) {
        if (!alphaCheck(req.params.userid) || !alphaCheck(req.params.videoid)) return res.status(400).end("Invalid arguments")
        else datab.getNextSource(validator.escape(req.params.userid), validator.escape(req.params.videoid), res);
    }),
    getPrevious: (function (req, res, next) {
        if (!alphaCheck(req.params.userid) || !alphaCheck(req.params.videoid)) return res.status(400).end("Invalid arguments")
        else datab.getPreviousSource(validator.escape(req.params.userid), validator.escape(req.params.videoid), res);
    })
};