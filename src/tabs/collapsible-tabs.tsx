import {useState, useRef, useMemo, useCallback, useEffect, memo, ReactElement, ReactNode} from 'react';
import classNames from 'classnames';

import fastdom from 'fastdom';

import styles from './tabs.css';
import {FakeMoreButton, MoreButton} from './collapsible-more';
import getTabTitles from './collapsible-tab';

import {TabProps} from './tab';

const DEFAULT_DEBOUNCE_INTERVAL = 100;
const MEASURE_TOLERANCE = 0.5;

export interface CollapsibleTabsProps {
  children: ReactElement<TabProps>[];
  selected?: string | undefined;
  onSelect?: ((key: string) => () => void) | undefined;
  moreClassName?: string | null | undefined;
  moreActiveClassName?: string | null | undefined;
  morePopupClassName?: string | null | undefined;
  morePopupItemClassName?: string | undefined;
  initialVisibleItems?: number | null | undefined;
  morePopupBeforeEnd?: ReactNode;
}
interface Sizes {
  tabs: number[];
  more: number | undefined;
}
interface PreparedElements {
  visible: ReactElement<TabProps>[];
  hidden: ReactElement<TabProps>[];
  ready?: boolean;
}
export const CollapsibleTabs = ({
  children,
  selected,
  onSelect,
  moreClassName,
  moreActiveClassName,
  morePopupClassName,
  morePopupBeforeEnd,
  morePopupItemClassName,
  initialVisibleItems,
}: CollapsibleTabsProps) => {
  const [sizes, setSizes] = useState<Sizes>({tabs: [], more: undefined});
  const [lastVisibleIndex, setLastVisibleIndex] = useState<number | null>(null);
  const elements = {sizes, lastVisibleIndex};
  const [preparedElements, setPreparedElements] = useState<PreparedElements>({
    visible: [],
    hidden: [],
  });

  const measureRef = useRef<HTMLDivElement>(null);

  const selectedIndex = useMemo(
    () => children.filter(tab => tab.props.alwaysHidden !== true).findIndex(tab => tab.props.id === selected) ?? null,
    [children, selected],
  );

  const visibleElements = useMemo(() => {
    let items;

    if (preparedElements.ready) {
      items = preparedElements.visible;
    } else {
      items = initialVisibleItems
        ? children.filter(item => item.props.alwaysHidden !== true).slice(0, initialVisibleItems)
        : [];
    }

    return getTabTitles({
      items,
      selected,
      onSelect,
    });
  }, [initialVisibleItems, children, preparedElements.ready, preparedElements.visible, onSelect, selected]);

  const adjustTabs = useCallback(
    (entry: ResizeObserverEntry) => {
      const containerWidth = entry.contentRect.width;

      const {tabs: tabsSizes, more = 0} = elements.sizes;

      let renderMore = children.some(tab => tab.props.alwaysHidden);

      const tabsToRender: number[] = [];
      let filledWidth = renderMore ? (more ?? 0) : 0;

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
        setLastVisibleIndex(tabsToRender.length - 1);
      }
    },
    [children, elements.lastVisibleIndex, elements.sizes, selectedIndex],
  );

  // Prepare list of visible and hidden elements
  useEffect(() => {
    const timeout = setTimeout(() => {
      const res = children.reduce(
        (accumulator: PreparedElements, tab) => {
          if (tab.props.alwaysHidden !== true && accumulator.visible.length - 1 < (elements.lastVisibleIndex ?? 0)) {
            accumulator.visible.push(tab);
          } else {
            accumulator.hidden.push(tab);
          }

          return accumulator;
        },
        {visible: [], hidden: [], ready: elements.lastVisibleIndex !== null},
      );

      if (selectedIndex > (elements.lastVisibleIndex ?? 0)) {
        const selectedItem = children.find(tab => !tab.props.alwaysHidden && tab.props.id === selected);
        if (selectedItem != null) {
          res.visible.push(selectedItem);
        }
      }

      const allVisibleTheSame =
        res.visible.length === preparedElements.visible.length &&
        res.visible.every((item, index) => item === preparedElements.visible[index]);
      const allHiddenTheSame =
        res.hidden.length === preparedElements.hidden.length &&
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
  const childrenToMeasure = useMemo(() => {
    const items = children.filter(tab => tab.props.alwaysHidden !== true);
    return getTabTitles({items, tabIndex: -1});
  }, [children]);

  // Initial measure for tabs and more button sizes
  useEffect(() => {
    if (measureRef.current == null) {
      return undefined;
    }

    const measureTask = fastdom.measure(() => {
      const container = measureRef.current;
      const descendants = [...(container?.children ?? [])] as HTMLElement[];
      const moreButton = descendants.pop();

      let moreButtonWidth = moreButton?.offsetWidth ?? 0;
      const {marginLeft: moreButtonMarginLeft = '0', marginRight: moreButtonMarginRight = '0'} = moreButton
        ? getComputedStyle(moreButton)
        : {};
      moreButtonWidth += +moreButtonMarginLeft.replace('px', '') + +moreButtonMarginRight.replace('px', '');

      const tabsWidth = descendants.map(node => {
        const {marginLeft, marginRight} = getComputedStyle(node);
        const width = node.getBoundingClientRect().width;
        return width + +marginLeft.replace('px', '') + +marginRight.replace('px', '');
      });

      const newSummaryWidth = tabsWidth.reduce((acc, curr) => acc + curr, 0);
      const oldSummaryWidth = elements.sizes.tabs.reduce((acc, curr) => acc + curr, 0);

      if (elements.sizes.more !== moreButtonWidth || newSummaryWidth !== oldSummaryWidth) {
        fastdom.mutate(() => setSizes({more: moreButtonWidth, tabs: tabsWidth}));
      }
    });

    return () => {
      fastdom.clear(measureTask);
    };
  }, [children, elements.sizes.more, elements.sizes.tabs]);

  // Start observers to listen resizing and mutation
  useEffect(() => {
    if (measureRef.current === null) {
      return undefined;
    }

    let measureTask = () => {};
    const resizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        fastdom.clear(measureTask);
        measureTask = fastdom.mutate(() => adjustTabs(entry));
      });
    });

    resizeObserver.observe(measureRef.current);

    return () => {
      fastdom.clear(measureTask);
      resizeObserver.disconnect();
    };
  }, [adjustTabs]);

  const isAdjusted = (elements.lastVisibleIndex !== null && preparedElements.ready === true) || initialVisibleItems;

  const className = classNames(styles.titles, styles.autoCollapse, isAdjusted && styles.adjusted);

  return (
    <div className={styles.autoCollapseContainer}>
      <div className={classNames(className, styles.rendered)}>
        {visibleElements}
        <MoreButton
          moreClassName={moreClassName}
          moreActiveClassName={moreActiveClassName}
          morePopupClassName={morePopupClassName}
          morePopupBeforeEnd={morePopupBeforeEnd}
          morePopupItemClassName={morePopupItemClassName}
          items={preparedElements.hidden}
          selected={selected}
          onSelect={onSelect}
        />
      </div>
      <div ref={measureRef} className={classNames(className, styles.measure)}>
        {childrenToMeasure}
        <FakeMoreButton
          hasActiveChildren={preparedElements.hidden.some(
            item => item.props.alwaysHidden && item.props.id === selected,
          )}
          moreClassName={moreClassName}
          moreActiveClassName={moreActiveClassName}
        />
      </div>
    </div>
  );
};

export default memo(CollapsibleTabs);
