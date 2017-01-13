import React, {PropTypes, PureComponent} from 'react';
import classnames from 'classnames';
import Icon from '../icon/icon';
import styles from './list.css';

/**
 * @constructor
 * @extends {ReactComponent}
 */

const RING_UNIT = 8;
const DEFAULT_PADDING = 16;

export default class ListItem extends PureComponent {
  render() {
    /* eslint-disable no-unused-vars */
    const {
      className,
      disabled,
      checkbox,
      glyph,
      icon,
      rightGlyph,
      description,
      label,
      details,
      active,
      rgItemType,
      level,
      tabIndex,
      onClick,
      onMouseOver,
      onMouseUp,
      rightNodes,
      leftNodes,
      ...restProps
    } = this.props;
    /* eslint-enable */
    const classes = classnames(styles.item, className, {
      [styles.action]: !disabled,
      [styles.active]: active && !disabled
    });
    const detailsClasses = classnames({
      [styles.details]: details,
      [styles.padded]: icon !== undefined || checkbox !== undefined || glyph !== undefined
    });

    const style = {
      paddingLeft: `${(+level || 0) * RING_UNIT + DEFAULT_PADDING}px`
    };

    return (
      <div
        tabIndex={tabIndex}
        onClick={onClick}
        onMouseOver={onMouseOver}
        onMouseUp={onMouseUp}
        className={classes}
        data-test="ring-list-item"
        style={style}
      >
        <div className={styles.top}>
          <div className={styles.left}>
            {glyph && (
              <Icon
                className={styles.glyph}
                glyph={glyph}
                size={Icon.Size.Size18}
              />
            )}
          </div>

          <span className={styles.label}>{label}</span>
          <span className={styles.description}>{description}</span>

          <div className={styles.right}>
            {rightGlyph && (
              <Icon
                className={styles.rightGlyph}
                glyph={rightGlyph}
                size={Icon.Size.Size18}
              />
            )}
            {icon && (
              <div
                className={styles.icon}
                style={{backgroundImage: `url("${icon}")`}}
              />
            )}
            {rightNodes}
            {checkbox !== undefined && (
              <Icon
                className={classnames(styles.checkbox, {
                  [styles.hidden]: !checkbox
                })}
                glyph={require('jetbrains-icons/checkmark.svg')}
                size={Icon.Size.Size14}
              />
            )}
          </div>
        </div>

        {details && <div className={detailsClasses}>{details}</div>}
      </div>
    );
  }
}

ListItem.defaultProps = {
  active: false
};

ListItem.propTypes = {
  active: PropTypes.bool,
  details: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  tabIndex: PropTypes.number,
  checkbox: PropTypes.bool,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array
  ]),
  glyph: PropTypes.string,
  icon: PropTypes.string,
  rightNodes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array
  ]),
  leftNodes: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.array
  ]),
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  level: PropTypes.number,
  rgItemType: PropTypes.number,
  rightGlyph: PropTypes.string,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  onMouseUp: PropTypes.func
};
