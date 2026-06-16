/* eslint-disable no-nested-ternary, react-hooks/rules-of-hooks */
import {useEffectEvent, useRef, useState} from 'react';
import chevronIcon from '@jetbrains/icons/chevron-12px-right';
import classNames from 'classnames';

import Table, {type Column, type SortOrder} from './table';
import Link from '../link/link';
import TableSelection from '../global/table-selection';
import Checkbox from '../checkbox/checkbox';
import Tag, {TagType} from '../tag/tag';
import {DeleteColumnButton, ColumnReorderHandle, SortButton} from './table-primitives';
import {DefaultItemRenderer} from './default-item-renderer';
import Icon from '../icon/icon';
import Button from '../button/button';
import {focusRow} from './table-row-focus';

import type {Meta, StoryObj} from '@storybook/react';

import countriesData from '../legacy-table/table.stories.json' with {type: 'json'};

import style from './table.stories.css';

const meta = {
  title: 'Components/Table',

  component: Table,

  parameters: {
    screenshots: {skip: true},
  },
} as Meta<typeof Table<unknown>>;

export default meta;

type TableStory<T> = StoryObj<typeof Table<T>>;

const smallDataSlice = countriesData.slice(10, 16);

export const BasicWithMultiselect: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {key: 'ID'},
      {key: 'Country', renderCell: ({country}) => country},
      {key: 'City', renderCell: ({city}) => city},
      {
        key: 'URL',
        renderCell: ({url}) => (
          <Link href={url} target='_blank'>
            {url}
          </Link>
        ),
      },
    ],
    getKey: item => item.id,
  },

  render(args) {
    const [selection, setSelection] = useState(() => new TableSelection({data: args.data}));
    const allSelected = args.data.every(item => selection.isSelected(item));

    const [idColumn, ...restColumns] = args.columns;
    const columns = [
      {
        ...idColumn,

        renderHeader: () => (
          <Checkbox
            indeterminate={selection.getSelected().size > 0 && !allSelected}
            checked={allSelected}
            onChange={e => setSelection(e.target.checked ? selection.selectAll() : selection.resetSelection())}
            label='ID'
          />
        ),

        thClassName: style.thWithCheckbox,

        renderCell: item => (
          <Checkbox
            checked={selection.isSelected(item)}
            onChange={e => setSelection(e.target.checked ? selection.select(item) : selection.deselect(item))}
            label={String(item.id)}
          />
        ),
      },
      ...restColumns,
    ] satisfies typeof args.columns;

    return (
      <Table
        data={args.data}
        columns={columns}
        getKey={args.getKey}
        renderItem={(item, index) => (
          <DefaultItemRenderer
            index={index}
            clickable
            selected={selection.isSelected(item)}
            onClick={({target}) => {
              if (isWithinControl(target)) return;
              setSelection(selection.toggleSelection(item));
            }}
          />
        )}
      />
    );
  },
};

export const WithSortAndDelete: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {key: 'ID'},
      {
        key: 'Country',
        sortOrder: 'none',
        renderHeader: () => (
          <>
            <SortButton>Country</SortButton> <DeleteColumnButton />
          </>
        ),
      },
      {
        key: 'City',
        sortOrder: 'none',
        renderHeader: () => (
          <>
            <SortButton>City</SortButton> <DeleteColumnButton />
          </>
        ),
      },
      {
        key: 'URL',
        renderHeader: () => (
          <>
            URL <DeleteColumnButton />
          </>
        ),
        renderCell: ({url}) => (
          <Link href={url} target='_blank'>
            {url}
          </Link>
        ),
      },
    ],
    getKey: item => item.id,
  },

  render(args) {
    const [data, setData] = useState(args.data);
    const [columns, setColumns] = useState(args.columns);

    function handleColumnDelete(columnIndex: number) {
      setColumns(columns.filter((_, i) => i !== columnIndex));
    }

    return (
      <Table
        data={data}
        columns={columns}
        getKey={args.getKey}
        onSort={(columnIndex, sortOrder) =>
          sortByColumn(args.data, columns, columnIndex, sortOrder, setData, setColumns)
        }
        onColumnDelete={handleColumnDelete}
      />
    );
  },
};

