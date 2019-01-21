/**
 * @name Pager
 * @category Components
 * @tags Ring UI Language
 * @framework React
 * @extends {ReactComponent}
 * @description Displays a pager.
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

import {ChevronLeftIcon, ChevronRightIcon} from '../icon';

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
    onPageChange: PropTypes.func,
    onPageSizeChange: PropTypes.func,
    onLoadPage: PropTypes.func,
    className: PropTypes.string,
    translations: PropTypes.object,
    loader: PropTypes.bool,
    hrefFunc: PropTypes.func //function which generates href for all pager's buttons based on pager state passed as a function parameter, either this function or onPageChange should be provided
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
      nextPage: 'Next page',
      previousPage: 'Previous'
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

  handlePrevClick = () => {
    const {currentPage} = this.props;
    if (currentPage !== 1) {
      const prevPage = currentPage - 1;
      this.props.onPageChange(prevPage);
    }
  };

  handleNextClick = () => {
    const {currentPage, onLoadPage} = this.props;
    const nextPage = currentPage + 1;
    const total = this.getTotal();
    if (currentPage !== total) {
      this.props.onPageChange(nextPage);
    } else if (this.props.openTotal) {
      onLoadPage(nextPage);
    }
  };

  handlePageChange = memoize(i => event => {
    this.props.onPageChange(i, event);
  });

  handleLoadMore = memoize(i => () => {
    this.props.onLoadPage(i);
  });

  getButton(page, content, key, active) {
    return (
      <Button
        href={this.generateHref(page)}
        key={key}
        active={active}
        loader={this.props.loader}
        {...this.getClickProps(this.handlePageChange(page))}
      >
        {content}
      </Button>
    );
  }

  getClickProps(onClick) {
    const {hrefFunc, onPageChange} = this.props;

    if (!onPageChange) {
      return {};
    } else if (hrefFunc) {
      return {onPlainLeftClick: onClick};
    } else {
      return {onClick};
    }
  }

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
            disabled={this.props.loader}
          />
        </div>
      );
  }

  getPagerLinks() {

    const prevLinkAvailable = this.props.currentPage !== 1;

    const nextLinkAvailable = this.props.openTotal || this.props.currentPage !== this.getTotal();

    const nextIcon = (
      <ChevronRightIcon key="icon" className={style.chevron} size={ChevronRightIcon.Size.Size16}/>
    );

    const prevIcon = (
      <ChevronLeftIcon key="icon" className={style.chevron} size={ChevronLeftIcon.Size.Size16}/>
    );

    const prevText = this.props.translations.previousPage;

    const nextText = this.props.translations.nextPage;

    const nextLinkContent = WrapText => [
      <span key="text"><WrapText>{nextText}</WrapText></span>,
      nextIcon
    ];

    const prevLinkContent = WrapText => [
      prevIcon,
      <span key="text"><WrapText>{prevText}</WrapText></span>
    ];

    const prevLinkHref = this.generateHref(this.props.currentPage - 1);

    const nextLinkHref = this.generateHref(this.props.currentPage + 1);

    const disabledLinkClasses = classNames({
      [style.link]: true,
      [style.linkDisabled]: true
    });

    return (
      <div className={style.links}>
        {prevLinkAvailable && !this.props.loader
          ? (
            <Link
              href={prevLinkHref}
              className={style.link}
              {...this.getClickProps(this.handlePrevClick)}
            >{prevLinkContent}</Link>
          )
          : (
            <span className={disabledLinkClasses}>
              {prevIcon}<span key="text">{prevText}</span>
            </span>
          )
        }

        {nextLinkAvailable && !this.props.loader
          ? (
            <Link
              href={nextLinkHref}
              className={style.link}
              {...this.getClickProps(this.handleNextClick)}
            >{nextLinkContent}</Link>
          )
          : (
            <span className={disabledLinkClasses}>
              <span key="text">{nextText}</span>{nextIcon}
            </span>
          )
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

            {end === totalPages && this.props.openTotal && (
              <Button
                href={this.generateHref(end + 1)}
                loader={this.props.loader}
                {...this.getClickProps(this.handleLoadMore(end + 1))}
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
