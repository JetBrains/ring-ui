import {mount} from 'enzyme';

import LoaderInline, {LoaderInlineAtrrs} from './loader-inline';

describe('Loader Inline', () => {
  const mountLoaderInline = (props?: LoaderInlineAtrrs) => mount(<LoaderInline {...props} />);
  const getLoaderInlineDiv = (props?: LoaderInlineAtrrs) => mountLoaderInline(props).find('div');

  it('should create component', () => {
    mountLoaderInline().type().should.equal(LoaderInline);
  });

  it('should add custom class', () => {
    const wrapper = getLoaderInlineDiv({
      className: 'test',
    });

    wrapper.should.have.className('test');
  });
});
