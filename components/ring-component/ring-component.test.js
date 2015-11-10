import RingComponent from './ring-component';
import renderIntoDocument from 'render-into-document';
import React from 'react';

describe('RingComponents', function () {

  class CustomComponent extends RingComponent {
    render() {
      return <div/>;
    }
  }

  beforeEach(function () {
    this.componentInstance = renderIntoDocument(React.createElement(CustomComponent, {
      test: 123
    }));
  });

  it('Should not lose props during multiple rerendering', function () {
    const [prop1, prop2, test] = ['test', 999, 123];

    this.componentInstance.rerender({prop1});
    this.componentInstance.rerender({prop2});

    this.componentInstance.props.should.deep.equal({prop1, prop2, test});
  });


  it('Should cache props after rerendering', function () {
    const [prop1, test] = ['test', 123];

    this.componentInstance.rerender({prop1});
    this.componentInstance._propsCache.should.deep.equal({prop1, test});
  });

});
