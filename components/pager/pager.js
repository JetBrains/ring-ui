/**
 * @name Pager
 * @category Components
 * @tags Ring UI Language
 * @framework React
 * @extends {ReactComponent}
 * @description The pager.
 * @example-file ./pager.examples.html
 */

/* eslint-disable react/jsx-no-literals */
/* eslint-disable no-magic-numbers */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../button/button';
import ButtonGroup from '../button-group/button-group';
import ButtonToolbar from '../button-toolbar/button-toolbar';
import Select from '../select/select';
import memoize from '../global/memoize';
import Link from '../link/link';

import style from './pager.css';

export default class Pager extends PureComponent {
  static propTypes = {
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    visiblePagesLimit: PropTypes.number,
    disablePageSizeSelector: PropTypes.bool,
    openTotal: PropTypes.bool,
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func,
    onLoadPage: PropTypes.func,
    className: PropTypes.string,
    translations: PropTypes.object,
    hrefFunc: PropTypes.func //function which generates href for all pager's buttons based on pager state passed as a function parameter
  };

  static defaultProps = {
    currentPage: 1,
    pageSize: 50,
    pageSizes: [20, 50, 100],
    visiblePagesLimit: 7,
    disablePageSizeSelector: false,
    openTotal: false,
    translations: {
      perPage: 'per page',
      firstPage: 'First page',
      lastPage: 'Last page',
      nextPage: 'next page',
      previousPage: 'previous'
    },
    onPageSizeChange: () => {},
    onLoadPage: () => {}
  };

  getSelectOptions() {
    const {pageSize, pageSizes} = this.props;
    const data = pageSizes.map(size => ({
      key: size,
      label: `${size} ${this.props.translations.perPage}`
    }));
    const selected = data.find(it => it.key === pageSize);
    return {selected, data};
  }

  getTotal() {
    const {total, pageSize} = this.props;
    return Math.ceil(total / pageSize);
  }

  handlePageSizeChange = item => {
    this.props.onPageSizeChange(item.key);
  };

  handlePrevClick = event => {
    if (this.skipEvent(event)) {
      return;
    }
    const {currentPage} = this.props;
    if (currentPage !== 1) {
      const prevPage = currentPage - 1;
      this.props.onPageChange(prevPage);
    }
  };

  handleNextClick = event => {
    if (this.skipEvent(event)) {
      return;
    }
    const {currentPage, onLoadPage} = this.props;
    const nextPage = currentPage + 1;
    const total = this.getTotal();
    if (currentPage !== total) {
      this.props.onPageChange(nextPage);
    } else if (this.props.openTotal) {
      onLoadPage(nextPage);
    }
  };

  skipEvent = event => {
    if (!this.props.hrefFunc) {
      return false;
    }

    if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return true;
    }

    event.preventDefault();
    return false;
  };

  handlePageChange = memoize(i => event => {
    if (this.skipEvent(event)) {
      return;
    }
    this.props.onPageChange(i, event);
  });

  handleLoadMore = memoize(i => event => {
    if (this.skipEvent(event)) {
      return;
    }
    this.props.onLoadPage(i);
  });

  getButton = (page, content, key, active) => (
    <Button
      href={this.generateHref(page)}
      key={key}
      active={active}
      onClick={this.handlePageChange(page)}
    >
      {content}
    </Button>
  );

  getPageSizeSelector() {

    const selectOptions = this.getSelectOptions();

    return !this.props.disablePageSizeSelector &&
      (
        <div data-test="ring-pager-page-size-selector" style={{float: 'right'}}>
          <Select
            data={selectOptions.data}
            selected={selectOptions.selected}
            onSelect={this.handlePageSizeChange}
            type={Select.Type.INLINE}
          />
        </div>
      );
  }

  getPagerLinks() {

    const prevLinkAvailable = this.props.currentPage !== 1;

    const nextLinkAvailable = this.props.openTotal || this.props.currentPage !== this.getTotal();

    const nextLinkText = `${this.props.translations.nextPage} →`;

    const prevLinkText = `← ${this.props.translations.previousPage}`;

    const prevLinkHref = this.generateLinkHref(this.props.currentPage - 1);

    const nextLinkHref = this.generateLinkHref(this.props.currentPage + 1);

    const disabledLinkClasses = classNames({
      [style.link]: true,
      [style.linkDisabled]: true
    });

    return (
      <div className={style.links}>
        {prevLinkAvailable
          ? (
            <Link
              href={prevLinkHref}
              className={style.link}
              onClick={this.handlePrevClick}
            >{prevLinkText}</Link>
          )
          : <span className={disabledLinkClasses}>{prevLinkText}</span>
        }

        {nextLinkAvailable
          ? (
            <Link
              href={nextLinkHref}
              className={style.link}
              onClick={this.handleNextClick}
            >{nextLinkText}</Link>
          )
          : <span className={disabledLinkClasses}>{nextLinkText}</span>
        }
      </div>
    );
  }

  generateHref(page) {
    if (this.props.hrefFunc === undefined) {
      return undefined;
    }
    const pageSize = this.props.disablePageSizeSelector ? undefined : this.props.pageSize;
    return this.props.hrefFunc(page, pageSize);
  }

  generateLinkHref(pageNumber) {
    const href = this.generateHref(pageNumber);
    return href !== undefined ? href : '#hash';
  }

  getPagerContent() {
    const {currentPage, visiblePagesLimit} = this.props;
    const totalPages = this.getTotal();

    if (totalPages < 2 && !this.props.openTotal) {
      return null;
    }

    let start = 1;
    let end = totalPages;

    if (totalPages >= visiblePagesLimit + 6) {
      const leftHalfFrameSize = Math.ceil(visiblePagesLimit / 2) - 1;
      const rightHalfFrameSize = visiblePagesLimit - leftHalfFrameSize - 1;

      start = currentPage - leftHalfFrameSize;
      end = currentPage + rightHalfFrameSize;

      if (start < 1) {
        const tail = 1 - start;
        start += tail;
        end += tail;
      }

      if (end > totalPages) {
        const tail = end - totalPages;
        start -= tail;
        end -= tail;
      }

      if (start < 1) {
        start += 1 - start;
      }
    }

    const buttons = [];
    for (let i = start; i <= end; i++) {
      buttons.push(this.getButton(i, i, i, i === currentPage));
    }

    const lastPageButtonAvailable = end < totalPages && !this.props.openTotal;

    return (
      <div>
        {this.getPagerLinks()}

        <ButtonToolbar>
          {start > 1 &&
        (
          <ButtonGroup>
            {this.getButton(1, this.props.translations.firstPage)}
          </ButtonGroup>
        )
          }

          <ButtonGroup>
            {start > 1 && this.getButton(start - 1, '...')}

            {buttons}

            {end < totalPages && this.getButton(end + 1, '...')}

            {end === totalPages && this.props.openTotal &&
          (
            <Button
              href={this.generateHref(end + 1)}
              onClick={this.handleLoadMore(end + 1)}
            >...</Button>
          )}
          </ButtonGroup>

          {lastPageButtonAvailable &&
        (
          <ButtonGroup>
            {this.getButton(totalPages, this.props.translations.lastPage)}
          </ButtonGroup>
        )
          }
        </ButtonToolbar>

        {this.getPageSizeSelector()}

      </div>
    );
  }

  render() {

    const classes = classNames(style.pager, this.props.className);

    return (
      <div data-test="ring-pager" className={classes}>
        {this.props.total > 1
          ? this.getPagerContent()
          : this.getPageSizeSelector()
        }
      </div>
    );
  }
}
