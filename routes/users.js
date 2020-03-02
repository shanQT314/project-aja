var datab = require('./db');
const cookie = require('cookie');
var crypto = require('crypto');
const validator = require('validator');

var alphaCheck = (function (text) {
    if (!validator.isAlphanumeric(text) || validator.isEmpty(text)) return false;
    else return true;
});

var emptyCheck = (function (text) {
    if (validator.isEmpty(text)) return false;
    else return true;
});

function generateSalt() {
    return crypto.randomBytes(16).toString('base64');
}

function generateHash(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

var User = (function () {
    return function item(username, password, bio) {
        this.username = username;
        var salt = generateSalt();
        var hash = generateHash(password, salt);
        this.salt = salt;
        this.hash = hash;
        this.bio = validator.escape(bio);
    };
}());

var checker = function checkProperties(obj) {
    for (var key in obj) {
        if (obj[key] === null)
            return false;
    }
    return true;
};

module.exports = {
    userRegister: (function (req, res, next) {
        var userItem = new User(req.body.username, req.body.password, req.body.bio);
        if (!alphaCheck(req.body.username)) return res.status(400).end("Invalid arguments")
        if (!checker(userItem)) return res.status(400).end("Invalid arguments");

        datab.userRegister(req, res, userItem);
    }),

    userSignIn: (function (req, res, next) {
        if (!alphaCheck(req.body.username) || !emptyCheck(req.body.password)) return res.status(400).end("Invalid arguments");
        datab.userSignIn(req, res, req.body.username, validator.escape(req.body.password));
    }),

    userGetAll: (function (req, res, next) {
        datab.userGetAll(res);
    }),

    userGetOne: (function (req, res, next) {
        if (!alphaCheck(req.body.username)) return res.status(400).end("Invalid arguments");
        datab.userGetOne(res, validator.escape(req.params.username));
    }),

    userPatch: (function (req, res, next) {
        if (!alphaCheck(req.body.username) || !emptyCheck(req.body.password)) return res.status(400).end("Invalid arguments");
        datab.userPatch(res, req.body.username, validator.escape(req.body.password), req.body.oldpassword);
    }),

    deleteUser: (function (req, res, next) {
        if (!alphaCheck(req.body.username)) return res.status(400).end("Invalid arguments")
        if (req.params.username === "all") {
            datab.deleteAll(res);
        } else {
            datab.deleteOne(res, req.params.username);
        }
    })
};