import React from 'react';
import {shallow, mount} from 'enzyme';

import LoaderInline from './loader-inline';

describe('Loader Inline', () => {
  const shallowLoaderInline = props => shallow(<LoaderInline {...props}/>);
  const mountLoaderInline = props => mount(<LoaderInline {...props}/>);

  it('should create component', () => {
    mountLoaderInline().should.have.type(LoaderInline);
  });

  it('should add custom class', () => {
    const wrapper = shallowLoaderInline({
      className: 'test'
    });

    wrapper.should.have.className('test');
  });
});
