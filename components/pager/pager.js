/**
 * @name Pager
 * @category Components
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

import Button from '../button-legacy/button-legacy';
import ButtonGroup from '../button-group/button-group';
import ButtonToolbar from '../button-toolbar/button-toolbar';
import Select from '../select/select';
import memoize from '../global/memoize';

import '../link/link.scss';
import style from './pager.css';

export default class Pager extends PureComponent {
  static propTypes = {
    alwaysShowPageSizeSelector: PropTypes.bool,
    total: PropTypes.number.isRequired,
    currentPage: PropTypes.number,
    pageSize: PropTypes.number,
    pageSizes: PropTypes.arrayOf(PropTypes.number),
    visiblePagesLimit: PropTypes.number,
    disablePageSizeSelector: PropTypes.bool,
    onPageChange: PropTypes.func.isRequired,
    onPageSizeChange: PropTypes.func,
    className: PropTypes.string
  }

  static defaultProps = {
    currentPage: 1,
    pageSize: 50,
    pageSizes: [20, 50, 100],
    visiblePagesLimit: 7,
    disablePageSizeSelector: false,
    onPageSizeChange: () => {}
  }

  getSelectOptions() {
    const {pageSize, pageSizes} = this.props;
    const data = pageSizes.map(size => ({key: size, label: `${size} per page`}));
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
    const {currentPage, onPageChange} = this.props;
    if (currentPage !== 1) {
      onPageChange(currentPage - 1);
    }
  };

  handleNextClick = () => {
    const {currentPage, onPageChange} = this.props;
    if (currentPage !== this.getTotal()) {
      onPageChange(currentPage + 1);
    }
  };

  handlePageChange = memoize(i => () => this.props.onPageChange(i));

  render() {
    const {currentPage, visiblePagesLimit, className} = this.props;
    const totalPages = this.getTotal();

    let start;
    let end;

    if (totalPages < visiblePagesLimit + 6) {
      start = 1;
      end = totalPages;
    } else {
      const leftHalfframeSize = Math.ceil(visiblePagesLimit / 2) - 1;
      const rightHalfframeSize = visiblePagesLimit - leftHalfframeSize - 1;

      start = currentPage - leftHalfframeSize;
      end = currentPage + rightHalfframeSize;

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
        const tail = 1 - start;
        start += tail;
      }
    }

    const selectOptions = this.getSelectOptions();

    const classes = classNames(style.pager, className);

    const prevLinkClasses = classNames({
      'ring-link': currentPage !== 1,
      [style.link]: true,
      [style.linkDisabled]: currentPage === 1
    });

    const nextLinkClasses = classNames({
      'ring-link': currentPage !== totalPages,
      [style.link]: true,
      [style.linkDisabled]: currentPage === totalPages
    });

    const getPageSizeSelector = () => {
      if (this.props.disablePageSizeSelector) {
        return null;
      } else {
        return (
          <div
            data-test="ring-pager-page-size-selector"
            style={{float: 'right'}}
          >
            <Select
              data={selectOptions.data}
              selected={selectOptions.selected}
              onSelect={this.handlePageSizeChange}
            />
          </div>
        );
      }
    };

    const getPager = () => {
      if (totalPages < 2) {
        return null;
      }

      const buttons = [];
      for (let i = start; i <= end; i++) {
        const button = (
          <Button
            key={i}
            active={i === currentPage}
            onClick={this.handlePageChange(i)}
          >{i}</Button>
        );

        buttons.push(button);
      }

      return (
        <div>
          <div className={style.links}>
            <span
              className={prevLinkClasses}
              onClick={this.handlePrevClick}
            >← previous</span>

            <span
              className={nextLinkClasses}
              onClick={this.handleNextClick}
            >next page →</span>
          </div>

          <ButtonToolbar>
            {start > 1 &&
              <ButtonGroup>
                <Button onClick={this.handlePageChange(1)}>First page</Button>
              </ButtonGroup>
            }

            <ButtonGroup>
              {start > 1 ? <Button onClick={this.handlePageChange(start - 1)}>...</Button> : ''}

              {buttons}

              {end < totalPages
                ? <Button onClick={this.handlePageChange(end + 1)}>...</Button>
                : ''}
            </ButtonGroup>

            {end < totalPages &&
              <ButtonGroup>
                <Button onClick={this.handlePageChange(totalPages)}>Last page</Button>
              </ButtonGroup>
            }
          </ButtonToolbar>

          {getPageSizeSelector()}
        </div>
      );
    };

    return (
      <div data-test="ring-pager" className={classes}>
        {totalPages > 1
          ? getPager()
          : getPageSizeSelector()
        }
      </div>
    );
  }
}
