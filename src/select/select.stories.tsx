import {type ReactNode, type SyntheticEvent, useCallback, useEffect, useRef, useState} from 'react';
import * as React from 'react';
import warningIcon from '@jetbrains/icons/warning';
import searchIcon from '@jetbrains/icons/search';
import {type StoryFn, type StoryObj} from '@storybook/react-webpack5';

import hubConfig from '../../.storybook/hub-config';
import Text from '../text/text';
import Link from '../link/link';
import Popup from '../popup/popup';
import List from '../list/list';
import Dropdown from '../dropdown/dropdown';
import Auth from '../auth/auth';
import Source from '../list/list-users-groups-source';
import '../input-size/input-size.css';
import Input, {type ContainerProps, type InputSpecificProps} from '../input/input';
import {ControlsHeight} from '../global/configuration';
import {LabelType} from '../control-label/control-label';
import Select, {type MultipleSelectAttrs, type SelectItem, type SelectProps, type SingleSelectAttrs} from './select';
import {type Multiple} from './select-popup';

const FLAG_DE_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAUCAIAAACMMcMmAAAAKklEQVRIx2NgGAWjgAbAh/aI4S7t0agdI9COzx00Rwz/z9Ecjdox8uwAACkGSkKIaGlAAAAAAElFTkSuQmCC';

const {type, size, directions} = Select.defaultProps;
export default {
  title: 'Components/Select',

  component: Select,
  args: {
    type,
    size,
    directions,
  },
};

export const withAFilterAndTags: StoryFn<MultipleSelectAttrs> = args => <Select {...args} />;
export const withAvatars: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;

{
  const avatarUrl = `${hubConfig.serverUri}/api/rest/avatar/default?username=blue`;

  const tags = [
    {label: 'One', key: '1', type: 'user', readOnly: true},
    {label: 'Two', key: '2', type: 'user', readOnly: false},
    {label: 'Three', key: '3', type: 'user'},
    {
      label: 'With icon',
      key: '4',
      icon: FLAG_DE_URL,
    },
    {
      label: 'With SVG icon',
      key: 5,
      rightGlyph: warningIcon,
    },
    {
      label: 'With avatar',
      key: 6,
      avatar: avatarUrl,
    },
    {
      label: 'With generated avatar',
      showGeneratedAvatar: true,
      username: 'With generated avatar',
      key: 7,
    },
  ];

  withAFilterAndTags.args = {
    multiple: true,
    filter: {
      placeholder: 'Search',
    },
    tags: {
      reset: {
        separator: true,
        label: 'Reset the list',
        glyph: warningIcon,
      },
    },
    data: tags,
    selected: [tags[0]],
  };

  withAvatars.args = {
    data: tags,
    selected: tags[5],
    type: Select.Type.BUTTON,
  };
}

withAFilterAndTags.storyName = 'with a filter and tags';
withAFilterAndTags.parameters = {screenshots: {skip: true}};

type StatefulProps = SingleSelectAttrs & {
  text?: ReactNode;
};

export const WithAFilter: StoryFn<StatefulProps> = ({text, onSelect, ...restArgs}) => {
  const [selected, setSelected] = useState<SelectItem | null | undefined>(restArgs.data?.[0]);

  const handleSelect = (option: SelectItem | null) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className='demo-container'>
      <div className='demo'>
        {text}
        <Select {...restArgs} selected={selected} onSelect={handleSelect} />
      </div>

      <Link pseudo onClick={() => setSelected(null)}>
        Clear
      </Link>
    </div>
  );
};

WithAFilter.args = {
  selectedLabel: 'Option',
  labelType: LabelType.FORM,
  label: 'Please select option',
  filter: true,
  clear: true,
  data: [
    {label: 'One', key: '1', type: 'user'},
    {label: 'Group', key: '2', description: 'Long descriptions', type: 'user'},
    {label: 'Three', key: '3', type: 'user'},
    {label: 'With icon', key: 4, icon: FLAG_DE_URL},
  ],
};
WithAFilter.argTypes = {
  selected: {
    control: {disable: true},
  },
};

WithAFilter.storyName = 'with a filter';

