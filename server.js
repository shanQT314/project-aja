const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const moment = require('moment');
const fs = require('fs');
const validator = require('validator');
var session = require('express-session');
const cookie = require('cookie');


const users = require('./routes/users');
const sources = require('./routes/sources');
const editing = require('./routes/editing')

const MongoClient = require('mongodb').MongoClient;
const oid = require('mongodb').ObjectID;

const url = "mongodb://dbAdmin:123password123@ajacluster-shard-00-00-nmcvm.mongodb.net:27017,ajacluster-shard-00-01-nmcvm.mongodb.net:27017,ajacluster-shard-00-02-nmcvm.mongodb.net:27017/test?ssl=true&replicaSet=AJACluster-shard-0&authSource=admin&retryWrites=true";
let db;

MongoClient.connect(url, { useNewUrlParser: true }).then(client => {
  db = client.db('mydb');
  startServer();
});

const startServer = () => (process.env.NODE_ENV === "production") ?
  require("https").createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/splycr.u4ium.org/cert.pem', 'utf8'),
    key: fs.readFileSync('/etc/letsencrypt/live/splycr.u4ium.org/privkey.pem', 'utf8'),
    ca: fs.readFileSync('/etc/letsencrypt/live/splycr.u4ium.org/chain.pem', 'utf8')
  }, app).listen(443)
  : require("http").createServer(app).listen(3001);

var app = express();
app.use(bodyParser.json());

var upload = multer({
  dest: path.join(__dirname, 'uploads')
});

app.use(session({
  secret: 'project-aja-splycr-3][.;./-o0;,l98uyjbhl87r6tcruy534a2s32afty6iu9y8-moi',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname,
  process.env.NODE_ENV === "production" ? 'splycr/build/' : 'public/')
));

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use(cookieParser());

var sanitizeContent = function (req, res, next) {
  req.body.content = validator.escape(req.body.content);
  next();
}

app.use(function (req, res, next) {
  req.user = ('user' in req.session) ? req.session.user : null;
  var username = (req.user) ? req.user : '';
  res.setHeader('Set-Cookie', cookie.serialize('username', username, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
  }));
  next();
});

var isAuthenticated = function (req, res, next) {
  if (!req.user) return res.status(401).end("Access Denied");
  next();
};

var Project = (function () {
  return function Project(userid, title, clips, effects, container, codec) {
    this.owner = userid;
    this.title = title;
    this.clips = clips;
    this.effects = effects;
    this.container = container;
    this.codec = codec;
  };
}());

var Clip = (function () {
  return function item(data) {
    this.videoid = data.videoid;
    this.owner = data.owner;
    this.startTime = data.startTime;
    this.stopTime = data.stopTime;
    this.tags = data.tags;
  };
}());

let outp = path.join(__dirname, "/clips/");

var clipper = (function (path, clipItem, id, duration, res) {
  ffmpeg(path)
    .setStartTime(clipItem.startTime)
    // .screenshots({
    //     timestamps: ['00:01.000'],
    //     filename: id,
    //     folder: '/thumbnails/',
    //     size: '320x240'
    // })
    .setDuration(duration)
    .output(outp + id + ".mp4")

    .on('end', function (err) {
      res.sendFile(outp + id + ".mp4");
      // res.json(clipItem);
      if (!err) {
        console.log('conversion Done');
      }
    })

    .on('error', function (err, stdout, stderr) {
      console.log("ffmpeg stdout:\n" + stderr);
    }).run();
});

// All video editing functions have been moved to ./routes/editing

var checker = (function checkProperties(obj) {
  for (var key in obj) {
    if (obj[key] === null || obj[key] === "")
      return false;
  }
  return true;
});

// ---------------------------------------------------------------------------------
// Users

//  curl -X POST -H "Content-Type: application/json" -d '{"username": "admin", "password": "pass", "bio": "bio"}' http://localhost:3001/api/users
app.post('/api/users/', users.userRegister);

// curl -X PUT -H "Content-Type: application/json" -d '{"username": "admin", "password": "pass"}' http://localhost:3001/api/users/
app.put('/api/users/', users.userSignIn);

// Signs the current user out
app.get('/api/signout/', function (req, res, next) {
  req.session.destroy();
  res.setHeader('Set-Cookie', cookie.serialize('username', '', {
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week in number of seconds
  }));
  res.end("signed out");
});