type Priority = 'Trivial' | 'Minor' | 'Normal' | 'Major' | 'Critical' | 'Blocker';
const priorities = ['Trivial', 'Minor', 'Normal', 'Major', 'Critical', 'Blocker'] satisfies Priority[];

function sortByColumn<T extends {}>(
  data: T[],
  columns: Column<T>[],
  columnIndex: number,
  sortOrder: SortOrder,
  setData: (data: T[]) => void,
  setColumns: (columns: Column<T>[]) => void,
) {
  setColumns(getColumnsWithSortOrder(columns, columnIndex, sortOrder));

  if (sortOrder === 'none') {
    setData(data);
    return;
  }

  setData(sortByColumnInPlace([...data], columnIndex, sortOrder));
}

function getColumnsWithSortOrder<T>(columns: Column<T>[], columnIndex: number, sortOrder: SortOrder) {
  return columns.map((column, i) => ({
    ...column,
    sortOrder: i === columnIndex ? sortOrder : undefined,
  }));
}

function sortByColumnInPlace<T extends {}>(data: T[], columnIndex: number, sortOrder: SortOrder) {
  data.sort((a, b) => {
    const aVal = Object.values(a)[columnIndex];
    const bVal = Object.values(b)[columnIndex];

    if (priorities.includes(aVal as Priority) && priorities.includes(bVal as Priority)) {
      const aI = priorities.indexOf(aVal as Priority);
      const bI = priorities.indexOf(bVal as Priority);
      return sortOrder === 'ascending' ? aI - bI : bI - aI;
    }

    if (
      (typeof aVal === 'string' || typeof aVal === 'number') &&
      (typeof bVal === 'string' || typeof bVal === 'number')
    ) {
      if (aVal < bVal) return sortOrder === 'ascending' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'ascending' ? 1 : -1;
    }

    return 0;
  });
  return data;
}

interface Issue {
  id: string;
  priority: Priority;
  votes: number;
}

const issuesLongData: Issue[] = Array.from({length: 100_000}, (_, i) => {
  const hash = Math.imul(i + 1, 2654435761) >>> 0;

  const prefix = getTwoLetterPrefix(hash % 26, (hash >>> 5) % 26);
  const id = `${prefix}-${i}`;
  const votes = (hash >>> 10) % 1000;
  const priority = priorities[(hash >>> 20) % priorities.length];
  return {id, priority, votes};
});

function getTwoLetterPrefix(firstCode: number /* 1..26 */, secondCode: number /* 1..26 */) {
  const aCode = 'A'.codePointAt(0)!;
  const firstLetter = String.fromCharCode(aCode + firstCode);
  const secondLetter = String.fromCharCode(aCode + secondCode);
  return `${firstLetter}${secondLetter}`;
}

const issuesColumns = [
  {
    key: 'ID',
    renderHeader: () => <SortButton>ID</SortButton>,
    renderCell: ({id}) => (
      <Link href={`https://example.org/issue/${id}/`} target='_blank'>
        {id}
      </Link>
    ),
    indent: true,
  },
  {
    key: 'Priority',
    renderHeader: () => <SortButton>Priority</SortButton>,
    renderCell: ({priority}) => <Tag tagType={priorityToTagType(priority)}>{priority}</Tag>,
  },
  {
    key: 'Votes',
    renderHeader: () => <SortButton>Votes</SortButton>,
  },
] satisfies Column<Issue>[];

function priorityToTagType(priority: Priority): TagType | undefined {
  if (priority === 'Trivial') return TagType.SUCCESS;
  if (priority === 'Minor') return TagType.MAIN;
  if (priority === 'Normal') return TagType.DEFAULT;
  if (priority === 'Major') return TagType.WARNING;
  if (priority === 'Critical') return TagType.ERROR;
  if (priority === 'Blocker') return TagType.PURPLE;
  return undefined;
}