WithAFilter.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test~=ring-select]'},
      {
        type: 'capture',
        name: 'selectWithPopup',
        selector: ['[data-test=ring-select]', '[data-test~=ring-popup]'],
      },
    ],
  },
  storyStyles: `
<style>
  .demo {
    padding: 16px 0;
  }
</style>
      `,
};

export const ButtonModeWithAFilter: StoryFn<StatefulProps> = ({text, onSelect, ...restArgs}) => {
  const [selected, setSelected] = useState<SelectItem | null | undefined>(restArgs.data?.[0]);

  const handleSelect = (option: SelectItem | null) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className='demo-container'>
      <div className='demo'>
        {text}
        <Select {...restArgs} selected={selected} onSelect={handleSelect} />
      </div>

      <Link pseudo onClick={() => setSelected(null)}>
        Clear
      </Link>
    </div>
  );
};

ButtonModeWithAFilter.args = {
  type: Select.Type.BUTTON,
  selectedLabel: 'Option',
  label: 'Please select option',
  filter: true,
  clear: true,
  data: [
    {label: 'One', key: '1', type: 'user'},
    {label: 'Group', key: '2', description: 'Long descriptions', type: 'user'},
    {label: 'Three', key: '3', type: 'user'},
    {label: 'With icon', key: 4, icon: FLAG_DE_URL},
  ],
};
ButtonModeWithAFilter.argTypes = {
  selected: {
    control: {disable: true},
  },
};

ButtonModeWithAFilter.storyName = 'button mode with a filter';

ButtonModeWithAFilter.parameters = {
  screenshots: {captureSelector: '*[data-test~=ring-select]'},
  a11y: {context: '#storybook-root,*[data-test~=ring-select]'},
  storyStyles: `
<style>
  .demo {
    margin: 32px 0 16px 0;
  }
</style>
      `,
};

export const InlineWithAFilter: StoryFn<StatefulProps> = ({text, onSelect, ...restArgs}) => {
  const [selected, setSelected] = useState<SelectItem | null | undefined>(restArgs.data?.[0]);

  const handleSelect = (option: SelectItem | null) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className='demo-container'>
      <div className='demo'>
        {text}
        <Select {...restArgs} selected={selected} onSelect={handleSelect} />
      </div>

      <Link pseudo onClick={() => setSelected(null)}>
        Clear
      </Link>
    </div>
  );
};

InlineWithAFilter.args = {
  text: 'Selected option is ',
  type: Select.Type.INLINE,
  filter: true,
  clear: true,
  data: [
    {label: 'One', key: '1', type: 'user'},
    {label: 'Group', key: '2', type: 'user'},
    {label: 'Three', key: '3', type: 'user'},
  ],
  filterIcon: searchIcon,
};
InlineWithAFilter.argTypes = {
  selected: {
    control: {disable: true},
  },
};

InlineWithAFilter.storyName = 'inline with a filter';

InlineWithAFilter.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test~=ring-select]'},
      {
        type: 'capture',
        name: 'selectWithPopup',
        selector: ['[data-test=ring-select]', '[data-test~=ring-popup]'],
      },
    ],
  },
  storyStyles: `
<style>
  .demo {
    margin: 16px 0;
  }
</style>
      `,
};

export const InlineOpensToLeft: StoryFn<StatefulProps> = ({text, onSelect, ...restArgs}) => {
  const [selected, setSelected] = useState<SelectItem | null | undefined>(restArgs.data?.[0]);

  const handleSelect = (option: SelectItem | null) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className='demo-container'>
      <div className='demo'>
        {text}
        <Select {...restArgs} selected={selected} onSelect={handleSelect} />
      </div>

      <Link pseudo onClick={() => setSelected(null)}>
        Clear
      </Link>
    </div>
  );
};

InlineOpensToLeft.args = {
  text: 'Selected option is ',
  type: Select.Type.INLINE,
  filter: true,
  clear: true,
  directions: [Popup.PopupProps.Directions.BOTTOM_LEFT],
  data: [
    {label: 'One', key: '1', type: 'user'},
    {label: 'Group', key: '2', type: 'user'},
    {label: 'Three', key: '3', type: 'user'},
  ],
};
InlineOpensToLeft.argTypes = {
  selected: {
    control: {disable: true},
  },
};

