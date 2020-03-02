var MongoClient = require('mongodb').MongoClient;
const cookie = require('cookie');
var crypto = require('crypto');
const oid = require('mongodb').ObjectID;

var url = "mongodb://dbAdmin:123password123@ajacluster-shard-00-00-nmcvm.mongodb.net:27017,ajacluster-shard-00-01-nmcvm.mongodb.net:27017,ajacluster-shard-00-02-nmcvm.mongodb.net:27017/test?ssl=true&replicaSet=AJACluster-shard-0&authSource=admin&retryWrites=true";
var db;

// Initialize connection once
MongoClient.connect(url, function (err, client) {
    if (err) throw err;
    db = client.db('mydb');;
});

function generateSalt() {
    return crypto.randomBytes(16).toString('base64');
}

function generateHash(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    return hash.digest('base64');
}

module.exports = {
    userRegister: (function (req, res, userItem) {
        db.collection('users').find({
            username: userItem.username
        }).toArray(function (err, user) {
            if (err) return res.status(500).end(err);
            if (user.length != 0) return res.status(409).end("username " + userItem.username + " already exists");
            db.collection('users').insertOne(userItem, function (err) {
                if (err) return res.status(500).end(err);
                db.collection('users').update(
                    { username: userItem.username },
                    {
                        $currentDate: {
                            createtime: true
                        }
                    },
                    { upsert: true }
                )
                res.setHeader('Set-Cookie', cookie.serialize('username', userItem.username, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7
                }));
                // start a session
                req.session.user = userItem.username;
                return res.json("user " + userItem.username + " signed up");
            });
        });
    }),

    userSignIn: (function (req, res, username, userpassword) {
        db.collection('users').find({
            username: username
        }).toArray(function (err, user) {
            if (err) return res.status(500).end(err);
            if (user == 0) return res.status(401).end("access denied");
            if (user[0].hash !== generateHash(userpassword, user[0].salt)) return res.status(401).end("access denied"); // invalid password
            res.setHeader('Set-Cookie', cookie.serialize('username', user[0].username, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7
            }));
            // start a session
            req.session.user = user[0].username;
            return res.json("user " + username + " signed in");
        });
    }),

    userGetAll: (function (res) {
        db.collection('users').find({}).toArray(function (err, user) {
            return res.json(user);
        });
    }),

    userGetOne: (function (res, username) {
        db.collection('users').find({
            username: username
        }).toArray(function (err, user) {
            if (err) return res.status(500).end(err);
            if (user == 0) return res.status(404).end("User id #" + username + " does not exists");
            res.json(user);
        });
    }),

    userPatch: (function (res, username, password, oldpassword) {
        newhash = generateSalt();

        db.collection('users').find({
            username: username
        }).toArray(function (err, user) {
            if (err) return res.status(500).end(err);
            if (user == 0) return res.status(404).end("User not found");
            if (user[0].hash !== generateHash(oldpassword, user[0].salt)) return res.status(401).end("access denied"); // invalid password
            if (user[0].username !== req.session.user.username) return res.status(401).end(" Access Denied"); //can't alter other user's info
            db.collection('users').updateOne({
                username: username
            }, {
                    $set: {
                        salt: generateHash(password, newhash),
                        hash: newhash
                    }
                }, function (err, response) {
                    if (err) return res.status(500).end(err);
                    if (response.result.ok === 1) return res.json("Password modified");
                });
        });
    }),

    deleteAll: (function (res) {
        db.collection('users').deleteMany({}, function (err, response) {
            if (err) return res.status(500).end(err);
            res.json('Database deleted');
        });
    }),

    deleteOne: (function (res, username) {
        db.collection('users').find({
            username: username
        }).toArray(function (err, user) {
            if (err) return res.status(500).end(err);
            if (user == 0) return res.status(404).end("User id # " + username + " does not exists");
            if (user[0].username !== req.session.user.username) return res.status(401).end(" Access Denied"); // can't delete other users
            db.collection('users').deleteOne({
                username: user[0].username
            }, function (err, response) {
                if (err) console.log(err);
                res.json(response);
            });
        });
    }),

    uploadSource: (function (res, sourceItem) {
        db.collection('sources').find({
            owner: sourceItem.userid,
            name: sourceItem.name
        }).toArray(function (err, source) {
            if (err) return res.status(500).end(err.toString());
            if (source != 0) return res.status(409).end("video " + sourceItem + " already exists");
            db.collection('sources').insertOne(sourceItem, function (err) {
                if (err) return res.status(500).end(err.toString());
                db.collection('sources').update(
                    { owner: sourceItem.owner, name: sourceItem.name },
                    {
                        $currentDate: {
                            createtime: true
                        }
                    },
                    { upsert: true }
                )
                return res.json(sourceItem);
            });
        });
    }),

    getInfoByVideoId: (function (userid, videoname, res) {
        db.collection('sources').find({
            owner: userid,
            name: videoname
        }).toArray(function (err, source) {
            if (err) return res.status(500).end(err);
            if (source == 0) return res.status(409).end("video's by " + userid + " don't exist");
            res.json(source[0]);
        });
    }),

    getAllVideosByUserId: (function (userid, res) {
        db.collection('sources').find({
            owner: userid,
        }).toArray(function (err, source) {
            if (err) return res.status(500).end(err);
            if (source == 0) return res.status(409).end("video's by " + userid + " don't exist");
            res.json(source);
        });
    }),
    getSource: (function (userid, videoid, res) {
        db.collection('sources').find({
            owner: userid,
            name: videoid
        }).toArray(function (err, source) {
            if (err) return res.status(500).end(err);
            if (source == 0) return res.status(409).end("video's by " + userid + " don't exist");
            res.setHeader('Content-Type', source[0].video.mimetype);
            res.sendFile(source[0].video.path);
        });
    }),

    deleteSource: (function (userid, videoid, req, res) {
        db.collection('sources').find({
            owner: userid,
            name: videoid
        }).toArray(function (err, source) {
            if (err) return res.status(500).end(err);
            if (source == 0) return res.status(409).end("video not found");
            if (source[0].owner !== req.session.user) return res.status(401).end(" Access Denied"); // cant delete other user's sources

            db.collection('sources').deleteOne({
                _id: source[0]._id
            }, function (err, obj) {
                if (err) return res.status(500).end(err)
                else return res.json("File deleted");
            });
        });
    }),

    getNextSource: (function (userid, videoid, res) {
        db.collection('sources').find({
            owner: userid,
            name: videoid
        }).toArray((err, val) => {
            if (err) return res.status(500).end(err);
            else if (val == 0) return res.status(404).end("Wrong source ID");

            else db.collection('sources').find({ _id: { $gt: oid(val[0]._id) }, owner: userid }).limit(1).toArray((err, next) => {
                if (next == 0) db.collection('sources').find({ _id: { $lt: oid(val[0]._id) }, owner: userid }).sort({ _id: 1 }).limit(1).toArray((err, first) => {
                    if (first == 0) return res.json(val[0]);
                    else return res.json(first[0]);
                });
                else if (err) return res.status(500).end(err);
                else return res.json(next[0]);
            })
        })
    }),

    getPreviousSource: (function (userid, videoid, res) {
        db.collection('sources').find({
            owner: userid,
            name: videoid
        }).toArray((err, val) => {
            if (err) return res.status(500).end(err);
            else if (val == 0) return res.status(404).end("Wrong source ID found");

            else db.collection('sources').find({ _id: { $lt: oid(val[0]._id) }, owner: userid }).sort({ _id: -1 }).limit(1).toArray((err, next) => {
                if (next == 0) db.collection('sources').find({ _id: { $gt: oid(val[0]._id) }, owner: userid }).sort({ _id: -1 }).limit(1).toArray((err, first) => {
                    if (first == 0) return res.json(val[0]);
                    else return res.json(first[0]);
                });
                else if (err) return res.status(500).end(err);
                else return res.json(next[0]);
            })
        })
    })
}