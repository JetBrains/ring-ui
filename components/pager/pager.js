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

import React, {PropTypes} from 'react';
import RingComponent from '../ring-component/ring-component';
import Button from '../button/button';
import ButtonGroup from '../button-group/button-group';
import ButtonToolbar from '../button-toolbar/button-toolbar';
import classNames from 'classnames';

import '../link/link.scss';
import style from './pager.css';

export default class Pager extends RingComponent {
  static propTypes = {
    total: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    size: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    size: 7
  }

  render() {
    const {total, current, size, onPageChange, className} = this.props;

    let start;
    let end;

    if (total < size + 6) {
      start = 1;
      end = total;
    } else {
      const leftHalfframeSize = Math.ceil(size / 2) - 1;
      const rightHalfframeSize = size - leftHalfframeSize - 1;

      start = current - leftHalfframeSize;
      end = current + rightHalfframeSize;

      if (start < 1) {
        const tail = 1 - start;
        start += tail;
        end += tail;
      }

      if (end > total) {
        const tail = end - total;
        start -= tail;
        end -= tail;
      }

      if (start < 1) {
        const tail = 1 - start;
        start += tail;
      }
    }

    const classes = classNames(style.pager, className);

    const prevLinkClasses = classNames({
      'ring-link': current !== 1,
      [style.link]: true,
      [style.linkDisabled]: current === 1
    });

    const nextLinkClasses = classNames({
      'ring-link': current !== total,
      [style.link]: true,
      [style.linkDisabled]: current === total
    });

    return (
      do {
        if (total > 1) {
          <div className={classes}>
            <div className={style.links}>
              <span
                className={prevLinkClasses}
                onClick={() => current !== 1 && onPageChange(current - 1)}
              >← previous</span>

              <span
                className={nextLinkClasses}
                onClick={() => current !== total && onPageChange(current + 1)}
              >next page →</span>
            </div>

            <ButtonToolbar>
              {
                do {
                  if (start > 1) {
                    <ButtonGroup>
                      <Button onClick={() => onPageChange(1)}>First page</Button>
                    </ButtonGroup>;
                  }
                }
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
                          active={i === current}
                          onClick={() => onPageChange(i)}
                        >{i}</Button>
                      );

                      buttons.push(button);
                    }
                    buttons;
                  }
                }

                {end < total ? <Button onClick={() => onPageChange(end + 1)}>...</Button> : ''}
              </ButtonGroup>

              {
                do {
                  if (end < total) {
                    <ButtonGroup>
                      <Button onClick={() => onPageChange(total)}>Last page</Button>
                    </ButtonGroup>;
                  }
                }
              }
            </ButtonToolbar>
          </div>;
        } else {
          null;
        }
      }
    );
  }
}
