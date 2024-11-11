import {getByTestId, queryByTestId, render, screen} from '@testing-library/react';

import {I18nContextHolder} from '../i18n/i18n-context';

import Pager, {PagerAttrs} from './pager';
import styles from './pager.css';

describe('Pager', () => {
  const props = {total: 100, currentPage: 1, onPageChange: () => {}};
  const renderPager = (params?: Partial<PagerAttrs>) => {
    render(
      <I18nContextHolder messages={{}}>
        <Pager {...{...props, ...params}} />
      </I18nContextHolder>,
    );
    return screen.getByTestId('ring-pager');
  };

  it('should create component', () => {
    renderPager().should.exist;
  });

  it('should render page buttons when total is more than pageSize', () => {
    const pager = renderPager({
      total: 2,
      pageSize: 1,
    });

    getByTestId(pager, 'ring-button-toolbar').should.exist;
    pager.should.have.descendants(`div.${styles.links}`);
  });

  it('should not render page buttons when total is less than 1', () => {
    const pager = renderPager({total: 1});
    should.not.exist(queryByTestId(pager, 'ring-button-toolbar'));
    pager.should.not.have.descendants(`div.${styles.links}`);
  });

  it('should render page size selector even when total is less than 2', () => {
    const pager = renderPager({total: 1});
    should.exist(getByTestId(pager, 'ring-pager-page-size-selector'));
  });

  it('should wrap children with div', () => {
    renderPager().should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderPager({className: 'test-class'}).should.have.class('test-class');
  });

  it('should render page buttons even when currentPage==total if openTotal is true', () => {
    const pager = renderPager({
      total: 10,
      pageSize: 10,
      currentPage: 1,
      openTotal: true,
    });
    getByTestId(pager, 'ring-button-toolbar').should.exist;
  });
});