// curl -X GET http://localhost:3001/api/users/all/
app.get('/api/users/all', isAuthenticated, users.userGetAll);

// curl -X GET http://localhost:3001/api/users/:username/
app.get('/api/users/:username', isAuthenticated, users.userGetOne);

// // curl -X PATCH -H "Content-Type: application/json" -d '{"username": "admin", "password": "newpass","oldpassword": "pass"}' http://localhost:3001/api/users/
app.patch('/api/users/', isAuthenticated, users.userPatch);

// curl -X DELETE http://localhost:3001/api/users/:username
app.delete('/api/users/:username', isAuthenticated, users.deleteUser);

// ---------------------------------------------------------------------------------
// Sources

// curl -F 'source=@test.mp4' http://localhost:3001/api/sources/12/
app.post('/api/sources/:userid/:videoid', isAuthenticated, upload.single('sources'), sources.uploadSource);

// curl -X GET  http://localhost:3001/api/sources/userid/thing
app.get('/api/sources/:userid/:videoid', isAuthenticated, sources.getVideoInformationByVideoId);

// curl -X GET http://localhost:3001/api/userid
app.get('/api/sources/:userid/', isAuthenticated, sources.getAllVideosByUserId);

// curl -X GET  http://localhost:3001/api/sources/videoid/thing/source
app.get('/api/sources/:userid/:videoid/source', isAuthenticated, sources.getSource);

// curl -X DELETE http://localhost:3001/api/sources/1
app.delete('/api/sources/:userid/:videoid', isAuthenticated, sources.deleteSource);

// curl -X GET http://localhost:3000/api/sources/videoid/next
app.get('/api/sources/:userid/:videoid/next', isAuthenticated, sources.getNext);

// curl -X GET http://localhost:3000/api/sources/videoid/next
app.get('/api/sources/:userid/:videoid/previous', isAuthenticated, sources.getPrevious);

// ---------------------------------------------------------------------------------
// Projects

// curl -X POST -H "Content-Type: application/json" -d '{"title": "First project", "effects": "[russia]","clips": ["5ca00c76fa7f5d0b6c2824c0", "5ca00c8cfa7f5d0b6c2824c1"], "container": "something", "codec": "somethingelse"}' http://localhost:3000/api/projects/admin
app.post("/api/projects/:userid", isAuthenticated, function (req, res, next) {
  let project = new Project(
    req.params.userid,
    req.body.title,
    req.body.clips,
    req.body.effects,
    req.body.container,
    req.body.codec
  );
  if (!checker(project)) res.status(400).end("Invalid arguments");
  if (project.owner !== req.session.user) return res.status(401).end("Access Denied"); //cant post projects on behalf of other users
  db.collection('projects').update({ owner: project.owner, title: project.title }, project, { upsert: true }, (err) => {
    if (err) res.status(500).end(err.toString())
    db.collection('projects').update(
      { owner: project.owner, title: project.title },
      {
        $currentDate: {
          createtime: true
        }
      },
      { upsert: true }, (err) => {
        if (err) res.status(500).end(err.toString());
      }
    )
    res.json(project)
  }
  );
});

// // curl -X POST -d "title=title&tags=["putin","saudi",""]&clipids=["5ca00c76fa7f5d0b6c2824c0", "5ca00c8cfa7f5d0b6c2824c1"]&container=output&codec=output" http://localhost:3000/api/projects/:userid
app.patch("/api/projects/:userid/:projectid/", isAuthenticated, function (req, res, next) {
  let project = new Project(
    req.params.userid,
    req.body.title,
    req.body.clips,
    req.body.effects,
    req.body.container,
    req.body.codec
  );
  if (project.owner !== req.session.user) return res.status(401).end("Access Denied"); //cant patch projects on behalf of other users
  if (!checker(project)) res.status(400).end("Invalid arguments");
  db.collection('projects').updateOne({ _id: oid(req.params.projectid) }, {
    $set: {
      title: req.body.title,
      tags: req.body.tags,
      clips: req.body.clips,
      container: req.body.container,
      codec: req.body.codec
    }
  }, { upsert: true }, err => err ? res.status(500).end(err.message) : res.json(project));
});


// curl -X GET  http://localhost:3001/api/projects/KdHiNamDajGl1EyG/projectid
app.get('/api/projects/:userid/:projectid', function (req, res, next) {
  db.collection('projects').find({
    _id: oid(req.params.projectid),
    owner: req.params.userid
  }).toArray(function (err, project) {
    if (err) return res.status(500).end(err);
    if (project == 0) return res.status(404).end("Project doesn't exist");
    return res.json(project[0]);
  });
});