export const WithVirtualization: TableStory<Issue> = {
  args: {
    // Passing long data here would freeze the Storybook
    data: [],
    columns: issuesColumns,
    getKey: ({id}) => id,
  },

  render(args) {
    const [data, setData] = useState(issuesLongData);
    const [columns, setColumns] = useState(args.columns);

    return (
      <Table
        data={data}
        columns={columns}
        getKey={args.getKey}
        onSort={(columnIndex, newOrder) =>
          sortByColumn(issuesLongData, columns, columnIndex, newOrder, setData, setColumns)
        }
        virtualizeRows
      />
    );
  },

  parameters: {
    // Otherwise the Storybook freezes
    docs: {
      disable: true,
    },
  },

  tags: ['!autodocs'],
};

export const WithVirtualizationInScroller: TableStory<Issue> = {
  args: {
    data: [],
    columns: issuesColumns,
    getKey: item => item.id,
  },

  render(args) {
    const [data, setData] = useState(issuesLongData);
    const [columns, setColumns] = useState(args.columns);
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    return (
      <div className={style.scroller} ref={scrollerRef}>
        <Table
          data={data}
          columns={columns}
          getKey={args.getKey}
          onSort={(columnIndex, newOrder) =>
            sortByColumn(issuesLongData, columns, columnIndex, newOrder, setData, setColumns)
          }
          virtualizeRows
          scrollerRef={scrollerRef}
        />
      </div>
    );
  },

  parameters: {
    docs: {
      disable: true,
    },
  },

  tags: ['!autodocs'],
};

export const WithFocus: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {key: 'ID'},
      {key: 'Country'},
      {key: 'City'},
      {
        key: 'URL',
        renderCell: ({url}) => (
          <Link href={url} target='_blank'>
            {url}
          </Link>
        ),
      },
    ],
    getKey: item => item.id,
  },

  render(args) {
    return (
      <Table
        data={args.data}
        columns={args.columns}
        getKey={args.getKey}
        renderItem={(_item, index) => (
          <DefaultItemRenderer
            index={index}
            keyboardFocusable
            clickable
            onClick={e => {
              if (!isWithinControl(e.target)) {
                focusRow(e.currentTarget);
                e.preventDefault();
              }
            }}
          />
        )}
      />
    );
  },
};

interface IssueNode extends Issue {
  children?: IssueNode[];
}

const issueTreeRoot: IssueNode = (function genNode(level: number, counter: {value: number}): IssueNode {
  const hash = Math.imul(9431 + counter.value, 2654435761) >>> 0;
  const isRoot = level === 0;

  const id = isRoot ? '_root' : `${getTwoLetterPrefix(hash % 26, (hash >>> 5) % 26)}-${counter.value++}`;
  const priority = isRoot ? 'Normal' : priorities[(hash >>> 10) % priorities.length];
  const votes = isRoot ? -1 : (hash >>> 12) % 1000;
  const childrenLength = isRoot ? 10 : level > 3 ? 0 : (hash >>> 23) % 4;

  return {
    id,
    priority,
    votes,
    children: Array.from({length: childrenLength}, () => genNode(level + 1, counter)),
  };
})(0, {value: 0});

function deepCopy({children, ...node}: IssueNode): IssueNode {
  return {
    ...node,
    ...(children ? {children: children.map(deepCopy)} : {}),
  };
}

function getNodeByPath(current: IssueNode | undefined, path: number[]): IssueNode | undefined {
  if (!current) return undefined;
  const [index, ...tail] = path;

  const node = current.children?.[index];
  if (!node) return undefined;
  if (!tail.length) return node;

  return getNodeByPath(node, tail);
}

function isChildPath(parent: number[], child: number[]) {
  if (parent.length >= child.length) return false;
  return parent.every((num, i) => num === child[i]);
}

interface IssueFlat extends Issue {
  hasChildren: boolean;
  path: number[];
}

function isExpanded(data: IssueFlat[], index: number) {
  const item = data[index];
  const nextItem = data[index + 1];
  return item?.hasChildren && nextItem && isChildPath(item.path, nextItem.path);
}

