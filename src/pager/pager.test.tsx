import {getByTestId, queryByTestId, render, screen} from '@testing-library/react';

import {I18nContextHolder} from '../i18n/i18n-context';
import Pager, {type PagerAttrs} from './pager';
import styles from './pager.css';

describe('Pager', () => {
  const props = {total: 100, currentPage: 1, onPageChange: () => {}};
  const renderPager = (params?: Partial<PagerAttrs>) => {
    render(
      <I18nContextHolder messages={{previousPage: 'previous page', nextPage: 'next page', perPage: 'per page'}}>
        <Pager {...{...props, ...params}} />
      </I18nContextHolder>,
    );
    return screen.getByTestId('ring-pager');
  };

  it('should create component', () => {
    expect(renderPager()).to.exist;
  });

  it('should render page buttons when total is more than pageSize', () => {
    const pager = renderPager({
      total: 2,
      pageSize: 1,
    });

    expect(getByTestId(pager, 'ring-button-toolbar')).to.exist;
    expect(pager).to.have.descendants(`div.${styles.links}`);
  });

  it('should not render page buttons when total is less than 1', () => {
    const pager = renderPager({total: 1});
    expect(queryByTestId(pager, 'ring-button-toolbar')).to.not.exist;
    expect(pager).to.not.have.descendants(`div.${styles.links}`);
  });

  it('should render page size selector even when total is less than 2', () => {
    const pager = renderPager({total: 1});
    expect(getByTestId(pager, 'ring-pager-page-size-selector')).to.exist;
  });

  it('should wrap children with div', () => {
    expect(renderPager()).to.have.tagName('div');
  });

  it('should use passed className', () => {
    expect(renderPager({className: 'test-class'})).to.have.class('test-class');
  });

  it('should render page buttons even when currentPage==total if openTotal is true', () => {
    const pager = renderPager({
      total: 10,
      pageSize: 10,
      currentPage: 1,
      openTotal: true,
    });
    expect(getByTestId(pager, 'ring-button-toolbar')).to.exist;
  });
});
