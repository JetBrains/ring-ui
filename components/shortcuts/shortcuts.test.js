import simulateKeypress from 'simulate-keypress';
import shortcuts from './shortcuts';

describe('Shortcuts', function () {
  const key = 'a';
  const key2 = 'b';
  const scope = 'scope scope scope';
  let noop;
  let noop2;

  function trigger() {
    simulateKeypress(key, 65);
  }

  const wrapScope = shortcuts.wrapScope.bind(shortcuts);

  beforeEach(function () {
    shortcuts.reset();
    shortcuts.setScope();
    shortcuts.setFilter();

    noop = sinon.stub();
    noop2 = sinon.stub();
  });

  describe('bind', function () {
    it('should throw without a handler', function () {
      expect(function () {
        shortcuts.bind();
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should throw without a key', function () {
      expect(function () {
        shortcuts.bind({handler: sinon.stub()});
      }).to.throw(Error, 'Shortcut key should exist');
    });

    it('should bind to root scope', function () {
      shortcuts.bind({key: key, handler: noop});

      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key].should.equal(noop);
    });

    it('should bind to custom scope', function () {
      shortcuts.bind({key: key, scope: scope, handler: noop});

      shortcuts._scopes[scope][key].should.equal(noop);
    });

    it('should bind array of keys', function () {
      const keys = [key, key2];
      shortcuts.bind({key: keys, handler: noop});

      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key].should.equal(noop);
      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key2].should.equal(noop);
    });
  });

  describe('bindMap', function () {
    it('should throw without a map', function () {
      expect(function () {
        shortcuts.bindMap();
      }).to.throw(Error, 'Shortcuts map shouldn\'t be empty');
    });

    it('should throw with wrong handler', function () {
      expect(function () {
        shortcuts.bindMap({a: {}});
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should bind map of keys to root scope', function () {
      const keys = {};
      keys[key] = noop;
      keys[key2] = noop2;
      shortcuts.bindMap(keys);

      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key].should.equal(noop);
      shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId][key2].should.equal(noop2);
    });

    it('should bind map of keys to custom scope', function () {
      const keys = {};
      keys[key] = noop;
      keys[key2] = noop2;
      shortcuts.bindMap(keys, {scope: scope});

      shortcuts._scopes[scope][key].should.equal(noop);
      shortcuts._scopes[scope][key2].should.equal(noop2);
    });
  });

  describe('unbindScope', function () {
    it('should clear scope', function () {
      shortcuts.bind({key: key, scope: scope, handler: noop});
      shortcuts.unbindScope(scope);

      expect(shortcuts._scopes[scope]).not.to.exist;
    });
  });

  describe('hasKey', function () {
    it('should clear scope', function () {
      shortcuts.bind({key: key, scope: scope, handler: noop});

      shortcuts.hasKey(key, scope).should.be.true;
      shortcuts.hasKey(key, shortcuts.ROOT_SCOPE.scopeId).should.be.false;
    });
  });

  describe('filter', function () {
    it('should setFilter', function () {
      shortcuts.setFilter(noop2);
      shortcuts.bind({key: key, handler: noop});

      trigger();

      noop.should.have.been.called;
      noop2.should.have.been.called;
    });

    it('should prevent handler run', function () {
      const stop = sinon.stub().returns(true);

      shortcuts.setFilter(stop);
      shortcuts.bind({key: key, handler: noop});

      trigger();

      stop.should.have.been.called;
      noop.should.not.have.been.called;
    });
  });

  describe('key press', function () {
    it('should handle keys in root scope', function () {
      shortcuts.bind({key: key, handler: noop});

      trigger();

      noop.should.have.been.called;
    });

    it('should handle keys in root scope with other scope defined', function () {
      shortcuts.bind({key: key, handler: noop});
      shortcuts.bind({key: key, scope: scope, handler: noop2});

      trigger();

      noop.should.have.been.called;
      noop2.should.not.have.been.called;
    });

    it('should handle keys in top scope', function () {
      shortcuts.bind({key: key, handler: noop});
      shortcuts.bind({key: key, scope: scope, handler: noop2});

      shortcuts.pushScope(scope);
      trigger();

      noop.should.not.have.been.called;
      noop2.should.have.been.called;
    });

    it('should fall trough scopes when returning true', function () {
      const fallthrough = sinon.stub().returns(true);

      shortcuts.bind({key: key, handler: noop});
      shortcuts.bind({key: key, scope: scope, handler: fallthrough});

      shortcuts.pushScope(scope);
      trigger();

      noop.should.have.been.called;
      fallthrough.should.have.been.called;
    });
  });

  describe('scope chain operations', function () {
    const scope1 = 'a';
    const scope2 = 'bb';
    const scope3 = 'ccc';

    it('emptified scope chain be equal to default', function () {
      shortcuts.getScope().should.deep.equal([]);
    });

    it('setScope should set full scope chain by string name', function () {
      const myscope = 'aaaa';
      shortcuts.setScope(myscope);

      shortcuts.getScope().should.deep.equal([wrapScope(myscope)]);
    });

    it('setScope should set full scope chain by array of names', function () {
      shortcuts.setScope([scope1, scope2]);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1), wrapScope(scope2)]);
    });

    it('pushScope should add scope to scope chain end', function () {
      shortcuts.setScope(scope1);
      shortcuts.pushScope(scope2);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1), wrapScope(scope2)]);
    });

    it('popScope should remove by name scope and next scopes from chain', function () {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.popScope(scope2);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1)]);
    });

    it('spliceScope should remove by name scope from chain', function () {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.spliceScope(scope2);

      shortcuts.getScope().should.deep.equal([wrapScope(scope1), wrapScope(scope3)]);
    });

    it('should store options passed with scope', function () {
      shortcuts.pushScope(scope1, {foo: 'bar'});

      shortcuts.getScope().should.deep.equal([wrapScope(scope1, {foo: 'bar'})]);
    });
  });
});
