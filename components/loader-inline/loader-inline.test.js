import React from 'react';
import {isCompositeComponentWithType, renderIntoDocument} from 'react-dom/test-utils';

import LoaderInline from './loader-inline';

describe('Loader Inline', () => {
  let loader;

  beforeEach(() => {
    loader = renderIntoDocument(React.createElement(LoaderInline));
  });

  it('should create component', () => {
    isCompositeComponentWithType(loader, LoaderInline).should.be.true;
  });

  it('should add custom class', () => {
    loader.rerender({
      className: 'test'
    });

    loader.node.should.have.class('test');
  });
});
