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
/* eslint-disable react/jsx-max-props-per-line */

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '../button/button';
import ButtonGroup from '../button-group/button-group';
import ButtonToolbar from '../button-toolbar/button-toolbar';
import Select from '../select/select';

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

  render() {
    const {total, currentPage, pageSize, visiblePagesLimit, onPageChange, onPageSizeChange, className} = this.props;
    const totalPages = Math.ceil(total / pageSize);

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
              onSelect={item => onPageSizeChange(item.key)}
            />
          </div>
        );
      }
    };

    const getPager = () => { // eslint-disable-line react/no-multi-comp
      if (totalPages < 2) {
        return null;
      }

      return (
        <div>
          <div className={style.links}>
            <span
              className={prevLinkClasses}
              onClick={() => currentPage !== 1 && onPageChange(currentPage - 1)}
            >← previous</span>

            <span
              className={nextLinkClasses}
              onClick={() => currentPage !== totalPages && onPageChange(currentPage + 1)}
            >next page →</span>
          </div>

          <ButtonToolbar>
            {start > 1 &&
              <ButtonGroup>
                <Button onClick={() => onPageChange(1)}>First page</Button>
              </ButtonGroup>
            }

            <ButtonGroup>
              {start > 1 ? <Button onClick={() => onPageChange(start - 1)}>...</Button> : ''}

              {
                do {
                  const buttons = [];
                  for (let i = start; i <= end; i++) {
                    const button = (
                      <Button
                        key={i}
                        active={i === currentPage}
                        onClick={() => onPageChange(i)}
                      >{i}</Button>
                    );

                    buttons.push(button);
                  }
                  buttons;
                }
              }

              {end < totalPages ? <Button onClick={() => onPageChange(end + 1)}>...</Button> : ''}
            </ButtonGroup>

            {end < totalPages &&
              <ButtonGroup>
                <Button onClick={() => onPageChange(totalPages)}>Last page</Button>
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
