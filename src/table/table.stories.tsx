/* eslint-disable react-hooks/rules-of-hooks */
import {useRef, useState} from 'react';
import chevronIcon from '@jetbrains/icons/chevron-12px-right';
import classNames from 'classnames';

import Table, {type Column, type SortOrder} from './table';
import Link from '../link/link';
import Selection from '../legacy-table/selection';
import Checkbox from '../checkbox/checkbox';
import Tag, {TagType} from '../tag/tag';
import {DeleteColumnButton, SortButton} from './table-buttons';
import {DefaultItemRenderer} from './default-item-renderer';
import Icon from '../icon/icon';

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
    selection: new Selection({data: smallDataSlice}),
    isItemClickable: () => true,
  },

  render(args) {
    const [selection, setSelection] = useState(args.selection!);
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
        selection={selection}
        isItemClickable={args.isItemClickable}
        renderItem={(item, index) => (
          <DefaultItemRenderer
            index={index}
            onClick={({target}) => {
              if (target instanceof Element && ['a', 'input'].includes(target.tagName)) return;
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
  setColumns(
    columns.map((column, i) => ({
      ...column,
      sortOrder: i === columnIndex ? sortOrder : undefined,
    })),
  );

  if (sortOrder === 'none') {
    setData(data);
    return;
  }

  const sortedData = [...data].sort((a, b) => {
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
  setData(sortedData);
}

interface Issue {
  id: string;
  priority: Priority;
  votes: number;
}

const issuesLongData: Issue[] = Array.from({length: 100_000}, (_, i) => {
  const hash = Math.imul(i + 1, 2654435761) >>> 0;

  const aCode = 'A'.codePointAt(0)!;
  const firstLetter = String.fromCharCode(aCode + (hash % 26));
  const secondLetter = String.fromCharCode(aCode + ((hash >>> 5) % 26));
  const id = `${firstLetter}${secondLetter}-${i}`;

  const votes = (hash >>> 10) % 1000;
  const priority = priorities[(hash >>> 20) % priorities.length];
  return {id, priority, votes};
});

const issuesColumns = [
  {
    key: 'ID',
    renderCell: ({id}) => (
      <Link href={`https://example.org/issue/${id}/`} target='_blank'>
        {id}
      </Link>
    ),
    renderHeader: () => <SortButton>ID</SortButton>,
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
    selection: new Selection({data: smallDataSlice}),
    isItemClickable: () => true,
    isItemFocusableByArrowKeys: () => true,
  },

  render(args) {
    const [selection, setSelection] = useState(args.selection!);

    return (
      <Table
        data={args.data}
        columns={args.columns}
        getKey={args.getKey}
        selection={selection}
        isItemClickable={args.isItemClickable}
        isItemFocusableByArrowKeys={args.isItemFocusableByArrowKeys}
        onItemFocus={item => setSelection(selection.focus(item))}
        renderItem={(item, index) => (
          <DefaultItemRenderer
            index={index}
            onClick={({target}) => {
              if (target instanceof Element && target.tagName === 'a') return;
              setSelection(selection.focus(item));
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

const issueTree: IssueNode[] = [
  {
    ...issuesLongData[1000],
    children: [
      {
        ...issuesLongData[1100],
        children: [issuesLongData[1110], issuesLongData[1120]],
      },
      issuesLongData[1200],
      {
        ...issuesLongData[1300],
        children: [issuesLongData[1310]],
      },
    ],
  },
  issuesLongData[2000],
  {
    ...issuesLongData[3000],
    children: [issuesLongData[3100]],
  },
  issuesLongData[4000],
  {
    ...issuesLongData[5000],
    children: [
      issuesLongData[5100],
      issuesLongData[5200],
      issuesLongData[5300],
      {
        ...issuesLongData[5400],
        children: [issuesLongData[5410]],
      },
    ],
  },
];

function getNodeByPath(current: IssueNode[] | undefined, path: number[]): IssueNode | undefined {
  if (!current) return undefined;
  const [index, ...tail] = path;

  const node = current[index];
  if (!node) return undefined;
  if (!tail.length) return node;

  return getNodeByPath(node.children, tail);
}

function isChildPath(parent: number[], child: number[]) {
  if (parent.length >= child.length) return false;
  return parent.every((num, i) => num === child[i]);
}

interface ClientIssueFlat extends Issue {
  hasChildren: boolean;
  path: number[];
}

function isExpanded(data: ClientIssueFlat[], index: number) {
  const item = data[index];
  const nextItem = data[index + 1];
  return item?.hasChildren && nextItem && isChildPath(item.path, nextItem.path);
}

export const WithExpandAndFocus: TableStory<ClientIssueFlat> = {
  render() {
    const [data, setData] = useState(() =>
      issueTree.map(({children, ...item}, index) => ({...item, path: [index], hasChildren: !!children?.length})),
    );

    const isItemClickable = ({hasChildren}: ClientIssueFlat) => hasChildren;

    const toggleExpand = (item: ClientIssueFlat, index: number) => {
      if (isExpanded(data, index)) {
        // Collapse
        setData(data.filter(it => !isChildPath(item.path, it.path)));
      } else {
        // Expand
        const itemChildren = getNodeByPath(issueTree, item.path)?.children?.map(({children, ...child}, i) => ({
          ...child,
          path: [...item.path, i],
          hasChildren: !!children?.length,
        }));
        if (itemChildren?.length) {
          const newData = [...data];
          newData.splice(index + 1, 0, ...itemChildren);
          setData(newData);
        }
      }
    };

    const [idColumn, ...restColumns] = issuesColumns;
    return (
      <Table
        data={data}
        columns={[
          {
            ...idColumn,
            renderCell: (item, index) => (
              <>
                {item.hasChildren && (
                  <Icon
                    glyph={chevronIcon}
                    className={classNames(style.chevron, isExpanded(data, index) && style.chevronExpanded)}
                  />
                )}{' '}
                <span className={item.hasChildren ? undefined : style.noChildrenChevronPadding}>
                  {idColumn.renderCell?.(item)}
                </span>
              </>
            ),
          },
          ...restColumns,
        ]}
        getKey={({id}) => id}
        isItemClickable={isItemClickable}
        getItemLevel={item => item.path.length - 1}
        renderItem={(item, i) => <DefaultItemRenderer index={i} onClick={() => toggleExpand(item, i)} />}
      />
    );
  },
};