InlineOpensToLeft.storyName = 'inline (opens to left)';

InlineOpensToLeft.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
  .demo-container {
    padding: 8px;
    padding-left: 128px;
    width: 50%;
  }

  .demo {
    margin: 16px 0;
  }
</style>
      `,
};

export const WithDisabledMoveOverflow: StoryFn<StatefulProps> = ({text, onSelect, ...restArgs}) => {
  const [selected, setSelected] = useState<SelectItem | null | undefined>(restArgs.data?.[0]);

  const handleSelect = (option: SelectItem | null) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className='demo-container'>
      <div className='demo'>
        {text}
        <Select {...restArgs} selected={selected} onSelect={handleSelect} />
      </div>

      <Link pseudo onClick={() => setSelected(null)}>
        Clear
      </Link>
    </div>
  );
};

WithDisabledMoveOverflow.args = {
  selectedLabel: 'Option',
  label: 'Please select option',
  filter: true,
  clear: true,
  disableMoveOverflow: true,
  data: [
    {label: 'One', key: '1', type: 'user'},
    {label: 'Group', key: '2', type: 'user'},
    {label: 'Three', key: '3', type: 'user'},
  ],
};
WithDisabledMoveOverflow.argTypes = {
  selected: {
    control: {disable: true},
  },
};

WithDisabledMoveOverflow.storyName = 'with disabled move overflow';

WithDisabledMoveOverflow.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
  .demo-container {
    padding: 8px;
    width: 50%;
  }

  .demo {
    margin: 16px 0;
  }
</style>`,
};

const alwaysTrue = () => true;

export const WithServerSideFiltering: StoryFn<SingleSelectAttrs> = args => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<SelectItem[]>([]);
  const requestRef = useRef<Promise<SelectItem[]> | null>(null);
  const auth = useRef<Auth>(null);
  const source = useRef<Source>(null);
  const {onFilter} = args;
  const loadData = useCallback(
    async (query = '') => {
      onFilter?.(query);
      const request = source.current?.getForList(query) ?? null;
      requestRef.current = request;
      setLoading(true);

      const data = (await request) ?? [];

      // only the latest request is relevant
      if (requestRef.current === request) {
        setLoading(false);
        setUsers(data);
      }
    },
    [onFilter, source],
  );

  useEffect(() => {
    (async () => {
      auth.current = new Auth(hubConfig);
      source.current = new Source(auth.current, {searchMax: 8});
      await auth.current.init();
      await loadData();
    })();
  }, [auth, loadData]);

  return <Select {...args} data={users} onFilter={loadData} loading={loading} />;
};

WithServerSideFiltering.args = {
  label: 'Set owner',
  selectedLabel: 'Owner',
  filter: {
    placeholder: 'Search user or group',
    fn: alwaysTrue, // disable client filtering
  },
};

WithServerSideFiltering.storyName = 'with server-side filtering';
WithServerSideFiltering.parameters = {screenshots: {skip: true}};
WithServerSideFiltering.tags = ['skip-test'];

export const WithFuzzySearchFilter: StoryFn<StatefulProps> = ({text, onSelect, ...restArgs}) => {
  const [selected, setSelected] = useState<SelectItem | null | undefined>(restArgs.data?.[0]);

  const handleSelect = (option: SelectItem | null) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className='demo-container'>
      <div className='demo'>
        {text}
        <Select {...restArgs} selected={selected} onSelect={handleSelect} />
      </div>

      <Link pseudo onClick={() => setSelected(null)}>
        Clear
      </Link>
    </div>
  );
};

WithFuzzySearchFilter.args = {
  selectedLabel: 'Option',
  label: 'Please select option',
  filter: {fuzzy: true},
  clear: true,
  data: [
    {label: 'One', key: '1', type: 'user'},
    {label: 'Group', key: '2', type: 'user'},
    {label: 'Three', key: '3', type: 'user'},
    {label: 'With icon', key: 4, icon: FLAG_DE_URL},
  ],
};
WithFuzzySearchFilter.argTypes = {
  selected: {
    control: {disable: true},
  },
};