// curl -X GET  http://localhost:3001/api/projects/KdHiNamDajGl1EyG/
app.get('/api/projects/:userid/', function (req, res, next) {
  db.collection('projects').find({
    owner: req.params.userid
  }).toArray(function (err, project) {
    if (err) return res.status(500).end(err);
    if (project == 0) return res.status(404).end("Projects doesn't exist");
    return res.json(project);
  });
});

// curl -X GET  http://localhost:3001/api/projects/
app.get('/api/projects/', function (req, res, next) {
  db.collection('projects').find({}).toArray(function (err, project) {
    if (err) return res.status(500).end(err);
    if (project == 0) return res.status(404).end("Projects doesn't exist");
    return res.json(project);
  });
});


// curl -X GET  http://localhost:3001/api/projects/KdHiNamDajGl1EyG/projectid/source
app.get('/api/projects/:userid/:projectid/source', function (req, res, next) {
  db.collection('projects').find({
    _id: oid(req.params.projectid),
    owner: req.params.userid
  }).toArray(function (err, project) {
    if (err) return res.status(500).end(err);
    if (project == 0) return res.status(404).end("Projects doesn't exist");
    res.sendFile("/projects/" + project[0]._id);
  });
});

// // curl -X DELETE  http://localhost:3001/api/projects/KdHiNamDajGl1EyG/projectid
app.delete('/api/projects/:userid/:projectid', isAuthenticated, function (req, res, next) {
  if (req.params.userid !== req.session.user) return res.status(401).end(" Access Denied"); //cant delete other user's projects
  db.collection('projects').deleteOne({
    _id: oid(req.params.projectid),
    owner: req.params.userid
  }, function (err, doc) {
    if (err) return doc.status(500).end(err);
    if (doc.result.ok == 0) return doc.status(404).end("Project doesn't exist");
    return res.json("Deleted successfully");
  });
});

// // curl -X DELETE  http://localhost:3001/api/projects/KdHiNamDajGl1EyG/
app.delete('/api/projects/:userid/', function (req, res, next) {
  if (req.params.userid === "all") {
    db.collection('projects').deleteMany({}, function (err, doc) {
      if (err) return doc.status(500).end(err);
      if (doc.result.ok == 0) return doc.status(404).end("User doesn't have any projects");
      return res.json("Deleted successfully");
    });
  } else {
    if (req.params.userid !== req.session.user) return res.status(401).end(" Access Denied"); //cant delete other user's projects

    db.collection('projects').deleteMany({
      owner: req.params.userid
    }, function (err, doc) {
      if (err) return doc.status(500).end(err);
      if (doc.result.ok == 0) return doc.status(404).end("User doesn't have any projects");
      return res.json("Deleted successfully");

    })
  };
});

// app.patch("/api/projects/:userid/:projectid/", (req, res, next) => {
//   if (req.params.userid !== req.session.user) return res.status(401).end(" Access Denied"); // cant post on behalf of other users
//   projects.update({ _id: req.params.projectid });
// });

// ---------------------------------------------------------------------------------
// Clips 

// Garbage code that does the job of creating a new clip 
// curl -X POST -H "Content-Type: application/json" -d '{"videoid": "thing", "owner": "KdHiNamDajGl1EyG","startTime": "00:00:01","stopTime": "00:00:03", "tags": ["tag1", "tag2"]}' http://localhost:3001/api/clips
app.post('/api/clips/', isAuthenticated, function (req, res, next) {
  var clipItem = new Clip(req.body);
  if (!checker(clipItem)) return res.status(400).end("Invalid arguments");
  if (clipItem.owner !== req.session.user) return res.status(401).end(" Access Denied"); // cant post on behalf of other users

  // var start = moment.utc(clipItem.startTime, "HH:mm:ss");
  // var end = moment.utc(clipItem.stopTime, "HH:mm:ss");
  // var duration = end.diff(start, 'seconds');

  db.collection('sources').find({
    name: clipItem.videoid
  }).toArray(function (err, source) {
    if (err) return res.status(500).end(err);
    if (source == 0) return res.status(409).end('source doesnt exist');
    db.collection('clips').find(clipItem).toArray(function (err, clip) {
      if (err) return res.status(500).end(err);
      if (clip != 0) return res.status(409).end("clip " + clipItem + " already exists");
      db.collection('clips').insertOne({
        owner: clipItem.owner,
        videoid: clipItem.videoid,
        startTime: clipItem.startTime,
        stopTime: clipItem.stopTime,
        tags: clipItem.tags,
        path: "/clips/",
        // thumbnail: '/thumbnails/'
      })
      return res.status(200).end();
      // .then(function (result) {
      //   db.collection('clips').updateOne({
      //     _id: result.ops[0]._id
      //   }, {
      //       $set: {
      //         path: "/clips/" + result.ops[0]._id + ".mp4",
      //         thumbnail: '/thumbnails/' + result.ops[0]._id
      //       }
      //     });
      //   // Todo: Create a worker that takes care of clipping the video
      //   clipper(source[0].video.path, clipItem, result.ops[0]._id, duration, res);
      //   if (err) return res.status(500).end(err);
      // });
    });
  });
});

