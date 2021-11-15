import React from 'react';
import {shallow, mount} from 'enzyme';

import ButtonToolbar from '../button-toolbar/button-toolbar';

import Pager, {PagerAttrs} from './pager';
import styles from './pager.css';

describe('Pager', () => {
  const props = {total: 100, currentPage: 1, onPageChange: () => {}};
  const shallowPager = (params?: Partial<PagerAttrs>) =>
    shallow(<Pager {...{...props, ...params}}/>);
  const mountPager = (params?: Partial<PagerAttrs>) => mount(<Pager {...{...props, ...params}}/>);

  it('should create component', () => {
    mountPager().should.have.type(Pager);
  });

  it('should render page buttons when total is more than pageSize', () => {
    const wrapper = shallowPager({
      total: 2,
      pageSize: 1
    });
    wrapper.should.have.descendants(ButtonToolbar);
    wrapper.should.descendants(`div.${styles.links}`);
  });

  it('should not render page buttons when total is less than 1', () => {
    const wrapper = shallowPager({total: 1});
    wrapper.should.not.have.descendants(ButtonToolbar);
    wrapper.should.not.descendants(`div.${styles.links}`);
  });

  it('should render page size selector even when total is less than 2', () => {
    const wrapper = shallowPager({total: 1});
    wrapper.should.have.data('test', 'ring-pager');
    wrapper.childAt(0).should.have.data('test', 'ring-pager-page-size-selector');
  });

  it('should wrap children with div', () => {
    shallowPager().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowPager({className: 'test-class'}).should.have.className('test-class');
  });

  it('should render page buttons even when currentPage==total if openTotal is true', () => {
    const wrapper = shallowPager({
      total: 10,
      pageSize: 10,
      currentPage: 1,
      openTotal: true
    });
    wrapper.should.have.descendants(ButtonToolbar);
  });
});
