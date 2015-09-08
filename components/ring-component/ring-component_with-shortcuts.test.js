describe('Mixin', function () {
  var component;
  var scope2 = 'scope2 scope2 scope2';

  function createСlass(props, render) {
    var keyMap = {};
    keyMap[key] = noop;

    return React.createClass({
      mixins: [ShortcutsMixin],
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
    component = renderIntoDocument(React.createElement(TestClass, props), callback);
  }

  function createСomponentWithSubComponent(props, callback) {
    var subKeyMap = {};
    subKeyMap[key] = noop2;

    var subComponent = createСlass({
      scope: scope2,
      map: subKeyMap
    });

    var TestClass = createСlass(null, function render() {
      return React.createElement(subComponent, {
        ref: 'subComponent',
        shortcuts: this.props.shortcuts
      }, null);
    });

    component = renderIntoDocument(React.createElement(TestClass, props), callback);
  }

  it('should throw with wrong config', function () {
    function createWrongComponent() {
      var TestClass = createСlass({});

      renderIntoDocument(React.createElement(TestClass, {
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