WithFuzzySearchFilter.storyName = 'with fuzzy search filter';

WithFuzzySearchFilter.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
  .demo {
    margin: 32px 0 16px 0;
  }
</style>
      `,
};

export const withALargeDataset: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;

withALargeDataset.storyName = 'with a large dataset';
withALargeDataset.parameters = {screenshots: {skip: true}};
withALargeDataset.tags = ['skip-test'];

export const withALargeDatasetAndDisabledScrollToActiveItem: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;

withALargeDatasetAndDisabledScrollToActiveItem.storyName = 'with a large dataset and disabled scroll to active item';

withALargeDatasetAndDisabledScrollToActiveItem.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test~=ring-select]'},
      {
        type: 'capture',
        name: 'selectWithPopup',
        selector: ['[data-test=ring-select]', '[data-test~=ring-popup]'],
      },
    ],
  },
};

{
  const elementsNum = 100000;
  const selectedIndex = elementsNum / 2;
  const dataset = [...Array(elementsNum)].map((elem, idx) => ({
    label: `element ${idx}`,
    key: idx,
    type: 'user',
  }));

  withALargeDataset.args = {
    filter: true,
    compact: true,
    selected: dataset[selectedIndex],
    data: dataset,
  };

  withALargeDatasetAndDisabledScrollToActiveItem.args = {
    filter: true,
    compact: true,
    selected: dataset[selectedIndex],
    data: dataset,
    disableScrollToActive: true,
  };
}

export const multipleWithADescription: StoryFn<MultipleSelectAttrs> = args => <Select {...args} />;

{
  const deFlag =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAUCAIAAACMMcMmAAAAKklEQVRIx2NgGAWjgAbAh/aI4S7t0agdI9COzx00Rwz/z9Ecjdox8uwAACkGSkKIaGlAAAAAAElFTkSuQmCC';
  const ruFlag =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAOUlEQVR42u3TUQ0AIAwD0aIGt5OFBtx0mCBNljsD7+uWXwoEDPwPrvKJwJINDDwLvtqZnSwZGHgU3Kx2NIuI4wdUAAAAAElFTkSuQmCC';
  const avatarUrl =
    'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZGVmcz4KICAgICAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50IiB4MT0iMCIgeTE9IjAiIHgyPSIwIiB5Mj0iMSI+CiAgICAgICAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNCMzQ1RjEiIG9mZnNldD0iMCIvPgogICAgICAgICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjNjY5REZGIiBvZmZzZXQ9IjEiLz4KICAgICAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgogICAgPGc+CiAgICAgICAgPHJlY3QgZmlsbD0idXJsKCNncmFkaWVudCkiCiAgICAgICAgICAgICAgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IgogICAgICAgICAgICAgIHJ4PSIzIiByeT0iMyIvPgogICAgICAgIDx0ZXh0IHg9IjIiIHk9IjEzIgogICAgICAgICAgICAgIGZvbnQtZmFtaWx5PSJBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmIgogICAgICAgICAgICAgIGZvbnQtc2l6ZT0iMTFweCIKICAgICAgICAgICAgICBmaWxsPSIjRkZGRkZGIj4KICAgICAgICAgICAgPHRzcGFuPkJMPC90c3Bhbj4KICAgICAgICAgICAgPHRzcGFuIHg9IjMiIHk9IjE3Ij5fPC90c3Bhbj4KICAgICAgICA8L3RleHQ+CiAgICA8L2c+Cjwvc3ZnPg==';
  const icons = [deFlag, ruFlag, undefined];

  const elementsNum = 5;
  const dataset = [...Array(elementsNum)].map((elem, idx) => ({
    label: `element ${idx}`,
    key: idx,
    description: `description ${idx}`,
    icon: icons[idx % 3],
    avatar: idx % 2 ? avatarUrl : null,
  }));

  multipleWithADescription.args = {
    filter: true,
    selected: [dataset[0], dataset[3]],
    multiple: true,
    data: dataset,
  };
}

multipleWithADescription.storyName = 'multiple with a description';

multipleWithADescription.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test~=ring-select]'},
      {
        type: 'capture',
        name: 'selectWithPopup',
        selector: ['[data-test=ring-select]', '[data-test~=ring-popup]'],
      },
    ],
  },
};

export const disabled = () => (
  <div>
    <div className='demo-wrapper'>
      <Select disabled loading />
    </div>
    <div className='demo-wrapper'>
      <Select disabled loading type={Select.Type.BUTTON} />
    </div>
  </div>
);

disabled.storyName = 'disabled';

disabled.parameters = {
  storyStyles: `
