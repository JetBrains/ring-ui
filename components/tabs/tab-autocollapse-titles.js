import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import chevronDownIcon from '@jetbrains/icons/chevron-10px.svg';

import fastdom from 'fastdom';

import Dropdown from '../dropdown/dropdown';

import Link from '../link/link';

import PopupMenu, {ListProps} from '../popup-menu/popup-menu';

import Icon from '../icon/icon';

import {Directions} from '../popup/popup.consts';

import styles from './tabs.css';
import TabLink from './tab-link';
import {CustomItem} from './dumb-tabs';

const TabTitle = React.memo(({
  selected,
  child,
  handleSelect,
  collapsed = false,
  tabIndex
}) => {
  if (child == null || typeof child !== 'object' || child.type === CustomItem) {
    return child;
  }

  const {
    title,
    disabled,
    href,
    className,
    activeClassName,
    collapsedClassName,
    collapsedActiveClassName
  } = child.props;

  const titleClasses = classNames(styles.title, className, {
    [styles.selected]: selected,
    [styles.collapsed]: collapsed,
    [activeClassName]: selected,
    [collapsedClassName]: collapsed,
    [collapsedActiveClassName]: collapsed && selected
  });

  return (
    <TabLink
      title={title}
      isSelected={selected}
      active
      href={href}
      innerClassName={titleClasses}
      className={titleClasses}
      disabled={disabled}
      onPlainLeftClick={handleSelect}
      tabIndex={tabIndex}
      collapsed={collapsed}
    />
  );
});

TabTitle.propTypes = {
  child: PropTypes.element,
  handleSelect: PropTypes.func,
  selected: PropTypes.bool,
  collapsed: PropTypes.bool,
  tabIndex: PropTypes.number
};

function noop() {}

const getTabTitles = ({
  items,
  selected = 0,
  collapsed,
  onSelect = noop,
  ...props
}) => items.map((tab, index) => {
  const key = tab.props.id || String(index);
  const isSelected = selected === key;

  return (
    <TabTitle
      key={key}
      handleSelect={onSelect(key)}
      selected={isSelected}
      child={tab}
      index={index}
      collapsed={collapsed}
      disabled={tab.props.disabled}
      {...props}
    />
  );
});

const DEFAULT_DEBOUNCE_INTERVAL = 100;
const MEASURE_TOLERANCE = 0.5;

const AnchorLink = ({
  hasActiveChildren,
  moreClassName,
  moreActiveClassName,
  ...restProps
}) => {
  const classnames = classNames(
    styles.title,
    hasActiveChildren && styles.selected,
    hasActiveChildren && moreActiveClassName,
    moreClassName
  );
  return (
    <Link
      icon={chevronDownIcon}
      title={'More'}
      innerClassName={classnames}
      className={classnames}
      {...restProps}
    >
      {'More'}
      <Icon
        glyph={chevronDownIcon}
        className={styles.chevron}
      /></Link>
  );
};

AnchorLink.propTypes = {
  hasActiveChildren: PropTypes.bool,
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string
};

const morePopupDirections = [
  Directions.BOTTOM_CENTER,
  Directions.BOTTOM_LEFT,
  Directions.BOTTOM_RIGHT
];
const MoreButton = React.memo(({
  items,
  selected,
  onSelect,
  moreClassName,
  moreActiveClassName,
  morePopupClassName
}) => {
  const onSelectHandler = React.useCallback(item => {
    if (item.disabled) {
      return;
    }

    const cb = onSelect(item.key);
    cb();
  }, [onSelect]);

  const hasActiveChild = React.useMemo(() =>
    items.some(item => item.props.alwaysHidden && item.props.id === selected),
  [items, selected]
  );

  const data = React.useMemo(() =>
    getTabTitles({
      items,
      selected,
      onSelect,
      collapsed: true
    }).map(tab => ({
      template: tab,
      key: tab.key,
      rgItemType: ListProps.Type.CUSTOM,
      className: styles.popupMenuItem,
      disabled: tab.props.disabled
    })), [items, onSelect, selected]);

  const popupAnchor = React.useMemo(() => (
    <AnchorLink
      moreClassName={moreClassName}
      moreActiveClassName={moreActiveClassName}
      hasActiveChildren={hasActiveChild}
    />
  ), [hasActiveChild, moreActiveClassName, moreClassName]);

  const popup = React.useMemo(() => (
    <PopupMenu
      directions={morePopupDirections}
      className={morePopupClassName}
      data={data}
      onSelect={onSelectHandler}
    />
  ), [data, morePopupClassName, onSelectHandler]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={classNames(styles.title, moreClassName, hasActiveChild && moreActiveClassName)}>
      <Dropdown
        hoverMode
        anchor={popupAnchor}
      >
        {popup}
      </Dropdown>
    </div>
  );
});

