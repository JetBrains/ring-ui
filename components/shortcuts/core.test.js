import {simulate} from 'combokeys/test/lib/key-event';
import shortcuts from './core';
import sniffr from '../global/sniffer';

describe('Shortcuts', () => {
  const key = 'a';
  const keyCode = '65';
  const key2 = 'b';
  const scope = 'scope scope scope';
  let noop;
  let noop2;

  function trigger() {
    simulate(key.charCodeAt(0), keyCode);
  }

  const wrapScope = shortcuts.wrapScope.bind(shortcuts);

  beforeEach(() => {
    shortcuts.reset();
    shortcuts.setScope();
    shortcuts.setFilter();

    noop = sinon.stub();
    noop2 = sinon.stub();
  });

  describe('bind', () => {
    it('should throw without a handler', () => {
      expect(() => {
        shortcuts.bind();
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should throw without a key', () => {
      expect(() => {
        shortcuts.bind({handler: sinon.stub()});
      }).to.throw(Error, 'Shortcut key should exist');
    });

    it('should bind to root scope', () => {
      shortcuts.bind({key, handler: noop});

      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key].should.equal(noop);
    });

    it('should bind to custom scope', () => {
      shortcuts.bind({key, scope, handler: noop});

      shortcuts._scopes[scope][key].should.equal(noop);
    });

    it('should bind array of keys', () => {
      const keys = [key, key2];
      shortcuts.bind({key: keys, handler: noop});

      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key].should.equal(noop);
      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key2].should.equal(noop);
    });
  });

  describe('bindMap', () => {
    it('should throw without a map', () => {
      expect(() => {
        shortcuts.bindMap();
      }).to.throw(Error, 'Shortcuts map shouldn\'t be empty');
    });

    it('should throw with wrong handler', () => {
      expect(() => {
        shortcuts.bindMap({a: {}});
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should bind map of keys to root scope', () => {
      const keys = {};
      keys[key] = noop;
      keys[key2] = noop2;
      shortcuts.bindMap(keys);

      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key].should.equal(noop);
      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key2].should.equal(noop2);
    });

    it('should bind map of keys to custom scope', () => {
      const keys = {};
      keys[key] = noop;
      keys[key2] = noop2;
      shortcuts.bindMap(keys, {scope});

      shortcuts._scopes[scope][key].should.equal(noop);
      shortcuts._scopes[scope][key2].should.equal(noop2);
    });
  });

  describe('unbindScope', () => {
    it('should clear scope', () => {
      shortcuts.bind({key, scope, handler: noop});
      shortcuts.unbindScope(scope);

      expect(shortcuts._scopes[scope]).not.to.exist;
    });
  });

  describe('hasKey', () => {
    it('should clear scope', () => {
      shortcuts.bind({key, scope, handler: noop});

      shortcuts.hasKey(key, scope).should.be.true;
      shortcuts.hasKey(key, shortcuts.ROOT_SCOPE.scopeId).should.be.false;
    });
  });

  describe('filter', () => {
    it('should setFilter', () => {
      shortcuts.setFilter(noop2);
      shortcuts.bind({key, handler: noop});

      trigger();

      noop.should.have.been.called;
      noop2.should.have.been.called;
    });

    it('should prevent handler run', () => {
      const stop = sinon.stub().returns(true);

      shortcuts.setFilter(stop);
      shortcuts.bind({key, handler: noop});

      trigger();

      stop.should.have.been.called;
      noop.should.not.have.been.called;
    });
  });

  describe('key press', () => {
    it('should handle keys in root scope', () => {
      shortcuts.bind({key, handler: noop});

      trigger();

      noop.should.have.been.called;
    });

    it('should handle keys in root scope with other scope defined', () => {
      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope, handler: noop2});

      trigger();

      noop.should.have.been.called;
      noop2.should.not.have.been.called;
    });

    it('should handle keys in top scope', () => {
      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope, handler: noop2});

      shortcuts.pushScope(scope);
      trigger();

      noop.should.not.have.been.called;
      noop2.should.have.been.called;
    });

    it('should fall trough scopes when returning true', () => {
      const fallthrough = sinon.stub().returns(true);

      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope, handler: fallthrough});

      shortcuts.pushScope(scope);
      trigger();

      noop.should.have.been.called;
      fallthrough.should.have.been.called;
    });

    it('should not fall trough modal scope', () => {
      const fallthrough = sinon.stub().returns(true);

      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope, handler: fallthrough});

      shortcuts.pushScope(scope, {modal: true});
      trigger();

      fallthrough.should.have.been.called;
      noop.should.not.have.been.called;
    });

    it('should not fall trough modal scope even if it has no handler for key', () => {
      const fallthrough = sinon.stub().returns(true);

      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key: key2, scope, handler: fallthrough});

      shortcuts.pushScope(scope, {modal: true});
      trigger();

      noop.should.not.have.been.called;
    });
  });

  describe('scope chain operations', () => {
    const scope1 = 'a';
    const scope2 = 'bb';
    const scope3 = 'ccc';

    it('empty scope chain should be equal to default', () => {
      shortcuts.getScope().should.deep.equal([]);
    });

    it('setScope should set full scope chain by string name', () => {
      const myscope = 'aaaa';
      shortcuts.setScope(myscope);

      shortcuts.getScope().should.deep.equal([wrapScope(myscope)]);
    });

    it('setScope should set full scope chain by array of names', () => {
      shortcuts.setScope([scope1, scope2]);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1), wrapScope(scope2)]);
    });

    it('pushScope should add scope to scope chain end', () => {
      shortcuts.setScope(scope1);
      shortcuts.pushScope(scope2);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1), wrapScope(scope2)]);
    });

    it('popScope should remove by name scope and next scopes from chain', () => {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.popScope(scope2);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1)]);
    });

    it('spliceScope should remove by name scope from chain', () => {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.spliceScope(scope2);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1), wrapScope(scope3)]);
    });

    it('should store options passed with scope', () => {
      shortcuts.pushScope(scope1, {foo: 'bar'});

      shortcuts.getScope().should.deep.equal([wrapScope(scope1, {foo: 'bar'})]);
    });

    it('should workaround system windows shortcuts', () => {
      let eventType;
      sinon.stub(shortcuts.combokeys, 'bind', (param1, param2, param3) => {
        eventType = param3;
      });
      const sandbox = sinon.sandbox.create();
      sandbox.stub(sniffr, 'os', {name: 'windows'});

      shortcuts.bind({key: 'shift+ctrl+0', handler: noop});

      eventType.should.equal('keyup');

      shortcuts.combokeys.bind.restore();
      sandbox.restore();
    });

    it('should not apply workaround for system windows shortcuts on other operating systems', () => {
      let eventType;
      sinon.stub(shortcuts.combokeys, 'bind', (param1, param2, param3) => {
        eventType = param3;
      });
      const sandbox = sinon.sandbox.create();
      sandbox.stub(sniffr, 'os', {name: 'macos'});

      shortcuts.bind({key: 'shift+ctrl+0', handler: noop});

      expect(eventType).should.not.equal('keyup');

      shortcuts.combokeys.bind.restore();
      sandbox.restore();
    });
  });
});