// curl -X POST -H "Content-Type: application/json" -d '{"videoid": "thing", "owner": "KdHiNamDajGl1EyG","startTime": "00:00:01","stopTime": "00:00:03", "tags": ["tag1", "tag2"]}' http://localhost:3001/api/clips
app.post('/api/clips/:clipid', isAuthenticated, function (req, res, next) {
  var clipItem = new Clip(req.body);
  if (!checker(clipItem)) return res.status(400).end("Invalid arguments");

  var start = moment.utc(clipItem.startTime, "HH:mm:ss");
  var end = moment.utc(clipItem.stopTime, "HH:mm:ss");
  var duration = end.diff(start, 'seconds');

  db.collection('sources').find({
    name: req.params.videoid
  }).toArray(function (err, source) {
    if (err) return res.status(500).end(err);
    if (source == 0) return res.status(409).end('source doesnt exist');
    if (clipItem.owner !== req.session.user) return res.status(401).end(" Access Denied"); // cant post on behalf of other users
    db.collection('clips').update({
      _id: oid(req.params.clipid)
    }, {
        $set: {
          startTime: clipItem.startTime,
          stopTime: clipItem.stopTime,
        }
      })
    res.json("Patched up");
    // clipper("/sources/" + source.video.path, clipItem, video._id, duration, res);
    if (err) return res.status(500).end(err);
  });
});


// // curl -X PATCH -H "Content-Type: application/json" -d '{"videoid": "thing", "owner": "KdHiNamDajGl1EyG","startTime": "00:00:01","stopTime": "00:00:03", "tags": ["tag1", "tag2"]}' http://localhost:3001/api/clips
app.patch('/api/clips/:clipid', isAuthenticated, function (req, res, next) {
  var clipItem = new Clip(req.body);
  if (!checker(clipItem)) return res.status(400).end("Invalid arguments");

  var start = moment.utc(clipItem.startTime, "HH:mm:ss");
  var end = moment.utc(clipItem.stopTime, "HH:mm:ss");
  var duration = end.diff(start, 'seconds');

  if (clipItem.owner !== req.session.user) return res.status(401).end(" Access Denied"); // cant post on behalf of other users

  db.collection('sources').find({
    name: clipItem.videoid
  }).toArray(function (err, source) {
    if (err) return res.status(500).end(err);
    if (source == 0) return res.status(409).end('source doesnt exist');
    db.collection('clips').find(clipItem).toArray(function (err, clip) {
      if (err) return res.status(500).end(err);
      if (clip != 0) return res.status(409).end("clip " + clipItem + " already exists");
      db.collection('clips').insertOne({
        owner: clipItem.owner,
        videoid: clipItem.videoid,
        startTime: clipItem.startTime,
        stopTime: clipItem.stopTime,
        tags: clipItem.tags,
        path: "/clips/",
        thumbnail: '/thumbnails/'
      }).then(function (result) {
        db.collection('clips').updateOne({
          _id: result.ops[0]._id
        }, {
            $set: {
              path: "/clips/" + result.ops[0]._id + ".mp4",
              thumbnail: '/thumbnails/' + result.ops[0]._id,
              startTime: clipItem.startTime,
              stopTime: clipItem.stopTime,
              tags: clipItem.tags,
            }
          });
        // Todo: Create a worker that takes care of clipping the video
        clipper(source[0].video.path, clipItem, result.ops[0]._id, duration, res);
        if (err) return res.status(500).end(err);
      });
    });
  });
});

