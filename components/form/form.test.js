/**
 * @fileoverview Form component tests.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

var Form = require('./form');
var FormGroup = require('./form__group');
var React = require('react/addons');

/**
 * @param {Object} params
 * @return {ReactCompositeComponent}
 */
var renderComponentToDOM = function (params) {
  var element = document.createElement('div');

  return React.render(React.createElement(Form, params,
        React.createElement(FormGroup, { name: 'checkbox', type: 'checkbox', defaultChecked: true }),
        React.createElement(FormGroup, { name: 'input', type: 'input', defaultValue: '', required: true }),
        React.createElement(FormGroup, { name: 'secondInput', type: 'email', defalutValue: '', required: true })),
    element);
};

describe('Form', function () {
  it('should render Form correctly', function () {
    var formComponent = renderComponentToDOM(null);
    React.addons.TestUtils.isCompositeComponentWithType(formComponent, Form).
        should.be.true;
  });

  describe('dependencies', function () {
    describe('parse dependencies', function () {
      it('should create component', function () {
        var component = renderComponentToDOM({'deps': {}});

        React.addons.TestUtils.isCompositeComponentWithType(component, Form).should.be.true;
        component.state.deps.should.be.an('object');
      });

      it('should raise an exception if format of deps is wrong', function () {
        expect(function () {
          renderComponentToDOM({'deps': { 'checkbox': [undefined, 1, false] }});
        }).to.throw();
      });

      it('should not fail if there are no deps', function () {
        expect(function () {
          renderComponentToDOM(null);
        }).not.to.throw();
      });

      describe('dependency checks', function () {
        describe('unique element checks', function () {
          it('valid unique forest', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': undefined
                }
              },
              'four': undefined,
              'five': {
                'six': undefined
              }
            };

            expect(Form.dfsVisitor(dependencyObject, {}, [])).to.be.true;
          });

          it('trees should contain unique elements', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': undefined
                }
              },
              'four': undefined,
              'five': {
                'two': undefined // two already used
              }
            };

            var sequence = [];
            var isValid = Form.dfsVisitor(dependencyObject, {}, sequence);

            isValid.should.be.false;
            sequence[sequence.length - 1].should.equal('two');
          });

          it('deep non-unique element trees', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': undefined
                }
              },
              'four': {
                'five': {
                  'six': {
                    'three': undefined
                  }
                }
              }
            };

            var sequence = [];
            var isValid = Form.dfsVisitor(dependencyObject, {}, sequence);

            isValid.should.be.false;
            sequence[sequence.length - 1].should.equal('three');
          });

          it('deep non-unique element inside singe tree', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': {
                    'four': {
                      'five': {
                        'six': {
                          'seven': undefined
                        }
                      },
                      'four': undefined
                    }
                  }
                }
              }
            };

            var sequence = [];
            var isValid = Form.dfsVisitor(dependencyObject, {}, sequence);

            isValid.should.be.false;
            sequence[sequence.length - 1].should.equal('four');
          });
        });

        describe('cycle tree checks', function () {
          it('valid tree', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': undefined
                },
                'four': undefined,
                'five': {
                  'six': undefined
                }
              }
            };

            Form.dfsVisitor(dependencyObject, {}, []).should.be.true;
          });

          it('tree cycle dependency', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'one': undefined
                }
              }
            };

            var sequence = [];
            var isValid = Form.dfsVisitor(dependencyObject, {}, sequence);

            isValid.should.be.false;
            sequence[sequence.length - 1].should.equal('one');
          });

          it('deep tree cycle dependency', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': {
                    'four': {
                      'one': undefined
                    }
                  }
                }
              }
            };

            var sequence = [];
            var isValid = Form.dfsVisitor(dependencyObject, {}, sequence);

            isValid.should.be.false;
            sequence[sequence.length - 1].should.equal('one');
          });
        });
      });
    });

    describe('built-in deps', function () {
      it('property DependencyFunction.DISABLED should disable field when checkbox ' +
        'is not checked and enable it when checkbox is checked', function () {
        var depsObject = {};
        depsObject[Form.DependencyType.DISABLED] = {
          'checkbox': {
            'input': undefined
          }
        };

        var component = renderComponentToDOM({'deps': depsObject });

        var formElement = component.getDOMNode();
        var checkbox = formElement.querySelector('[name=checkbox]');
        var input = formElement.querySelector('[name=input]');

        checkbox.checked.should.be.true;
        input.disabled.should.be.false;

        checkbox.checked = false;
        React.addons.TestUtils.Simulate.change(checkbox);
        input.disabled.should.be.true;
      });
    });

    describe('custom dependencies', function () {
      it('сustom dependency function should work (clone value twice)', function () {
        var fnName = Form.addDependencyFunction(function (parentElement, childElement) {
          if (childElement) {
            childElement.value = parentElement.value + parentElement.value;
          }
        });

        var depsObject = {};
        depsObject[fnName] = {
          'input': {
            'secondInput': undefined
          }
        };

        var component = renderComponentToDOM({'deps': depsObject });
        var formElement = component.getDOMNode();
        var inputElement = formElement.querySelector('[name=input]');
        var secondInputElement = formElement.querySelector('[name=secondInput]');

        var TEST_VALUE = 'test';

        inputElement.value = TEST_VALUE;
        React.addons.TestUtils.Simulate.change(inputElement);

        secondInputElement.value.should.equal(TEST_VALUE + TEST_VALUE);
      });
    });

    describe('multiple dependencies', function () {
      it('multiple dependencies should work', function () {
        var depsObject = {};
        depsObject[Form.DependencyType.DISABLED] = {
          'checkbox': {
            'input': undefined,
            'secondInput': undefined
          }
        };

        var component = renderComponentToDOM({'deps': depsObject });

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

  describe('validation', function () {
    var component;
    var formElement;
    var input;
    var secondInput;

    beforeEach(function () {
      component = renderComponentToDOM(null);
      formElement = component.getDOMNode();
      input = formElement.querySelector('[name=input]');
      secondInput = formElement.querySelector('[name=secondInput]');
    });

    it('should check required fields', function () {
      input.value = '';
      secondInput.value = '';
      React.addons.TestUtils.Simulate.change(secondInput);

      component.state.formIsCompleted.should.be.false;
      component.state.firstInvalid.state['inputElement'].should.equal(input);
    });

    it('should check field types', function () {
      input.value = 'Some value';
      secondInput.value = 'Another value';
      React.addons.TestUtils.Simulate.change(secondInput);

      component.state.formIsCompleted.should.be.false;
      component.state.firstInvalid.state['inputElement'].should.equal(secondInput);
    });

    it('should be valid if all checks passed', function () {
      input.value = 'Some value';
      secondInput.value = 'asd@example.com';
      React.addons.TestUtils.Simulate.change(secondInput);

      component.state.formIsCompleted.should.be.true;
      expect(component.state.firstInvalid).to.be.a('null');
    });
  });
});
