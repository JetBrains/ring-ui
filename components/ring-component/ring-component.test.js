/* eslint-disable no-magic-numbers */
import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

import RingComponent from './ring-component';

describe('Ring Component', () => {

  class CustomComponent extends RingComponent {
    render() {
      return <div/>;
    }
  }

  beforeEach(function beforeEach() {
    this.componentInstance = renderIntoDocument(React.createElement(CustomComponent, {
      test: 123
    }));
  });

  it('Should not lose props during multiple rerendering', function it() {
    const [prop1, prop2, test] = ['test', 999, 123];

    this.componentInstance.rerender({prop1});
    this.componentInstance.rerender({prop2});

    this.componentInstance.props.should.deep.equal({prop1, prop2, test});
  });


  it('Should cache props after rerendering', function it() {
    const [prop1, test] = ['test', 123];

    this.componentInstance.rerender({prop1});
    this.componentInstance._propsCache.should.deep.equal({prop1, test});
  });

  it('Should replace old object prop with new one', function it() {
    const newObjectProp = {foo: 'bar'};

    this.componentInstance = renderIntoDocument(React.createElement(CustomComponent, {
      objectProp: {test: '123'}
    }));

    this.componentInstance.rerender({objectProp: newObjectProp});

    this.componentInstance._propsCache.should.deep.equal({objectProp: newObjectProp});
  });

});