export const WithExpandAndFocus: TableStory<IssueFlat> = {
  render() {
    const [treeData, setTreeData] = useState(() => deepCopy(issueTreeRoot));

    const [flatData, setFlatData] = useState<IssueFlat[]>(() =>
      issueTreeRoot.children!.map((item, index) => ({
        id: item.id,
        priority: item.priority,
        votes: item.votes,
        hasChildren: !!item.children?.length,
        path: [index],
      })),
    );

    const handleExpand = useEffectEvent((item: IssueFlat, index: number, action: 'expand' | 'collapse' | 'toggle') => {
      const isExpandedNow = isExpanded(flatData, index);
      if (isExpandedNow && action !== 'expand') {
        // Collapse
        setFlatData(flatData.filter(it => !isChildPath(item.path, it.path)));
      } else if (!isExpandedNow && action !== 'collapse') {
        // Expand
        const itemChildren = getNodeByPath(treeData, item.path)?.children?.map(({children, ...child}, i) => ({
          ...child,
          path: [...item.path, i],
          hasChildren: !!children?.length,
        }));
        if (itemChildren?.length) {
          const newData = [...flatData];
          newData.splice(index + 1, 0, ...itemChildren);
          setFlatData(newData);
        }
      }
    });

    const [idColumn, ...restColumns] = issuesColumns;
    const [columns, setColumns] = useState<Column<IssueFlat>[]>(() => [
      {
        ...idColumn,
        renderCell: (item, index, items) => {
          const expanded = isExpanded(items, index);
          return (
            <>
              {item.hasChildren && (
                <Button
                  inline
                  onClick={() => handleExpand(item, index, 'toggle')}
                  aria-label={`${expanded ? 'Collapse' : 'Expand'} ${item.id}`}
                >
                  <Icon glyph={chevronIcon} className={classNames(style.chevron, expanded && style.chevronExpanded)} />
                </Button>
              )}{' '}
              <span className={item.hasChildren ? undefined : style.noChildrenChevronPadding}>
                {idColumn.renderCell?.(item)}
              </span>
            </>
          );
        },
        tdClassName: () => style.tdWithChevron,
      },
      ...restColumns,
    ]);

    const [selection, setSelection] = useState(() => new TableSelection({data: flatData}));

    const handleSort = useEffectEvent((columnIndex: number, sortOrder: SortOrder) => {
      const newTreeData = deepCopy(issueTreeRoot);
      if (sortOrder !== 'none') {
        (function sortNodeInPlace(node: IssueNode) {
          if (node.children?.length) {
            sortByColumnInPlace(node.children, columnIndex, sortOrder);
            node.children.forEach(sortNodeInPlace);
          }
        })(newTreeData);
      }

      const newFlatData: IssueFlat[] = [];
      const visibleIssuesIds = new Set(flatData.map(item => item.id));
      (function collectToFlatItems(node, currentPath: number[]) {
        if (visibleIssuesIds.has(node.id)) {
          newFlatData.push({
            id: node.id,
            priority: node.priority,
            votes: node.votes,
            hasChildren: !!node.children?.length,
            path: currentPath,
          });
        }
        node.children?.forEach((child, index) => collectToFlatItems(child, [...currentPath, index]));
      })(newTreeData, []);

      setColumns(getColumnsWithSortOrder(columns, columnIndex, sortOrder));
      setTreeData(newTreeData);
      setFlatData(newFlatData);
    });

    return (
      <Table
        data={flatData}
        columns={columns}
        getKey={({id}) => id}
        onSort={handleSort}
        renderItem={(item, i) => (
          <DefaultItemRenderer
            index={i}
            keyboardFocusable
            clickable={item.hasChildren}
            selected={selection.isSelected(item)}
            level={item.path.length - 1}
            onClick={e => {
              if (isWithinControl(e.target)) return;

              focusRow(e.currentTarget);

              handleExpand(item, i, 'toggle');
              setSelection(selection.focus(item));

              e.preventDefault();
            }}
            onKeyDown={e => {
              if (document.activeElement === e.currentTarget) {
                const action =
                  e.key === ' ' || e.key === 'Enter'
                    ? 'toggle'
                    : e.key === 'ArrowLeft'
                      ? 'collapse'
                      : e.key === 'ArrowRight'
                        ? 'expand'
                        : undefined;
                if (action) {
                  handleExpand(item, i, action);
                  e.preventDefault();
                }
              }
            }}
          />
        )}
      />
    );
  },
};

