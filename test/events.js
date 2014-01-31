define(['global/global', 'chai', 'global/global__utils'], function(ring, chai, utils) {
  'use strict';
  var o = ring();

  var expect = chai.expect;
  var expectDeferred = function(deferred) {
    if ('pipe' in deferred) {
      delete deferred.pipe;
    }

    return expect(deferred);
  };

  describe('Events', function () {
    var moduleName = 'test-Events-Module';

    o('add', moduleName, {
      testMethod: function(moduleRet) {
        return moduleRet;
      }
    });
    var module = ring(moduleName);

    describe('On and off', function () {
      var handler = function() {};

      it('subscribe on event should be true', function () {
        module.on('onoff-test-1', handler).should.be.equal(true);
      });

      it('subscribe on event should be true', function () {
        module.on('onoff-test-1', handler).should.be.equal(true);
      });

      it('scribe from event should be true', function () {
        module.off('onoff-test-1').should.be.equal(true);
      });

      it('unsubscribe from event should be false', function () {
        module.off('onoff-test-1').should.be.equal(false);
      });

      it('multiple subscribe on event should be true', function () {
        module.on('onoff-test-1 onoff-test-2 onoff-test-3', handler).should.be.equal(true);
      });

      it('multiple unsubscribe from event should be true', function () {
        module.off('onoff-test-1 onoff-test-2').should.be.equal(true);
      });

      it('unsubscribe from leaving event should be true', function () {
        module.off('onoff-test-3').should.be.equal(true);
      });

      it('dupe unsubscribe from multiple bound event should be true', function () {
        module.off('onoff-test-2').should.be.equal(false);
      });
    });

    describe('Trigger', function () {
      var handler = sinon.spy();
      var handler2 = sinon.spy();

      beforeEach(function(){
        handler.reset();
        handler2.reset();
      });

      module.on('test-2', handler);

      it('trigger should run functions', function () {
        module.trigger('test-2');
        handler.should.have.been.called;
      });

      it('second trigger should run functions', function () {
        module.trigger('test-2');
        module.trigger('test-2');
        module.trigger('test-2');
        handler.should.have.been.calledThrice;
      });

      it('trigger should run all functions', function () {
        module.on('test-2', handler2);
        module.trigger('test-2');
        handler.should.have.been.called;
        handler2.should.have.been.called;
      });

      it('trigger after unsubscribe should not run functions', function () {
        module.off('test-2');
        module.trigger('test-2', 1);
        handler.should.not.have.been.called;
      });

      it('all multiple bound events should have been triggered', function () {
        module.on('test-1 test-2 test-3', handler);
        module.trigger('test-1');
        module.trigger('test-2');
        module.trigger('test-3');
        handler.should.have.been.calledThrice;
      });

      it('all multiple unbound events should not have been triggered', function () {
        module.off('test-1 test-3', handler);
        module.trigger('test-1');
        module.trigger('test-2');
        module.trigger('test-3');
        handler.should.have.been.calledOnce;
      });
    });

    describe('One', function () {
      var handler = sinon.spy();

      it('one time subscribe on event should be true', function () {
        expect(module.one('one-test', handler)).to.be.equal(true);
      });

      it('one time trigger should run functions', function () {
        module.trigger('one-test', true);
        handler.should.have.been.called;
      });

      it('one time unsubscribe from event should be false', function () {
        expect(module.off('one-test')).to.be.equal(false);
      });

      it('second one time trigger should not run functions', function () {
        module.trigger('one-test', true);
        handler.should.have.been.calledOnce;
      });

    });

    describe('Wait', function () {
      var handler = sinon.spy();

      beforeEach(function(){
        handler.reset();
      });

      it('wait should return deferred', function () {
        utils.isDeferred(module.wait('wait-test')).should.be.true;
      });

      it('wait should run functions', function () {
        module.wait('wait-test1').then(handler);
        module.trigger('wait-test1', true);
        handler.should.have.been.called;
      });

      it('wait should run functions once', function () {
        module.wait('wait-test2').then(handler);
        module.trigger('wait-test2', true);
        module.trigger('wait-test2', true);
        handler.should.have.been.calledOnce;
      });

      it('wait promise should return triggered result', function () {
        var data = {};
        expectDeferred(module.wait('wait-test3')).eventually.equal(data);
        module.trigger('wait-test3', data);
      });

    });

    describe('Events on global module', function () {
      var handler = sinon.spy();

      beforeEach(function(){
        handler.reset();
      });

      it('subscribe on event on global should be true', function () {
        expect(o.on(moduleName + ':test-4', handler)).to.be.equal(true);
      });

      it('dupe subscribe on event on global should be true', function () {
        expect(o.on(moduleName + ':test-4', handler)).to.be.equal(true);
      });

      it('trigger on global should run functions', function () {
        o.trigger(moduleName + ':test-4', true);
        handler.should.have.been.called;
      });

      it('trigger set on global should run functions', function () {
        module.trigger('test-4', true);
        handler.should.have.been.called;
      });

      it('unsubscribe from event on global should be true', function () {
        expect(o.off(moduleName + ':test-4')).to.be.equal(true);
      });

      it('dupe unsubscribe from event on global should be false', function () {
        expect(o.off(moduleName + ':test-4')).to.be.equal(false);
      });

      it('unsubscribe on event set on global should be true', function () {
        o.on(moduleName + ':test-4', handler);
        expect(module.off('test-4')).to.be.equal(true);
      });

      it('global unsubscribe from local set event should be true', function () {
        module.on('test-4', handler);
        expect(o.off(moduleName + ':test-4')).to.be.equal(true);
      });

      it('unsubscribed trigger on global event should not run functions', function () {
        o.trigger(moduleName + ':test-4', true);
        handler.should.not.have.been.called;
      });

      it('unsubscribed local trigger on global vshould not run functions', function () {
        module.trigger('test-4', true);
        handler.should.not.have.been.called;
      });
    });

    describe('Namespaces', function () {
      var handler = sinon.spy();

      beforeEach(function(){
        handler.reset();
      });

      it('subscribe on event w/ namespace should be true', function () {
        expect(module.on('test-5::ns1', handler)).to.be.equal(true);
      });

      it('subscribe on event w/ other namespace should be true', function () {
        expect(module.on('test-5::ns2', handler)).to.be.equal(true);
        expect(module.on('test-5::ns3', handler)).to.be.equal(true);
      });

      it('trigger w/o namespace should run functions', function () {
        module.trigger('test-5', 1);
        handler.should.have.been.calledThrice;
      });

      it('trigger w/ any namespace should run functions', function () {
        module.trigger('test-5::___', 1);
        handler.should.have.been.calledThrice;
      });

      it('unsubscribe from event w/ namespace should be true', function () {
        expect(module.off('test-5::ns1')).to.be.equal(true);
      });

      it('unsubscribe from event w/ namespace should unsubscribe from only namespaced handlers', function () {
        module.trigger('test-5', 1);
        handler.should.have.been.calledTwice;
      });

      it('unsubscribe from event w/o namespace should be true', function () {
        expect(module.off('test-5')).to.be.equal(true);
      });

      it('unsubscribe from event w/o namespace should unsubscribe from all handlers', function () {
        module.trigger('test-5', 1);
        handler.should.not.have.been.called;
      });

    });

    describe('Module generated events', function () {
      var always = sinon.spy();
      var fail = sinon.spy();
      var done = sinon.spy(function(ret) {
        return ret;
      });

      var brokenModule = {
        brokenMethod: function() {}
      };
      brokenModule.brokenMethod.method = {};

      o('add', 'brokenModule', brokenModule);

      beforeEach(function(){
        always.reset();
        done.reset();
        fail.reset();
        module.off('testMethod:done');
        module.off('testMethod:always');
        module.off('testMethod:fail');
      });

      it('method should trigger :done & :always events', function () {
        module.on('testMethod:done', done);
        module.on('testMethod:always', always);
        module.on('testMethod:fail', fail);
        module('testMethod');
        done.should.have.been.called;
        always.should.have.been.called;
        fail.should.not.have.been.called;
      });

      it('multiple bound handler should trigger :done & :always events', function () {
        module.on('testMethod:done', done);
        module.on('testMethod:always', always);
        module.on('testMethod:fail', fail);
        module.on('testMethod:done', done);
        module.on('testMethod:always', always);
        module.on('testMethod:fail', fail);
        module('testMethod');
        done.should.have.been.called;
        always.should.have.been.called;
        fail.should.not.have.been.called;
      });


      it('method triggered event should return right result', function () {
        var ret = {};
        module.on('testMethod:done', done);
        module('testMethod', ret);
        done.should.have.returned(ret);
        done.should.have.been.called;
        fail.should.not.have.been.called;
      });

      it('broken method should trigger :fail events', function () {
        o.on('brokenModule:brokenMethod:done', done);
        o.on('brokenModule:brokenMethod:always', always);
        o.on('brokenModule:brokenMethod:fail', fail);
        ring('brokenModule', 'brokenMethod')();
        done.should.not.have.been.called;
        always.should.have.been.called;
        fail.should.have.been.called;
      });
    });

  });

});