/**
 * @fileoverview Form component tests.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

'use strict';


var Form = require('./form');
var React = require('react/addons');


/**
 * Component which represents form content.
 * @constructor
 * @extends {ReactComponent}
 */
var FormContentComponent = React.createClass({
  /** @override */
  render: function() {
    return React.DOM.div(null,
      React.DOM.input({ name: 'checkbox', type: 'checkbox', defaultChecked: true }),
      React.DOM.input({ name: 'input', type: 'text', defaultValue: '', required: true }),
      React.DOM.input({ name: 'secondInput', type: 'email', defaultValue: '', required: true })
    );
  }
});


/**
 * @param {Object} params
 * @return {ReactCompositeComponent}
 */
var renderComponentToDOM = function(params) {
  var element = document.createElement('div');

  return React.renderComponent(
      new Form(params, new FormContentComponent(null)),
      element);
};



describe('Form component', function() {
  it('should render Form correctly', function() {
    var formComponent = renderComponentToDOM(null);
    React.addons.TestUtils.isCompositeComponentWithType(formComponent, Form).
        should.be.true;
  });

  describe('dependencies', function() {
    describe('parse dependencies', function() {
      it('should create component', function() {
        var component = renderComponentToDOM({'deps': {
          'checkbox': {
            'input': Form.DependencyFunction.DISABLED,
            'secondInput': Form.DependencyFunction.DISABLED
          }
        }});

        React.addons.TestUtils.isCompositeComponentWithType(component, Form).should.be.true;
        component.state.deps.should.be.an('object');
      });

      it('should raise an exception if format of deps is wrong', function() {
        expect(function() {
          renderComponentToDOM({'deps': { 'checkbox': false }});
        }).to.throw(Error);

        expect(function() {
          renderComponentToDOM({'deps': { 'checkbox': [undefined, 1, false] }});
        }).to.throw();
      });

      it('should not fail if there are no deps', function() {
        expect(function() { renderComponentToDOM(null); }).not.to.throw();
      });
    });

    describe('built-in deps', function() {
      it('DependencyFunction.DISABLED should disable field when checkbox ' +
        'is not checked and enable it when checkbox is checked', function() {
        var component = renderComponentToDOM({'deps': {
          'checkbox': { 'input': Form.DependencyFunction.DISABLED }
        }});

        var formElement = component.getDOMNode();
        var checkbox = formElement.querySelector('[name=checkbox]');
        var input = formElement.querySelector('[name=input]');

        checkbox.checked.should.be.true;
        input.disabled.should.be.false;

        checkbox.checked = false;
        React.addons.TestUtils.Simulate.change(checkbox);
        input.disabled.should.be.true;
      });

      it('DependencyFunction.CLONE should clone value of changed ' +
        'element to its dependent fields', function() {
        var component = renderComponentToDOM({'deps': {
          'input': { 'secondInput': Form.DependencyFunction.CLONE }
        }});

        var formElement = component.getDOMNode();
        var inputElement = formElement.querySelector('[name=input]');
        var secondInputElement = formElement.querySelector('[name=secondInput]');

        var TEST_VALUE = 'test';

        inputElement.value = TEST_VALUE;
        React.addons.TestUtils.Simulate.change(inputElement);

        secondInputElement.value.should.equal(TEST_VALUE);
      });
    });

    describe('custom dependencies', function() {
      it('Custom dependency function should work (clone value twice)', function() {
        var component = renderComponentToDOM({'deps': {
          'input': { 'secondInput': function(dependentField, superiorField) {
            dependentField.value = superiorField.value + superiorField.value;
          }
        }}});

        var formElement = component.getDOMNode();

        var inputElement = formElement.querySelector('[name=input]');
        var secondInputElement = formElement.querySelector('[name=secondInput]');

        var TEST_VALUE = 'test';

        inputElement.value = TEST_VALUE;
        React.addons.TestUtils.Simulate.change(inputElement);

        secondInputElement.value.should.equal(TEST_VALUE + TEST_VALUE);
      });
    });

    describe('multiple dependencies', function() {
      it('multiple dependencies should work', function() {
        var component = renderComponentToDOM({'deps': {
          'checkbox': {
            'input': Form.DependencyFunction.DISABLED,
            'secondInput': Form.DependencyFunction.DISABLED
          }
        }});

        var formElement = component.getDOMNode();
        var checkbox = formElement.querySelector('[name=checkbox]');
        var input = formElement.querySelector('[name=input]');
        var secondInput = formElement.querySelector('[name=secondInput]');

        checkbox.checked.should.be.true;
        input.disabled.should.be.false;
        secondInput.disabled.should.be.false;

        checkbox.checked = false;
        React.addons.TestUtils.Simulate.change(checkbox);
        input.disabled.should.be.true;
        secondInput.disabled.should.be.true;
      });
    });
  });

  describe('validation', function() {
    var component, formElement, input, secondInput;

    beforeEach(function() {
      component = renderComponentToDOM(null);
      formElement = component.getDOMNode();
      input = formElement.querySelector('[name=input]');
      secondInput = formElement.querySelector('[name=secondInput]');
    });

    it('should check required fields', function() {
      component.state.formIsCompleted.should.be.false;
      component.state.firstInvalid.should.equal(input);
    });

    it('should check field types', function() {
      input.value = 'Some value';
      secondInput.value = 'Another value';
      React.addons.TestUtils.Simulate.change(secondInput);

      component.state.formIsCompleted.should.be.false;
      component.state.firstInvalid.should.equal(secondInput);
    });

    it('should be valid if all checks passed', function() {
      input.value = 'Some value';
      secondInput.value = 'asd@example.com';
      React.addons.TestUtils.Simulate.change(secondInput);

      component.state.formIsCompleted.should.be.true;
      expect(component.state.firstInvalid).to.be.a('null');
    });
  });
});