function isWithinControl(element: EventTarget) {
  if (!(element instanceof Element)) return false;
  if (['A', 'BUTTON', 'INPUT'].includes(element.tagName)) return true;
  const parent = element.parentElement;
  if (!parent) return false;
  return isWithinControl(parent);
}

export const NoHeader: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {key: 'ID'},
      {key: 'Country', renderCell: ({country}) => country},
      {key: 'City', renderCell: ({city}) => city},
    ],
    getKey: item => item.id,
  },

  render(args) {
    return <Table data={args.data} columns={args.columns} getKey={args.getKey} noHeader />;
  },
};

export const WithColumnReorder: TableStory<(typeof smallDataSlice)[number]> = {
  args: {
    data: smallDataSlice,
    columns: [
      {
        key: 'ID',
        renderHeader: () => (
          <>
            <ColumnReorderHandle />
            ID
          </>
        ),
        renderCell: ({id}) => id,
      },
      {
        key: 'Country',
        sortOrder: 'none',
        renderHeader: () => (
          <>
            <ColumnReorderHandle />
            Country
          </>
        ),
        renderCell: ({country}) => country,
      },
      {
        key: 'City',
        sortOrder: 'none',
        renderHeader: () => (
          <>
            <ColumnReorderHandle />
            City
          </>
        ),
        renderCell: ({city}) => city,
      },
      {
        key: 'URL',
        renderHeader: () => (
          <>
            <ColumnReorderHandle />
            URL
          </>
        ),
        renderCell: ({url}) => (
          <Link href={url} target='_blank'>
            {url}
          </Link>
        ),
      },
    ],
    getKey: item => item.id,
  },

  render(args) {
    const [columns, setColumns] = useState(args.columns);
    return (
      <Table
        data={args.data}
        columns={columns}
        getKey={args.getKey}
        onColumnReorder={(fromIndex, insertionIndex) => reorderColumns(columns, fromIndex, insertionIndex, setColumns)}
      />
    );
  },
};

function reorderColumns<T>(
  columns: Column<T>[],
  fromIndex: number,
  insertionIndex: number,
  setColumns: (newColumns: Column<T>[]) => void,
) {
  const [...newColumns] = columns;
  const [moved] = newColumns.splice(fromIndex, 1);
  newColumns.splice(fromIndex < insertionIndex ? insertionIndex - 1 : insertionIndex, 0, moved);
  setColumns(newColumns);
}

export const WithColumnReorderLong: TableStory<Issue> = {
  args: {
    data: [],
    columns: [
      {
        key: 'ID',
        renderHeader: () => (
          <>
            <ColumnReorderHandle />
            ID
          </>
        ),
        renderCell: ({id}) => (
          <Link href={`https://example.org/issue/${id}/`} target='_blank'>
            {id}
          </Link>
        ),
        indent: true,
      },
      {
        key: 'Priority',
        renderHeader: () => (
          <>
            <ColumnReorderHandle /> Priority
          </>
        ),
        renderCell: ({priority}) => <Tag tagType={priorityToTagType(priority)}>{priority}</Tag>,
      },
      {
        key: 'Votes',
        renderHeader: () => (
          <>
            <ColumnReorderHandle />
            Votes
          </>
        ),
        renderCell: ({votes}) => votes,
      },
    ] satisfies Column<Issue>[],
    getKey: ({id}) => id,
  },

  render(args) {
    const [data] = useState(() => issuesLongData.slice(0, 200));
    const [columns, setColumns] = useState(args.columns);

    return (
      <Table
        data={data}
        columns={columns}
        getKey={args.getKey}
        onColumnReorder={(fromIndex, insertionIndex) => reorderColumns(columns, fromIndex, insertionIndex, setColumns)}
      />
    );
  },

  parameters: {
    docs: {
      disable: true,
    },
  },

  tags: ['!autodocs'],
};