MoreButton.propTypes = {
  children: PropTypes.node,
  items: PropTypes.array,
  selected: PropTypes.string,
  onSelect: PropTypes.func,
  toMeasure: PropTypes.bool,
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string,
  morePopupClassName: PropTypes.string
};

MoreButton.displayName = 'MoreButton';

const FakeMoreButton = React.memo(({
  moreClassName,
  moreActiveClassName,
  hasActiveChildren
}) => (
  <div className={classNames(styles.moreButton, styles.title)}>
    <AnchorLink
      moreClassName={moreClassName}
      moreActiveClassName={moreActiveClassName}
      hasActiveChildren={hasActiveChildren}
      tabIndex={-1}
      disabled
    />
  </div>
));
FakeMoreButton.propTypes = {
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string,
  hasActiveChildren: PropTypes.bool
};
FakeMoreButton.displayName = 'FakeMoreButton';

const DEFAULT_STATE = {
  lastVisibleIndex: null,
  sizes: {tabs: [], more: null}
};

const ACTIONS = {
  MEASURE_TABS: 'MEASURE_TABS',
  DEFINE_LAST_VISIBLE_INDEX: 'DEFINE_LAST_VISIBLE_INDEX'
};

function visibilityReducer(state, action) {
  switch (action.type) {
    case ACTIONS.MEASURE_TABS: {
      const {more, tabs} = action;
      return {
        ...state,
        sizes: {
          more,
          tabs
        }
      };
    }
    case ACTIONS.DEFINE_LAST_VISIBLE_INDEX: {
      const {lastVisibleIndex} = action;
      return {
        ...state,
        lastVisibleIndex
      };
    }
    default:
      throw new Error();
  }
}

const useAdjustHandler = ({
  elements, children, selectedIndex, dispatch
}) => React.useCallback(entry => {
  const containerWidth = entry.contentRect.width;

  const {tabs: tabsSizes, more = 0} = elements.sizes;

  let renderMore = children.some(tab => tab.props.alwaysHidden);

  const tabsToRender = [];
  let filledWidth = renderMore ? more ?? 0 : 0;

  for (let i = 0; i < tabsSizes.length; i++) {
    if (filledWidth + tabsSizes[i] < containerWidth + MEASURE_TOLERANCE) {
      filledWidth += tabsSizes[i];
      tabsToRender.push(tabsSizes[i]);
    } else {
      break;
    }
  }

  if (tabsToRender.length < tabsSizes.length && !renderMore) {
    for (let i = tabsToRender.length - 1; i >= 0; i--) {
      if (filledWidth + more < containerWidth + MEASURE_TOLERANCE) {
        filledWidth += more;
        renderMore = true;
        break;
      } else {
        filledWidth -= tabsToRender[i];
        tabsToRender.pop();
      }
    }
  }

  if (selectedIndex > tabsToRender.length - 1) {
    const selectedWidth = tabsSizes[selectedIndex];
    for (let i = tabsToRender.length - 1; i >= 0; i--) {
      if (filledWidth + selectedWidth < containerWidth + MEASURE_TOLERANCE) {
        filledWidth += selectedWidth;
        break;
      } else {
        filledWidth -= tabsToRender[i];
        tabsToRender.pop();
      }
    }
  }

  if (elements.lastVisibleIndex !== tabsToRender.length - 1) {
    dispatch({
      type: ACTIONS.DEFINE_LAST_VISIBLE_INDEX,
      lastVisibleIndex: tabsToRender.length - 1
    });
  }

}, [children, dispatch, elements.lastVisibleIndex, elements.sizes, selectedIndex]);