<style>
  .demo-wrapper {
    margin: 8px;
  }
</style>
      `,
};

export const inputBased: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;

inputBased.storyName = 'input-based';

inputBased.parameters = {
  screenshots: {
    actions: [
      {type: 'click', selector: '[data-test~=ring-input]'},
      {
        type: 'capture',
        name: 'selectWithPopup',
        selector: ['[data-test=ring-select]', '[data-test~=ring-popup]'],
      },
    ],
  },
};

export const inputBasedInSuggestOnlyMode: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;

inputBasedInSuggestOnlyMode.storyName = 'input-based in suggest-only mode';
inputBasedInSuggestOnlyMode.parameters = {screenshots: {skip: true}};

export const inputBasedWithError: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
inputBasedWithError.storyName = 'input-based with error';

export const inputBasedWithFilterIcon: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
inputBasedWithFilterIcon.storyName = 'input-based with filter icon';

export const inputWithoutControls: StoryFn<SingleSelectAttrs> = args => <Select {...args} className='wrapper' />;

inputWithoutControls.storyName = 'input without controls';

inputWithoutControls.parameters = {
  storyStyles: `
<style>
  .wrapper {
    border: 1px solid var(--ring-borders-color);
    border-radius: var(--ring-border-radius);
  }
</style>
      `,
};

inputWithoutControls.tags = ['skip-test'];

{
  const data = [...Array(20)].map((elem, idx) => ({label: `Item ${idx}`, key: idx}));

  inputBased.args = {
    type: Select.Type.INPUT,
    data,
    clear: true,
  };

  inputBasedInSuggestOnlyMode.args = {
    type: Select.Type.INPUT,
    allowAny: true,
    hideArrow: true,
    label: 'Placeholder without arrow',
    data,
    selected: data[1],
  };

  inputBasedWithError.args = {
    type: Select.Type.INPUT,
    data,
    clear: true,
    error: 'Error description that wraps over lines because of being really long',
  };

  inputBasedWithFilterIcon.args = {
    type: Select.Type.INPUT,
    data,
    clear: true,
    filterIcon: searchIcon,
  };

  inputWithoutControls.args = {
    type: Select.Type.INPUT_WITHOUT_CONTROLS,
    data,
  };
}

export const withSubLevelsForListElement: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;

withSubLevelsForListElement.args = {
  filter: true,
  data: [
    {label: 'One', key: '1'},
    {label: 'Two', key: '2', disabled: true},
    {label: 'Two One', key: '2.1', level: 1},
    {label: 'Two Two', key: '2.2', level: 1},
    {label: 'Three', key: '3'},
  ],
};

withSubLevelsForListElement.storyName = 'with sub levels for list element';
withSubLevelsForListElement.parameters = {screenshots: {skip: true}};

export const withDefaultFilterModeAndALoadingIndicator: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
{
  const data = [
    {label: 'One', key: '1'},
    {label: 'Group', key: '2'},
    {label: 'Three', key: '3'},
  ];

  withDefaultFilterModeAndALoadingIndicator.args = {
    filter: true,
    loading: true,
    data,
    selected: data[1],
  };
}

withDefaultFilterModeAndALoadingIndicator.storyName = 'with default filter mode and a loading indicator';
withDefaultFilterModeAndALoadingIndicator.parameters = {screenshots: {skip: true}};

export const withACustomizedFilterAndAnAddItemButton: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
{
  const data = [...Array(100)].map((elem, idx) => ({
    label: `Item long long long long long long long long label ${idx}`,
    key: idx,
  }));

  withACustomizedFilterAndAnAddItemButton.args = {
    filter: {
      placeholder: 'Select me',
      value: 'One',
    },
    hint: 'Press down to do something',
    add: {
      prefix: 'Add name',
    },
    data,
    selected: data[49],
  };
}

withACustomizedFilterAndAnAddItemButton.storyName = "with a customized filter and an 'Add item' button";
withACustomizedFilterAndAnAddItemButton.parameters = {screenshots: {skip: true}};

export const withCustomItemsAndAnAddItemButton: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
withCustomItemsAndAnAddItemButton.args = {
  data: [...Array(100)].map((elem, idx) => {
    const label = `Label ${idx}`;
    return {
      label,
      key: label,
      template: <span className='label'>{label}</span>,
      rgItemType: List.ListProps.Type.CUSTOM,
    };
  }),
  filter: true,
  hint: 'Press down to do something',
  add: {
    prefix: 'Add label',
  },
};

withCustomItemsAndAnAddItemButton.storyName = "with custom items and an 'Add item' button";

withCustomItemsAndAnAddItemButton.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
  .label {
    border-radius: var(--ring-border-radius);
    color: #669ECC;
    background-color: #E5F4FF;
    padding-left: 8px;
    margin: 2px 0;
  }
</style>
      `,
};

