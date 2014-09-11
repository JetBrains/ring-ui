/**
 * @fileoverview Form component tests.
 * @author igor.alexeenko@jetbrains.com (Igor Alexeenko)
 */

'use strict';


var Form = require('./form');
var FormGroup = require('./form__group');
var React = require('react/addons');


/**
 * @param {Object} params
 * @return {ReactCompositeComponent}
 */
var renderComponentToDOM = function (params) {
  var element = document.createElement('div');

  return React.renderComponent(new Form(params,
      new FormGroup({ name: 'checkbox', type: 'checkbox', defaultChecked: true }),
      new FormGroup({ name: 'input', type: 'input', defaultValue: '', required: true }),
      new FormGroup({ name: 'secondInput', type: 'email', defalutValue: '', required: true })),
    element);
};


describe('Form component', function () {
  it('should render Form correctly', function () {
    var formComponent = renderComponentToDOM(null);
    React.addons.TestUtils.isCompositeComponentWithType(formComponent, Form).
      should.be.true;
  });

  describe('dependencies', function () {
    describe('parse dependencies', function () {
      it('should create component', function () {
        var component = renderComponentToDOM({'deps': {
          'checkbox': {
            'input': Form.DependencyFunction.DISABLED,
            'secondInput': Form.DependencyFunction.DISABLED
          }
        }});

        React.addons.TestUtils.isCompositeComponentWithType(component, Form).should.be.true;
        component.state.deps.should.be.an('object');
      });

      it('should raise an exception if format of deps is wrong', function () {
        expect(function () {
          renderComponentToDOM({'deps': { 'checkbox': false }});
        }).to.throw(Error);

        expect(function () {
          renderComponentToDOM({'deps': { 'checkbox': [undefined, 1, false] }});
        }).to.throw();
      });

      it('should not fail if there are no deps', function () {
        expect(function () {
          renderComponentToDOM(null);
        }).not.to.throw();
      });

      describe('Dependency checks', function () {
        // NB! I check dependency function separately without rendering
        // component because propTypes checks render warnings in console.
        // Component will be rendered in any case.

        it('should raise an exception if dependency object contains chained ' +
          'or conflicting dependency', function () {
          var dependencyObject = {
            'one': { 'two': Form.DependencyFunction.DISABLED },
            'two': { 'three': Form.DependencyFunction.DISABLED }, // chain dependency
            'four': {
              'three': Form.DependencyFunction.DISABLED, // conflicting dependency
              'one': Form.DependencyFunction.DISABLED // circular dependency (where is the cycle)????
            }
          };

          expect(Form.dependencyFilters.some(function (filter) {
            return typeof filter(dependencyObject) !== 'undefined';
          })).to.be.true;
        });

        describe('Unique element checks', function () {
          it('valid unique forest', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': Form.DependencyFunction.DISABLED
                }
              },
              'four': Form.DependencyFunction.DISABLED,
              'five': {
                'six': Form.DependencyFunction.DISABLED
              }
            };

            expect(Form.dependencyFilters[0](dependencyObject)).
              to.be.undefined;
          });

          it('trees should contain unique elements', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': Form.DependencyFunction.DISABLED
                }
              },
              'four': Form.DependencyFunction.DISABLED,
              'five': {
                'two': Form.DependencyFunction.DISABLED // two already used
              }
            };

            expect(Form.dependencyFilters[0](dependencyObject)).
              to.have.property('two');
          });

          it('deep non-unique element trees', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': Form.DependencyFunction.DISABLED
                }
              },
              'four': {
                'five': {
                  'six': {
                    'three': Form.DependencyFunction.DISABLED
                  }
                }
              }
            };

            expect(Form.dependencyFilters[0](dependencyObject)).
              to.have.property('three');
          });

          it('deep non-unique element inside singe tree', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': {
                    'four': {
                      'five': {
                        'six': {
                          'seven': Form.DependencyFunction.DISABLED
                        }
                      },
                      'four': Form.DependencyFunction.DISABLED
                    }
                  }
                }
              }
            };

            expect(Form.dependencyFilters[0](dependencyObject)).
              to.have.property('four');
          });
        });

        describe('Cycle tree checks', function () {
          it('valid tree', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': Form.DependencyFunction.DISABLED
                },
                'four': Form.DependencyFunction.DISABLED,
                'five': {
                  'six': Form.DependencyFunction.DISABLED
                }
              }
            };

            expect(Form.dependencyFilters[1](dependencyObject)).
              to.be.undefined;
          });

          it('tree cycle dependency', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'one': Form.DependencyFunction.DISABLED
                }
              }
            };

            expect(Form.dependencyFilters[1](dependencyObject)).
              to.have.property('one');
          });

          it('deep tree cycle dependency', function () {
            var dependencyObject = {
              'one': {
                'two': {
                  'three': {
                    'four': {
                      'one': Form.DependencyFunction.DISABLED
                    }
                  }
                }
              }
            };

            expect(Form.dependencyFilters[1](dependencyObject)).
              to.have.property('one');
          });
        });
      });
    });

    describe('built-in deps', function () {
      it('DependencyFunction.DISABLED should disable field when checkbox ' +
        'is not checked and enable it when checkbox is checked', function () {
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
        'element to its dependent fields', function () {
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

    describe('custom dependencies', function () {
      it('Custom dependency function should work (clone value twice)', function () {
        var component = renderComponentToDOM({'deps': {
          'input': { 'secondInput': function (dependentField, superiorField) {
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

    describe('multiple dependencies', function () {
      it('multiple dependencies should work', function () {
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

  describe('validation', function () {
    var component, formElement, input, secondInput;

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