export const TabAutocollapseTitles = ({
  children,
  selected,
  onSelect,
  moreClassName,
  moreActiveClassName,
  morePopupClassName
}) => {
  const [elements, dispatch] = React.useReducer(visibilityReducer, DEFAULT_STATE);
  const [preparedElements, setPreparedElements] = React.useState({visible: [], hidden: []});

  const measureRef = React.useRef(null);

  const selectedIndex = React.useMemo(() => children.
    filter(tab => tab.props.alwaysHidden !== true).
    findIndex(tab => tab.props.id === selected) ?? null, [children, selected]);

  const visibleElements = React.useMemo(() => getTabTitles({
    items: preparedElements.ready ? preparedElements.visible : children,
    selected,
    onSelect
  }), [children, preparedElements.ready, preparedElements.visible, onSelect, selected]);

  const adjustTabs = useAdjustHandler({
    dispatch,
    elements,
    children,
    selectedIndex
  });

  // Prepare list of visible and hidden elements
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      const res = children.reduce((accumulator, tab) => {
        if (tab.props.alwaysHidden !== true &&
          accumulator.visible.length - 1 < (elements.lastVisibleIndex ?? 0)) {
          accumulator.visible.push(tab);
        } else {
          accumulator.hidden.push(tab);
        }

        return accumulator;
      }, {visible: [], hidden: [], ready: elements.lastVisibleIndex !== null});

      if (selectedIndex > (elements.lastVisibleIndex ?? 0)) {
        const selectedItem =
          children.find(tab => !tab.props.alwaysHidden && tab.props.id === selected);
        res.visible.push(selectedItem);
      }

      const allVisibleTheSame = res.visible.length === preparedElements.visible.length &&
        res.visible.every((item, index) => item === preparedElements.visible[index]);
      const allHiddenTheSame = res.hidden.length === preparedElements.hidden.length &&
        res.hidden.every((item, index) => item === preparedElements.hidden[index]);

      if (!allVisibleTheSame || !allHiddenTheSame || preparedElements.ready !== res.ready) {
        fastdom.mutate(() => setPreparedElements(res));
      }
    }, DEFAULT_DEBOUNCE_INTERVAL);

    return () => {
      clearTimeout(timeout);
    };
  }, [children, elements.lastVisibleIndex, preparedElements, selected, selectedIndex]);

  // Get list of all possibly visible elements to render in a measure container
  const childrenToMeasure = React.useMemo(
    () => {
      const items = children.filter(tab => tab.props.alwaysHidden !== true);
      return getTabTitles({items, tabIndex: -1});
    },
    [children]
  );

  // Initial measure for tabs and more button sizes
  React.useEffect(() => {
    if (measureRef.current == null) {
      return;
    }

    const measureTask = fastdom.measure(() => {
      const container = measureRef.current;
      const descendants = [...container.children];
      const moreButton = descendants.pop();

      let moreButtonWidth = moreButton.offsetWidth;
      const {
        marginLeft: moreButtonMarginLeft,
        marginRight: moreButtonMarginRight
      } = getComputedStyle(moreButton);
      moreButtonWidth += +moreButtonMarginLeft.replace('px', '') + +moreButtonMarginRight.replace('px', '');

      const tabsWidth = descendants.map(node => {
        const {marginLeft, marginRight} = getComputedStyle(node);
        const width = node.getBoundingClientRect().width;
        return width + +marginLeft.replace('px', '') + +marginRight.replace('px', '');
      });

      // eslint-disable-next-line no-param-reassign
      const newSummaryWidth = tabsWidth.reduce((acc, curr) => (acc += curr), 0);
      // eslint-disable-next-line no-param-reassign
      const oldSummaryWidth = elements.sizes.tabs.reduce((acc, curr) => (acc += curr), 0);

      if (elements.sizes.more !== moreButtonWidth || newSummaryWidth !== oldSummaryWidth) {
        fastdom.mutate(() =>
          dispatch({type: ACTIONS.MEASURE_TABS, more: moreButtonWidth, tabs: tabsWidth})
        );
      }
    });

    // eslint-disable-next-line consistent-return
    return () => {
      fastdom.clear(measureTask);
    };
  }, [children, elements.sizes.more, elements.sizes.tabs]);

  // Start observers to listen resizing and mutation
  React.useEffect(() => {
    let measureTask = null;
    let resizeObserver = null;

    if (measureRef.current === null) {
      return;
    }

    resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        fastdom.clear(measureTask);
        measureTask = fastdom.mutate(() => adjustTabs(entry));
      });
    });

    resizeObserver.observe(measureRef.current);

    // eslint-disable-next-line consistent-return
    return () => {
      fastdom.clear(measureTask);
      resizeObserver.disconnect();
    };
  }, [adjustTabs]);

  const className = classNames(
    styles.titles,
    styles.autoCollapse,
    elements.lastVisibleIndex !== null && preparedElements.ready === true && styles.adjusted
  );

  return (
    <>
      <div className={className}>
        {visibleElements}
        <MoreButton
          moreClassName={moreClassName}
          moreActiveClassName={moreActiveClassName}
          morePopupClassName={morePopupClassName}
          items={preparedElements.hidden}
          selected={selected}
          onSelect={onSelect}
        />
      </div>
      <div ref={measureRef} className={classNames(className, styles.measure)}>
        {childrenToMeasure}
        <FakeMoreButton
          hasActiveChildren={
            preparedElements.hidden.some(
              item => item.props.alwaysHidden && item.props.id === selected
            )
          }
          moreClassName={moreClassName}
          moreActiveClassName={moreActiveClassName}
        />
      </div>
    </>
  );
};

TabAutocollapseTitles.propTypes = {
  children: PropTypes.node.isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  moreClassName: PropTypes.string,
  moreActiveClassName: PropTypes.string,
  morePopupClassName: PropTypes.string
};

export default React.memo(TabAutocollapseTitles);
