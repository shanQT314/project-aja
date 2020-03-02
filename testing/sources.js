process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testing');

chai.use(chaiHttp);
process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('./testing');

chai.use(chaiHttp);

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

/**
 * Testing authentication and validation
 */
describe('/api/users', function () {
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
                    .get('/api/sources/ahmad/actualvideo')
                    .expect(res).to.have.status(200)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/sources/ahmad')
                    .expect(res).to.have.status(200)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/sources/ahmad/actualvideo/source')
                    .expect(res).to.have.status(200)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/sources/ahmad/actualvideo/next')
                    .expect(res).to.have.status(200)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/sources/ahmad/actualvideo/previous ')
                    .expect(res).to.have.status(200)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .delete('/api/sources/ahmad/actualvideo/')
                    .expect(res).to.have.status(200)
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
            .expect(res).to.have.status(403)
            .expect(res).to.be.json
            .then(function (res) {
                expect(res).to.have.cookie('sessionid');

                chai.request(server)
                    .get('/api/sources/dummy/actualvideo')
                    .expect(res).to.have.status(401)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/sources/dummy/')
                    .expect(res).to.have.status(401)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/sources/dummy/actualvideo/source')
                    .expect(res).to.have.status(401)
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .delete('/api/sources/dummy/actualvideo')
                    .expect(res).to.have.status(401)
                    .expect(res).to.be.json
                    .end((err) => {
                        if (err) return done(err);
                        done();
                    });
                chai.request(server)
                    .get('/api/delete/ ')
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