export const withAnAlwaysVisibleAddItemButton: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
withAnAlwaysVisibleAddItemButton.args = {
  data: [...Array(10)].map((elem, idx) => ({
    key: idx,
    label: `Item ${idx}`,
  })),
  filter: {
    placeholder: 'Select me',
    value: 'One',
  },
  add: {
    alwaysVisible: true,
    label: 'Create New Blah Blah',
  },
};

withAnAlwaysVisibleAddItemButton.storyName = "with an always visible 'Add item' button";
withAnAlwaysVisibleAddItemButton.parameters = {screenshots: {skip: true}};

export const multipleWithCustomView: StoryFn<MultipleSelectAttrs> = args => <Select {...args} />;
{
  const data = [
    {label: 'One long label', key: '1'},
    {label: 'Two long label', key: '2'},
    {label: 'Three long label', key: '3'},
  ];

  const multipleConfig = {label: 'Change selected items', removeSelectedItems: false};

  multipleWithCustomView.args = {
    filter: true,
    add: {
      prefix: 'Add some item',
    },
    multiple: multipleConfig,
    selected: [data[1]],
    data,
  };
}

multipleWithCustomView.storyName = 'multiple with custom view';
multipleWithCustomView.parameters = {screenshots: {skip: true}};

export const asADropdownWithoutFilter: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
asADropdownWithoutFilter.args = {
  data: [...Array(20)].map((elem, idx) => ({
    label: `Item ${idx}`,
    description: `Description for the item lalalalala ${idx}`,
    key: idx,
  })),
  type: Select.Type.CUSTOM,
  label: 'Click me',
  customAnchor({wrapperProps, buttonProps, popup}) {
    return (
      <span {...wrapperProps}>
        <button type='button' {...buttonProps} />
        {popup}
      </span>
    );
  },
};

asADropdownWithoutFilter.storyName = 'as a dropdown without filter';
asADropdownWithoutFilter.parameters = {screenshots: {skip: true}};

interface DemoComponentItem {
  label: string;
}

type DemoComponentProps = Omit<SingleSelectAttrs<DemoComponentItem>, 'onChange'> & {
  onChange: (e: SyntheticEvent) => void;
};

export const WithCustomInputAnchor: StoryFn<DemoComponentProps> = ({onChange, ...restArgs}) => {
  const [inputValue, setInputValue] = React.useState('');
  const selectRef = React.useRef<Select<DemoComponentItem>>(null);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    setInputValue(e.currentTarget.value);
    if (selectRef.current) {
      // eslint-disable-next-line no-underscore-dangle
      selectRef.current._filterChangeHandler(e);
    }
  };

  return (
    <Select
      {...restArgs}
      ref={selectRef}
      onChange={(item: SelectItem<DemoComponentItem> | null) => setInputValue(item?.label ?? '')}
      customAnchor={({wrapperProps, buttonProps, popup}) => (
        <span {...wrapperProps}>
          <Input
            value={inputValue}
            label='Custom'
            onChange={onInputChange}
            {...(buttonProps as ContainerProps<InputSpecificProps>)}
          />
          {popup}
        </span>
      )}
    />
  );
};
WithCustomInputAnchor.args = {
  data: [...Array(20)].map((elem, idx) => ({
    label: `Item ${idx}`,
    description: `Description for the item lalalalala ${idx}`,
    key: idx,
  })),
  type: Select.Type.CUSTOM,
};

