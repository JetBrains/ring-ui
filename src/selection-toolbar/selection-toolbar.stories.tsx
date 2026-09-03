import closeIcon from '@jetbrains/icons/close';
import linkIcon from '@jetbrains/icons/link';
import moreIcon from '@jetbrains/icons/more-options';
import starIcon from '@jetbrains/icons/star-empty';
import tagIcon from '@jetbrains/icons/tag';
import terminalIcon from '@jetbrains/icons/terminal';
import trashIcon from '@jetbrains/icons/trash';
import userIcon from '@jetbrains/icons/user';
import {type ComponentProps, useState} from 'react';

import Button from '../button/button';
import Checkbox from '../checkbox/checkbox';
import DropdownMenu from '../dropdown-menu/dropdown-menu';
import {isWithinInteractiveElement} from '../global/is-within-interactive-element';
import TableSelection from '../global/table-selection';
import {DefaultItemRenderer} from '../table/default-item-renderer';
import Table from '../table/table';
import Tooltip from '../tooltip/tooltip';
import SelectionToolbar, {SelectionToolbarSeparator} from './selection-toolbar';

import type {Decorator} from '@storybook/react-webpack5';

import styles from './selection-toolbar.stories.css';

const fullScreenDecorator: Decorator = Story => (
  <main className={styles.canvas}>
    <Story />
  </main>
);

export default {
  title: 'Components/Selection Toolbar',
  component: SelectionToolbar,
  decorators: [fullScreenDecorator],
  parameters: {
    screenshots: {
      actions: [
        {type: 'waitForElementToShow', selector: '#storybook-root', timeout: 10_000},
        {type: 'capture', name: '', selector: '#storybook-root'},
      ],
    },
  },
};

const CloseAction = ({onClick}: {onClick?: () => void}) => (
  <Tooltip title='Clear selection'>
    <Button icon={closeIcon} aria-label='Clear selection' onClick={onClick} />
  </Tooltip>
);

const Action = ({icon, label}: {icon: ComponentProps<typeof Button>['icon']; label: string}) => (
  <Tooltip title={label}>
    <Button icon={icon} aria-label={label} />
  </Tooltip>
);

const Toolbar = ({
  children,
  onClear,
  ...props
}: Omit<ComponentProps<typeof SelectionToolbar>, 'closeAction'> & {onClear?: () => void}) => (
  <div className={styles.toolbarPlacement} data-test='selection-toolbar-story'>
    <SelectionToolbar {...props} closeAction={<CloseAction onClick={onClear} />} aria-label='Selected item actions'>
      {children}
    </SelectionToolbar>
  </div>
);

const moreActions = [{label: 'Clone issue'}, {label: 'Clone issue as draft'}];

const FullActions = () => (
  <>
    <Action icon={terminalIcon} label='Open command dialog' />
    <Action icon={linkIcon} label='Add link' />
    <Action icon={userIcon} label='Assign' />
    <Action icon={tagIcon} label='Tag' />
    <Action icon={starIcon} label='Add to favorites' />
    <DropdownMenu anchor={<Button icon={moreIcon} aria-label='More actions' />} data={moreActions} />
    <SelectionToolbarSeparator />
    <Tooltip title='Delete'>
      <Button danger icon={trashIcon} aria-label='Delete' />
    </Tooltip>
    <SelectionToolbarSeparator />
  </>
);

export const PartialSelection = () => (
  <Toolbar label='3 items selected'>
    <FullActions />
  </Toolbar>
);

export const CurrentPageSelected = () => (
  <Toolbar
    label='73 of 124 items selected'
    selectAll={
      <Button inline primary>
        Select all 124 items
      </Button>
    }
  >
    <FullActions />
  </Toolbar>
);

export const Compact = () => (
  <Toolbar
    compact
    label='A very long localized selection label that has to fit into a constrained toolbar'
    selectAll={
      <Button inline primary>
        Select all 124 items
      </Button>
    }
    style={{width: 520}}
  >
    <DropdownMenu anchor={<Button icon={moreIcon} aria-label='More actions' />} data={moreActions} />
  </Toolbar>
);

export const Rtl = () => (
  <div dir='rtl'>
    <Toolbar label='تم تحديد 3 عناصر'>
      <FullActions />
    </Toolbar>
  </div>
);

const issues = [
  {id: 'RG-2812', summary: 'Add Selection Toolbar', status: 'In Progress'},
  {id: 'RG-2804', summary: 'Improve table keyboard navigation', status: 'Open'},
  {id: 'RG-2791', summary: 'Update build configuration', status: 'Done'},
  {id: 'RG-2788', summary: 'Align popup shadows', status: 'Open'},
  {id: 'RG-2779', summary: 'Document selection states', status: 'In Progress'},
];

const totalIssues = 15;

export const WithTable = () => {
  const [selection, setSelection] = useState(
    () => new TableSelection({data: issues, selected: new Set(issues.slice(0, 2))}),
  );
  const [allResultsSelected, setAllResultsSelected] = useState(false);
  const selectedCount = selection.getSelected().size;
  const currentPageSelected = selectedCount === issues.length;
  let label = `${selectedCount} items selected`;
  if (currentPageSelected) label = `${selectedCount} of ${totalIssues} items selected`;
  if (allResultsSelected) label = `All ${totalIssues} items selected`;

  return (
    <>
      <Table
        data={issues}
        columns={[
          {
            key: 'id',
            renderHeader: () => (
              <Checkbox
                checked={currentPageSelected}
                indeterminate={selectedCount > 0 && !currentPageSelected}
                label='Issue'
                onChange={event => {
                  setSelection(event.target.checked ? selection.selectAll() : selection.resetSelection());
                  setAllResultsSelected(false);
                }}
              />
            ),
            renderCell: issue => (
              <Checkbox
                checked={selection.isSelected(issue)}
                label={issue.id}
                onChange={event => {
                  setSelection(event.target.checked ? selection.select(issue) : selection.deselect(issue));
                  setAllResultsSelected(false);
                }}
              />
            ),
          },
          {key: 'summary', name: 'Summary'},
          {key: 'status', name: 'Status'},
        ]}
        getKey={issue => issue.id}
        renderItem={(issue, index) => (
          <DefaultItemRenderer
            index={index}
            clickable
            selected={selection.isSelected(issue)}
            onClick={event => {
              if (!isWithinInteractiveElement(event.target)) {
                setSelection(selection.toggleSelection(issue));
                setAllResultsSelected(false);
              }
            }}
          />
        )}
      />
      {selectedCount > 0 && (
        <Toolbar
          label={label}
          selectAll={
            currentPageSelected && !allResultsSelected ? (
              <Button inline primary onClick={() => setAllResultsSelected(true)}>
                Select all {totalIssues} items
              </Button>
            ) : undefined
          }
          onClear={() => {
            setSelection(selection.resetSelection());
            setAllResultsSelected(false);
          }}
        >
          <FullActions />
        </Toolbar>
      )}
    </>
  );
};
