var React = require('react/addons');
var simulateKeypress = require('simulate-keypress');
var renderIntoDocument = require('render-into-document');
var Shortcuts = require('./shortcuts');
var shortcuts = Shortcuts.getInstance();

describe('Shortcuts', function () {
  var noop;
  var noop2;
  var key = 'a';
  var key2 = 'b';
  var scope = 'scope scope scope';

  function trigger() {
    simulateKeypress(key, 65);
  }

  beforeEach(function() {
    shortcuts.reset();
    shortcuts.setScope();
    shortcuts.setFilter();

    noop = sinon.stub();
    noop2 = sinon.stub();
  });

  describe('bind', function () {
    it('should throw without a handler', function () {
      expect(function() {
        shortcuts.bind();
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should throw without a key', function () {
      expect(function() {
        shortcuts.bind({handler: sinon.stub()});
      }).to.throw(Error, 'Shortcut key should exist');
    });

    it('should bind to root scope', function () {
      shortcuts.bind({key: key, handler: noop});

      shortcuts._scopes[Shortcuts.ROOT_SCOPE][key].should.equal(noop);
    });

    it('should bind to custom scope', function () {
      shortcuts.bind({key: key, scope: scope, handler: noop});

      shortcuts._scopes[scope][key].should.equal(noop);
    });

    it('should bind array of keys', function () {
      var keys = [key, key2];
      shortcuts.bind({key: keys, handler: noop});

      shortcuts._scopes[Shortcuts.ROOT_SCOPE][key].should.equal(noop);
      shortcuts._scopes[Shortcuts.ROOT_SCOPE][key2].should.equal(noop);
    });
  });

  describe('bindMap', function () {
    it('should throw without a map', function () {
      expect(function() {
        shortcuts.bindMap();
      }).to.throw(Error, 'Shortcuts map shouldn\'t be empty');
    });

    it('should throw with wrong handler', function () {
      expect(function() {
        shortcuts.bindMap({'a': {}});
      }).to.throw(Error, 'Shortcut handler should exist');
    });

    it('should bind map of keys to root scope', function () {
      var keys = {};
      keys[key] = noop;
      keys[key2] = noop2;
      shortcuts.bindMap(keys);

      shortcuts._scopes[Shortcuts.ROOT_SCOPE][key].should.equal(noop);
      shortcuts._scopes[Shortcuts.ROOT_SCOPE][key2].should.equal(noop2);
    });

    it('should bind map of keys to custom scope', function () {
      var keys = {};
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
      shortcuts.hasKey(key, Shortcuts.ROOT_SCOPE).should.be.false;
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

    it('filter should prevent handler run', function () {
      var stop = sinon.stub().returns(true);

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
      var fallthrough = sinon.stub().returns(true);

      shortcuts.bind({key: key, handler: noop});
      shortcuts.bind({key: key, scope: scope, handler: fallthrough});

      shortcuts.pushScope(scope);
      trigger();

      noop.should.have.been.called;
      fallthrough.should.have.been.called;
    });
  });

  describe('scope chain operations', function () {
    var scope1 = 'a';
    var scope2 = 'bb';
    var scope3 = 'ccc';

    it('emptified scope chain be equal to default', function () {
      shortcuts.getScope().should.deep.equal([]);
    });

    it('setScope should set full scope chain by string name', function () {
      var myscope = 'aaaa';
      shortcuts.setScope(myscope);

      shortcuts.getScope().should.deep.equal([myscope]);
    });

    it('setScope should set full scope chain by array of names', function () {
      shortcuts.setScope([scope1, scope2]);

      shortcuts.getScope().should.deep.equal([scope1, scope2]);
    });

    it('pushScope should add scope to scope chain end', function () {
      shortcuts.setScope(scope1);
      shortcuts.pushScope(scope2);

      shortcuts.getScope().should.deep.equal([scope1, scope2]);
    });

    it('popScope should remove by name scope and next scopes from chain', function () {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.popScope(scope2);

      shortcuts.getScope().should.deep.equal([scope1]);
    });

    it('spliceScope should remove by name scope from chain', function () {
      shortcuts.setScope([scope1, scope2, scope3]);
      shortcuts.spliceScope(scope2);

      shortcuts.getScope().should.deep.equal([scope1, scope3]);
    });
  });

  describe('Mixin', function () {
    var component;
    var scope2 = 'scope2 scope2 scope2';

    function createСlass(props, render) {
      var keyMap = {};
      keyMap[key] = noop;

      return React.createClass({
        mixins: [Shortcuts.Mixin],
        getShortcutsProps: function() {
          return props || {
            scope: scope,
            map: keyMap
          };
        },
        render: render || function() {
          return React.DOM.div({ref: 'subComponent'}, null);
        }
      });
    }

    function createСomponent(props, callback) {
      var TestClass = createСlass();
      component = renderIntoDocument(new TestClass(props), callback);
    }

    function createСomponentWithSubComponent(props, callback) {
      var subKeyMap = {};
      subKeyMap[key] = noop2;

      var subComponent = createСlass({
        scope: scope2,
        map: subKeyMap
      });
      var TestClass = createСlass(null, function render() {
        return subComponent({
          ref: 'subComponent',
          shortcuts: this.props.shortcuts
        }, null);
      });

      component = renderIntoDocument(new TestClass(props), callback);
    }

    it('should throw with wrong config', function () {
      function createWrongComponent() {
        var TestClass = createСlass({});

        renderIntoDocument(new TestClass({
          shortcuts: true
        }));
      }

      createWrongComponent.should.throw(Error);
    });

    it('should not activate shortcuts without param', function () {
      createСomponent();

      shortcuts.getScope().should.be.empty;
    });

    it('shorcutsEnabled should reflect shortcuts disabled state', function () {
      createСomponent();

      component.shortcutsEnabled().should.be.false;
    });

    it('shorcutsEnabled should reflect shortcuts enabled state', function () {
      createСomponent({
        shortcuts: true
      });

      component.shortcutsEnabled().should.be.true;
    });

    it('should activate shortcuts on component', function () {
      createСomponent({
        shortcuts: true
      });

      shortcuts.getScope().should.deep.equal([scope]);
      component.shortcutsScope.should.equal(scope);
    });

    it('should lazy activate shortcuts', function () {
      createСomponent();

      component.setProps({
        shortcuts: true
      });

      shortcuts.getScope().should.deep.equal([scope]);
      component.shortcutsScope.should.equal(scope);
    });

    it('should trigger handlers bound on component', function () {
      createСomponent({
        shortcuts: true
      });

      trigger();
      noop.should.have.been.called.once;
    });

    it('should disable shortcuts on component', function () {
      createСomponent({
        shortcuts: true
      });

      component.setProps({
        shortcuts: false
      });

      shortcuts.getScope().should.be.empty;
    });

    it('should not trigger on component with disabled shortcuts', function () {
      createСomponent({
        shortcuts: true
      });

      component.setProps({
        shortcuts: false
      });

      trigger();
      noop.should.not.have.been.called;
    });

    it('should trigger on subcomponent which shadows component\'s shortcut', function () {
      createСomponentWithSubComponent({
        shortcuts: true
      });

      trigger();
      noop.should.not.have.been.called;
      noop2.should.have.been.called;
    });

    it('should disable shortcuts on component and subcomponent', function () {
      createСomponentWithSubComponent({
        shortcuts: true
      });

      component.setProps({
        shortcuts: false
      });

      shortcuts.getScope().should.be.empty;
    });

    it('should disable shortcuts on subcomponent', function () {
      createСomponentWithSubComponent({
        shortcuts: true
      });

      component.refs.subComponent.setState({
        shortcuts: false
      });

      shortcuts.getScope().should.deep.equal([scope]);
    });
  });
});