// Returns all clips belonging to that user
// curl -X GET  http://localhost:3001/api/clips/KdHiNamDajGl1EyG
app.get('/api/clips/:userid/', function (req, res, next) {
  db.collection('clips').find({
    owner: req.params.userid,
  }).toArray(function (err, clips) {
    if (err) return res.status(500).end(err);
    if (clips == 0) return res.status(409).end("video's by " + req.params.userid + " don't exist");
    return res.json(clips);
  });
});

// Returns all available clips informations 
// curl -X GET  http://localhost:3001/api/clips/
app.get('/api/clips/', function (req, res, next) {
  db.collection('clips').find({}).toArray(function (err, clips) {
    if (err) return res.status(500).end(err);
    return res.json(clips);
  });
});

// // Returns information about a specific clip
// // curl -X GET http://localhost:3001/api/clips/1/1/1
app.get('/api/clips/:userid/:objectid/', function (req, res, next) {
  db.collection('clips').find({ videoid: req.params.objectid, owner: req.params.userid }
  ).toArray(function (err, clip) {
    if (err) return res.status(500).end(err.toString());
    if (clip == 0) {
      if (oid.isValid(req.params.objectid)) {
        db.collection('clips').find({ _id: oid(req.params.objectid) }).toArray(function (err, clips) {
          if (clips == 0) return res.status(400).end("No clips with those parameters");
          if (err) return res.status(500).end(err.toString());
          return res.json(clips);
        })
      } else {
        return res.status(400).end("No clips with those parameters");
      }
    } else {
      return res.json(clip);
    }
  })
});

// Returns the actual clip source
// curl -X GET  http://localhost:3001/api/clip/1/source/videoname
app.get('/api/clips/:userid/:clipid/source/', isAuthenticated, function (req, res, next) {
  db.collection('clips').find({
    owner: req.params.userid,
    _id: oid(req.params.clipid)
  }).toArray(function (err, clip) {
    if (err) return res.status(500).end(err);
    if (clip == 0) return res.status(409).end("video's by" + req.params.userid + " don't exist");
    // res.setHeader('Content-Type', clip[0].path.file.mimetype);
    res.sendFile(path.join(__dirname, clip[0].path));
  });
});

// Searches for clips
// curl -X GET -H "Content-Type: application/json" -d '["russia"]' http://localhost:3001/api/search/
app.post('/api/search/', function (req, res, next) {
  db.collection('clips').find({ tags: { $in: req.body } }).toArray(function (err, clips) {
    if (err) return res.status(500).end(err);
    return res.json(clips);
  });
});

// Deletes a specific video 
// curl -X DELETE  http://localhost:3001/api/clips/userid/videoid
app.delete('/api/clips/:userid/:videoid/:clipid', isAuthenticated, function (req, res, next) {
  db.collection('clips').find({
    _id: oid(req.params.clipid)
  }).toArray(function (err, clip) {
    if (err) return res.status(500).end(err);
    if (clip == 0) return res.status(409).end("clip's by" + req.params.userid + " don't exist");
    if (clip[0].owner !== req.session.user) return res.status(401).end(" Access Denied" + clip.owner + " " + req.session.user); //cant delete other user's clips
    db.collection('clips').deleteOne({
      _id: oid(req.params.clipid)
    }, function () {
      if (err) return res.status(500).end(err);
      return res.json("Success");
    });
  });
});

// Deletes all clips by a specific user
// curl -X DELETE http://localhost:3001/api/clips/user/KdHiNamDajGl1EyG
app.delete('/api/clips/:userid/', isAuthenticated, function (req, res, next) {
  if (req.params.userid === "all") {
    db.collection('clips').deleteMany({}, function (err) {
      if (err) return res.status(500).end(err);
      return res.json("Deleting succesful");
    });
  } else {
    db.collection('clips').find({
      owner: req.params.userid,
    }).toArray(function (err, clip) {
      if (err) return res.status(500).end(err);
      if (clip == 0) return res.status(409).end("clip's by" + req.params.userid + " don't exist");
      if (clip[0].owner !== req.session.user)
        return res.status(401).end(" Access Denied" + clip[0].owner + " " + req.session.user);
      //cant delete other user's projects
      db.collection('clips').deleteMany({
        owner: clip[0].owner
      }, function () {
        if (err) return res.status(500).end(err);
        return res.json("Deleting succesful");
      });
    });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error');
});