WithCustomInputAnchor.storyName = 'with custom input anchor';
WithCustomInputAnchor.parameters = {screenshots: {skip: true}};

export const withRenderOptimization: StoryFn<SingleSelectAttrs> = args => <Select {...args} />;
withRenderOptimization.args = {
  data: [...Array(1000)].map((item, idx) => ({
    label: `Label ${idx}`,
    key: idx,
    rgItemType: idx % 10 ? List.ListProps.Type.ITEM : List.ListProps.Type.TITLE,
  })),
  filter: true,
};

withRenderOptimization.storyName = 'with render optimization';
withRenderOptimization.parameters = {screenshots: {skip: true}};

export const fitsToScreen: StoryFn<SingleSelectAttrs> = args => (
  <div className='demo'>
    <Select {...args} />
  </div>
);

{
  const dataset = [...Array(1000)].map((item, idx) => ({
    label: `element ${idx}`,
    key: idx,
    type: 'user',
  }));
  const selectedIndex = dataset.length / 2;

  fitsToScreen.args = {
    maxHeight: 5000,
    filter: true,
    compact: true,
    selected: dataset[selectedIndex],
    data: dataset,
  };
}

fitsToScreen.storyName = 'fits to screen';

fitsToScreen.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
  .demo {
    position: absolute;
    bottom: 20px;
  }
</style>
      `,
};

export const WithFilteredFields = () => {
  const data = [...Array(100)].map((item, idx) => {
    const label = `Label ${idx}`;
    return {
      key: idx,
      label,
      template: <span className='label'>{label}</span>,
      rgItemType: List.ListProps.Type.CUSTOM,
    };
  });

  const filtersData = [
    {label: 'Show odd', key: '1'},
    {label: 'Show even', key: '2'},
    {label: 'Show all', key: '3'},
  ];

  const [filteredData, setFilteredData] = useState(data.filter(item => item.key % 2));

  const [selectedDataKey, setSelectedDataKey] = useState<string | number | null>(null);

  const [selectedFilterKey, setSelectedFilterKey] = useState<string | number | undefined>(filtersData[0].key);

  const handleFilterSelect = (selected: SelectItem | null) => {
    setFilteredData(
      selected?.label === 'Show all'
        ? [...data]
        : data.filter(item => !!(Number(item.key) % 2) === (selected?.label === 'Show odd')),
    );
    setSelectedFilterKey(selected?.key);
    setSelectedDataKey(null);
  };

  const handleDataSelect = (selected: SelectItem | null) => {
    setSelectedDataKey(selected && selected.key);
  };

  return (
    <div className='filters-block'>
      <Select
        selectedLabel='Filter'
        label='Please select filter'
        filter
        clear
        selected={filtersData.filter(item => item.key === selectedFilterKey)[0]}
        onSelect={handleFilterSelect}
        data={filtersData}
      />
      <Select
        key={selectedFilterKey}
        selectedLabel='Option'
        label='Please select option'
        filter
        clear
        selected={filteredData.filter(item => item.key === selectedDataKey)[0]}
        onSelect={handleDataSelect}
        data={filteredData}
      />
    </div>
  );
};

WithFilteredFields.storyName = 'with filtered fields';

WithFilteredFields.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
    .filters-block {
      padding: 8px 0;
    }

    .filters-block > *:not(:nth-of-type(1)) {
      margin-left: 20px;
    }
</style>
      `,
};

export const multipleWithSelectAll: StoryFn<MultipleSelectAttrs> = args => <Select {...args} />;
{
  const data = [
    {label: 'One long label', key: '1'},
    {label: 'Two long label', key: '2'},
    {label: 'Three long label', key: '3'},
  ];

  const multipleConfig = {selectAll: true};

  multipleWithSelectAll.args = {
    filter: true,
    multiple: multipleConfig,
    selected: [data[1]],
    data,
  };
}

