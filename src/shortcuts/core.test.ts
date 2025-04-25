import {simulate} from 'combokeys/test/lib/key-event';

import sniffr from '../global/sniffer';

import shortcuts, {ShortcutsMap} from './core';

describe('Shortcuts', () => {
  const key = 'a';
  const keyCode = 65;
  const key2 = 'b';
  const scopeId = 'scope scope scope';
  let noop: () => void;
  let noop2: () => boolean;

  function trigger() {
    simulate(key.charCodeAt(0), keyCode);
  }

  const wrapScope = shortcuts.wrapScope.bind(shortcuts);

  beforeEach(() => {
    shortcuts.reset();
    shortcuts.setScope();
    shortcuts.setFilter();

    noop = sandbox.stub();
    noop2 = sandbox.stub();
  });

  describe('bind', () => {
    it('should throw without a handler', () => {
      expect(() => {
        // @ts-expect-error testing a wrong usage
        shortcuts.bind();
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should throw without a key', () => {
      expect(() => {
        // @ts-expect-error testing a wrong usage
        shortcuts.bind({handler: sandbox.stub()});
      }).to.throw(Error, 'Shortcut key should exist');
    });

    it('should bind to root scope', () => {
      shortcuts.bind({key, handler: noop});

      const scope = shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId];
      expect(scope).to.exist;
      expect(scope?.[key]).to.equal(noop);
    });

    it('should bind to custom scope', () => {
      shortcuts.bind({key, scope: scopeId, handler: noop});

      const scope = shortcuts._scopes[scopeId];
      expect(scope).to.exist;
      expect(scope?.[key]).to.equal(noop);
    });

    it('should bind array of keys', () => {
      const keys = [key, key2];
      shortcuts.bind({key: keys, handler: noop});

      const scope = shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId];
      expect(scope).to.exist;
      expect(scope?.[key]).to.equal(noop);
      expect(scope?.[key2]).to.equal(noop);
    });
  });

  describe('bindMap', () => {
    it('should throw without a map', () => {
      expect(() => {
        // @ts-expect-error testing a wrong usage
        shortcuts.bindMap();
      }).to.throw(Error, "Shortcuts map shouldn't be empty");
    });

    it('should throw with wrong handler', () => {
      expect(() => {
        // @ts-expect-error testing a wrong usage
        shortcuts.bindMap({a: {}});
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should bind map of keys to root scope', () => {
      const keys: ShortcutsMap = {};
      keys[key] = noop;
      keys[key2] = noop2;
      shortcuts.bindMap(keys);

      const scope = shortcuts._scopes[shortcuts.ROOT_SCOPE.scopeId];
      expect(scope).to.exist;
      expect(scope?.[key]).to.equal(noop);
      expect(scope?.[key2]).to.equal(noop2);
    });

    it('should bind map of keys to custom scope', () => {
      const keys: ShortcutsMap = {};
      keys[key] = noop;
      keys[key2] = noop2;
      shortcuts.bindMap(keys, {scope: scopeId});

      const scope = shortcuts._scopes[scopeId];
      expect(scope).to.exist;
      expect(scope?.[key]).to.equal(noop);
      expect(scope?.[key2]).to.equal(noop2);
    });
  });

  describe('unbindScope', () => {
    it('should clear scope', () => {
      shortcuts.bind({key, scope: scopeId, handler: noop});
      shortcuts.unbindScope(scopeId);

      expect(shortcuts._scopes[scopeId]).to.not.exist;
    });
  });

  describe('hasKey', () => {
    it('should clear scope', () => {
      shortcuts.bind({key, scope: scopeId, handler: noop});

      expect(shortcuts.hasKey(key, scopeId)).to.be.true;
      expect(shortcuts.hasKey(key, shortcuts.ROOT_SCOPE.scopeId)).to.be.false;
    });
  });

  describe('filter', () => {
    it('should setFilter', () => {
      shortcuts.setFilter(noop2);
      shortcuts.bind({key, handler: noop});

      trigger();

      expect(noop).to.have.been.called;
      expect(noop2).to.have.been.called;
    });

    it('should prevent handler run', () => {
      const stop = sandbox.stub().returns(true);

      shortcuts.setFilter(stop);
      shortcuts.bind({key, handler: noop});

      trigger();

      expect(stop).to.have.been.called;
      expect(noop).to.not.have.been.called;
    });
  });

  describe('key press', () => {
    it('should handle keys in root scope', () => {
      shortcuts.bind({key, handler: noop});

      trigger();

      expect(noop).to.have.been.called;
    });

    it('should handle keys in root scope with other scope defined', () => {
      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope: scopeId, handler: noop2});

      trigger();

      expect(noop).to.have.been.called;
      expect(noop2).to.not.have.been.called;
    });

    it('should handle keys in top scope', () => {
      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope: scopeId, handler: noop2});

      shortcuts.pushScope(scopeId);
      trigger();

      expect(noop).to.not.have.been.called;
      expect(noop2).to.have.been.called;
    });

    it('should fall trough scopes when returning true', () => {
      const fallthrough = sandbox.stub().returns(true);

      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope: scopeId, handler: fallthrough});

      shortcuts.pushScope(scopeId);
      trigger();

      expect(noop).to.have.been.called;
      expect(fallthrough).to.have.been.called;
    });

    it('should not fall trough modal scope', () => {
      const fallthrough = sandbox.stub().returns(true);

      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key, scope: scopeId, handler: fallthrough});

      shortcuts.pushScope(scopeId, {modal: true});
      trigger();

      expect(fallthrough).to.have.been.called;
      expect(noop).to.not.have.been.called;
    });

    it('should not fall trough modal scope even if it has no handler for key', () => {
      const fallthrough = sandbox.stub().returns(true);

      shortcuts.bind({key, handler: noop});
      shortcuts.bind({key: key2, scope: scopeId, handler: fallthrough});

      shortcuts.pushScope(scopeId, {modal: true});
      trigger();

      expect(noop).to.not.have.been.called;
    });
  });

  describe('scope chain operations', () => {
    const scope1 = 'a';
    const scope2 = 'bb';
    const scope3 = 'ccc';

    it('empty scope chain should be equal to default', () => {
      expect(shortcuts.getScope()).to.deep.equal([]);
    });

    it('setScope should set full scope chain by string name', () => {
      const myscope = 'aaaa';
      shortcuts.setScope(myscope);

      expect(shortcuts.getScope()).to.deep.equal([wrapScope(myscope)]);
    });

    it('setScope should set full scope chain by array of names', () => {
      shortcuts.setScope([scope1, scope2]);

      expect(shortcuts.getScope()).to.deep.equal([wrapScope(scope1), wrapScope(scope2)]);
    });

    it('pushScope should add scope to scope chain end', () => {
      shortcuts.setScope(scope1);
      shortcuts.pushScope(scope2);

      expect(shortcuts.getScope()).to.deep.equal([wrapScope(scope1), wrapScope(scope2)]);
    });

    it('popScope should remove by name scope and next scopes from chain', () => {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.popScope(scope2);

      expect(shortcuts.getScope()).to.deep.equal([wrapScope(scope1)]);
    });

    it('spliceScope should remove by name scope from chain', () => {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.spliceScope(scope2);

      expect(shortcuts.getScope()).to.deep.equal([wrapScope(scope1), wrapScope(scope3)]);
    });

    it('should store options passed with scope', () => {
      shortcuts.pushScope(scope1, {modal: true});

      expect(shortcuts.getScope()).to.deep.equal([wrapScope(scope1, {modal: true})]);
    });

    it('should workaround system windows shortcuts', () => {
      let eventType: string | undefined;
      sandbox.stub(shortcuts.combokeys, 'bind').callsFake((param1, param2, param3) => {
        eventType = param3;
      });
      sandbox.stub(sniffr, 'os').value({name: 'windows'});

      shortcuts.bind({key: 'shift+ctrl+0', handler: noop});

      expect(eventType).to.exist;
      expect(eventType).to.equal('keyup');
    });

    it('should not apply workaround for system windows shortcuts on other operating systems', () => {
      let eventType;
      sandbox.stub(shortcuts.combokeys, 'bind').callsFake((param1, param2, param3) => {
        eventType = param3;
      });
      sandbox.stub(sniffr, 'os').value({name: 'macos'});

      shortcuts.bind({key: 'shift+ctrl+0', handler: noop});

      expect('keyup').to.not.equal(eventType);
    });
  });
});
