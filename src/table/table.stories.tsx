/* eslint-disable react-hooks/rules-of-hooks */
import {useRef, useState} from 'react';

import Table, {type Column, type SortOrder} from './table';
import Link from '../link/link';
import Selection from '../legacy-table/selection';
import Checkbox from '../checkbox/checkbox';
import Tag, {TagType} from '../tag/tag';
import {DeleteColumnButton, SortButton} from './table-buttons';
import {DefaultRowRenderer} from './default-row-renderer';

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
          <DefaultRowRenderer
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
          <DefaultRowRenderer
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

function sortByColumn<T extends Record<string, unknown> | [string, string, number]>(
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
    const aVal = Array.isArray(a) ? a[columnIndex] : Object.values(a)[columnIndex];
    const bVal = Array.isArray(b) ? b[columnIndex] : Object.values(b)[columnIndex];

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

type Issue = [id: string, priority: Priority, votes: number];

const issuesLongData: Issue[] = Array.from({length: 100_000}, (_, i) => {
  const hash = Math.imul(i + 1, 2654435761) >>> 0;

  const aCode = 'A'.codePointAt(0)!;
  const firstLetter = String.fromCharCode(aCode + (hash % 26));
  const secondLetter = String.fromCharCode(aCode + ((hash >>> 5) % 26));
  const issueId = `${firstLetter}${secondLetter}-${i}`;

  const votes = (hash >>> 10) % 1000;
  const priority = priorities[(hash >>> 20) % priorities.length];
  return [issueId, priority, votes];
});

const issuesColumns = [
  {
    key: 'ID',
    renderCell: item => (
      <Link href={`https://example.org/issue/${item[0]}/`} target='_blank'>
        {item[0]}
      </Link>
    ),
    renderHeader: () => <SortButton>ID</SortButton>,
  },
  {
    key: 'Priority',
    renderHeader: () => <SortButton>Priority</SortButton>,
    renderCell: ([, priority]) => <Tag tagType={priorityToTagType(priority)}>{priority}</Tag>,
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
    getKey: item => item[0],
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
    getKey: item => item[0],
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