multipleWithSelectAll.storyName = 'multiple with select all';
multipleWithSelectAll.parameters = {screenshots: {skip: true}};

export const multipleWithSelectAllAndDisabledItem: StoryFn<MultipleSelectAttrs> = args => <Select {...args} />;
{
  const data = [
    {label: 'One long label', key: '1'},
    {label: 'Two long label', key: '2'},
    {label: 'Three long label', key: '3'},
    {label: 'Four long label', key: '4', disabled: true},
    {label: 'Four long selected and disabled', key: '5', disabled: true},
  ];

  const multipleConfig = {selectAll: true};

  multipleWithSelectAllAndDisabledItem.args = {
    filter: true,
    multiple: multipleConfig,
    selected: [data[1], data[4]],
    data,
  };
}

multipleWithSelectAllAndDisabledItem.storyName = 'multiple with select all and disabled item';
multipleWithSelectAllAndDisabledItem.parameters = {screenshots: {skip: true}};

export const multipleWithSelectAllAndCustomLabels = (args: SelectProps) => <Select {...args} />;
{
  const data = [
    {label: 'One long label', key: '1'},
    {label: 'Two long label', key: '2'},
    {label: 'Three long label', key: '3'},
  ];

  const multipleConfig: Multiple = {
    selectAll: true,
    selectAllLabel: 'All Items',
    deselectAllLabel: 'None Items',
    renderSelectedItemsDescription: selected => <Text info>{`${selected.length} items selected`}</Text>,
  };

  multipleWithSelectAllAndCustomLabels.args = {
    filter: true,
    multiple: multipleConfig,
    selected: [data[1]],
    data,
  };
}

multipleWithSelectAllAndCustomLabels.storyName = 'multiple with select all and custom labels';
multipleWithSelectAllAndCustomLabels.parameters = {screenshots: {skip: true}};

export const multipleWithLimit: StoryFn<MultipleSelectAttrs> = args => <Select {...args} />;
{
  const data = [
    {label: 'One long label', key: '1'},
    {label: 'Two long label', key: '2'},
    {label: 'Three long label', key: '3'},
    {label: 'Four long label', key: '4'},
    {label: 'Five long label', key: '5'},
    {label: 'Six long label', key: '6'},
  ];

  const multipleConfig = {limit: 2};

  multipleWithLimit.args = {
    filter: true,
    multiple: multipleConfig,
    selected: [data[1]],
    data,
  };
}

multipleWithLimit.storyName = 'multiple with limit';
multipleWithLimit.parameters = {screenshots: {skip: true}};

export const selectInPopup: StoryFn<SingleSelectAttrs> = args => (
  <Dropdown anchor='Open dropdown'>
    <Popup className={'popup-test-class'} maxHeight={100}>
      <Select {...args} />
    </Popup>
  </Dropdown>
);
selectInPopup.args = {
  data: [
    {label: 'One long label', key: '1'},
    {label: 'Two long label', key: '2'},
    {label: 'Three long label', key: '3'},
    {label: 'Four long label', key: '4'},
    {label: 'Five long label', key: '5'},
    {label: 'Six long label', key: '6'},
  ],
  filter: true,
};

selectInPopup.storyName = 'Select in Popup';

selectInPopup.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
  .popup-test-class {
    width: 300px;
    height: 300px;
  }
</style>
      `,
};

export const heightS = () => {
  const data = [{label: 'One', key: 1, showGeneratedAvatar: true, username: 'User'}];
  return <Select height={ControlsHeight.S} data={data} selected={data[0]} clear />;
};

export const showPopup: StoryObj<SingleSelectAttrs> = {
  args: {
    showPopup: true,
    data: [
      {label: 'One', key: '1', type: 'user'},
      {label: 'Group', key: '2', description: 'Long descriptions', type: 'user'},
      {label: 'Three', key: '3', type: 'user'},
      {label: 'With icon', key: 4, icon: FLAG_DE_URL},
    ],
  },
  parameters: {
    screenshots: {
      captureSelector: ['[data-test=ring-select]', '[data-test~=ring-popup]'],
    },
    a11y: {
      options: {rules: {'aria-valid-attr-value': {enabled: false}}},
    },
  },
};
