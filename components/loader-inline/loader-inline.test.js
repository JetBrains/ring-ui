import React from 'react';
import {mount} from 'enzyme';

import LoaderInline from './loader-inline';

describe('Loader Inline', () => {
  const mountLoaderInline = props => mount(<LoaderInline {...props}/>);
  const getLoaderInlineDiv = props => mountLoaderInline(props).find('div');

  it('should create component', () => {
    mountLoaderInline().type().should.equal(LoaderInline.type);
  });

  it('should add custom class', () => {
    const wrapper = getLoaderInlineDiv({
      className: 'test'
    });

    wrapper.should.have.className('test');
  });
});
