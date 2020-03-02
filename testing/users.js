process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testing');

chai.use(chaiHttp);

/**
 * Testing registering and logging in
 */
describe('POST /api/users', function () {
    let data = {
        "username": "ahmad",
        "password": "dummy",
        "bio": "dummy",
    }
    let baddata = {
        "username": "",
        "password": "dummy",
        "bio": "dummy"
    }
    it('respond with JSON created', function (done) {
        chai.request(server)
            .post('/api/users/')
            .send(data)
            .set('Accept', 'application/json')
            .expect(res).to.have.status(200)
            .expect(res).to.be.json
            .end((err) => {
                if (err) return done(err);
                done();
            });
        done();
    });
    it('respond with 400 invalid argument', function (done) {
        chai.request(server)
            .post('/api/users/')
            .send(baddata)
            .set('Accept', 'application/json')
            .expect(res).to.have.status(400)
            .expect(res).to.be.json
            .end((err) => {
                if (err) return done(err);
                done();
            });
        done();
    });
    it('respond with 409 that the user already exists', function (done) {
        chai.request(server)
            .put('/api/users/')
            .send(data)
            .set('Accept', 'application/json')
            .expect(res).to.have.status(200)
            .expect(res).to.be.json
            .end((err) => {
                if (err) return done(err);
                done();
            });
        done();
    });
});

/**
 * Testing authentication and other features
 */
describe('POST /api/users', function () {
    let data = {
        "username": "ahmad",
        "password": "dummy",
        "bio": "dummy",
    }

    it('Check whether cookies and sessions work', function (done) {
        chai.request(server)
            .put('/api/users/')
            .send(data)
            .set('Accept', 'application/json')
            .expect(res).to.have.status(200)
            .expect(res).to.be.json
            .then(function (res) {
                expect(res).to.have.cookie('sessionid');

                chai.request(server)
                    .get('/api/users/all')
                    .expect(res).to.have.status(200)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/users/ahmad')
                    .expect(res).to.have.status(200)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/delete/dummy')
                    .expect(res).to.have.status(401)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/delete/someones')
                    .expect(res).to.have.status(404)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/delete/ ')
                    .expect(res).to.have.status(404)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
        done();
    });
    it('respond with 401 invalid argument', function (done) {
        chai.request(server)
            .put('/api/users/')
            .send(baddata)
            .set('Accept', 'application/json')
            .expect(res).to.have.status(200)
            .expect(res).to.be.json
            .then(function (res) {
                expect(res).to.have.cookie('sessionid');

                chai.request(server)
                    .get('/api/users/all')
                    .expect(res).to.have.status(401)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/users/ahmad')
                    .expect(res).to.have.status(401)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/delete/dummy')
                    .expect(res).to.have.status(401)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .delete('/api/users/someones')
                    .expect(res).to.have.status(401)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .delete('/api/users/ ')
                    .expect(res).to.have.status(401)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
            });
        done();
    });

});


