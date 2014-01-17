'use strict';

var should = require('should');
var a = require('../');

describe('waterfall()', function () {
  it('should run tasks in a waterfall', function (done) {
    var cb = false, cc = false;
    function b (next) {
      cb = true;
      cc.should.not.be.ok;
      next(null, 'a');
    }
    function c (d, next) {
      cc = true;
      cb.should.be.ok;
      d.should.equal('a');
      next(null, 'b');
    }
    function d (err, result) {
      should(err).be.not.ok;
      cb.should.be.ok;
      cc.should.be.ok;
      result.should.equal('b');
      done();
    }
    a.waterfall([b,c],d);
  });
});

describe('series()', function () {
  it('should run tasks in a series as array', function (done) {
    var cb = false, cc = false, cd = false;
    function b (next) {
      cb = true;
      cc.should.not.be.ok;
      next(null, 'a');
    }
    function c (next) {
      cc = true;
      cb.should.be.ok;
      next(null, 'b');
    }
    function d (err, results) {
      cd = true;
      should(err).be.not.ok;
      cb.should.be.ok;
      cc.should.be.ok;
      results.length.should.equal(2);
      results[0].should.equal('a');
      results[1].should.equal('b');
      done();
    }
    a.series([b,c],d);
  });

  it('should run tasks in a series as object', function (done) {
    var cb = false, cc = false, cd = false;
    function b (next) {
      cb = true;
      cc.should.not.be.ok;
      next(null, 'a');
    }
    function c (next) {
      cc = true;
      cb.should.be.ok;
      next(null, 'b');
    }
    function d (err, results) {
      cd = true;
      should(err).be.not.ok;
      cb.should.be.ok;
      cc.should.be.ok;
      should(Object.keys(results).length).equal(2);
      results.e.should.equal('a');
      results.f.should.equal('b');
      done();
    }
    a.series({ e: b, f: c }, d);
  });

  it('should short-circuit on error', function (done) {
    var cb = false, cc = false, cd = false;
    function b (next) {
      cb = true;
      cc.should.not.be.ok;
      next('d', 'a');
    }
    function c (next) {
      cc = true;
      cb.should.be.ok;
      next(null, 'b');
    }
    function d (err, results) {
      cd = true;
      err.should.be.ok;
      err.should.equal('d');
      cb.should.be.ok;
      cc.should.not.be.ok;
      should(results).be.not.ok;
      done();
    }
    a.series([b,c],d);
  });
});

describe('parallel()', function () {
  it('should run tasks in a parallel as array', function (done) {
    var cb = false, cc = false, cd = false;
    function b (next) {
      cb = true;
      cc.should.not.be.ok;
      next(null, 'a');
    }
    function c (next) {
      cc = true;
      cb.should.be.ok;
      next(null, 'b');
    }
    function d (err, results) {
      cd = true;
      should(err).be.not.ok;
      cb.should.be.ok;
      cc.should.be.ok;
      results.length.should.equal(2);
      should(results[0]).equal('a');
      should(results[1]).equal('b');
      done();
    }
    a.parallel([b,c],d);
  });

  it('should run tasks in a parallel as object', function (done) {
    var cb = false, cc = false;
    function b (next) {
      cb = true;
      cc.should.not.be.ok;
      next(null, 'a');
    }
    function c (next) {
      cc = true;
      cb.should.be.ok;
      next(null, 'b');
    }
    function d (err, results) {
      should(err).be.not.ok;
      cb.should.be.ok;
      cc.should.be.ok;
      should(Object.keys(results).length).equal(2);
      should(results.a).equal('a');
      should(results.d).equal('b');
      done();
    }
    a.parallel({ a: b, d: c }, d);
  });

  it('should short-circuit on error', function (done) {
    function b (next) {
      next('b', 'a');
    }
    function c (next) {
      next(null, 'b');
    }
    function d (err, results) {
      should(err).be.ok;
      should(err).equal('b');
      should(results).be.not.ok;
      done();
    }
    a.parallel([b,c],d);
  });
});

describe('map()', function () {
  it('should map array in parallel', function (done) {
    var n = 4;
    function t (i, done) {
      done(null, n++);
    }
    function d (err, results) {
      should(err).be.not.ok;
      results.length.should.equal(2);
      results.should.eql([4, 5]);
      done();
    }
    a.mapSeries(['b','c'],t,d);
  });

  it('should map object in parallel', function (done) {
    var n = 4;
    function t (i, done) {
      done(null, n++);
    }
    function d (err, results) {
      should(err).be.not.ok;
      should(Object.keys(results).length).equal(2);
      results.should.eql({ a: 4, b: 5 });
      done();
    }
    a.mapSeries({ a: 'b', b: 'c' }, t, d);
  });

  it('should short-circuit on error', function (done) {
    function t (i, done) {
      done(i);
    }
    function d (err, results) {
      should(err).be.ok;
      should(results).be.not.ok;
      done();
    }
    a.map(['b','c','e'],t,d);
  });
});

describe('mapSeries()', function () {
  it('should map array in a series', function (done) {
    var n = 4;
    function t (i, done) {
      done(null, n++);
    }
    function d (err, results) {
      should(err).be.not.ok;
      results.length.should.equal(2);
      results.should.eql([4, 5]);
      done();
    }
    a.mapSeries(['b','c'],t,d);
  });

  it('should map object in a series', function (done) {
    var n = 4;
    function t (i, done) {
      done(null, n++);
    }
    function d (err, results) {
      should(err).be.not.ok;
      should(Object.keys(results).length).equal(2);
      results.should.eql({ a: 4, b: 5 });
      done();
    }
    a.mapSeries({ a: 'b', b: 'c' }, t, d);
  });

  it('should short-circuit on error', function (done) {
    function t (i, done) {
      done(i);
    }
    function d (err, results) {
      should(err).be.ok;
      should(results).be.not.ok;
      done();
    }
    a.mapSeries(['b','c'],t,d);
  });
});
