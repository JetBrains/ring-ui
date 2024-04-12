import React, {useMemo} from 'react';
import permissionIcon from '@jetbrains/icons/settings';

import {StoryFn} from '@storybook/react';

import hubConfig from '../../.storybook/hub-config';


import Auth from '../auth/auth';
import HTTP from '../http/http';
import List from '../list/list';
import Icon from '../icon/icon';
import {Size} from '../input/input';

import QueryAssist, {
  QueryAssistAttrs,
  QueryAssistRequestParams,
  QueryAssistResponse
} from './query-assist';

export default {
  title: 'Components/Query Assist',

  component: QueryAssist,
  args: {
    placeholder: 'placeholder',
    glass: true,
    clear: true,
    hint: 'hint',
    hintOnSelection: 'hint on selection'
  }
};

export const Basic: StoryFn<QueryAssistAttrs> = args => {
  const [authReady, setAuthReady] = React.useState(false);
  const auth = useMemo(() => new Auth(hubConfig), []);

  React.useEffect(() => {
    auth.init().then(() => setAuthReady(true));
  }, [auth]);
  const dataSource = useMemo(() => {
    const http = new HTTP(auth, auth.getAPIPath());

    return (props: QueryAssistRequestParams) => {
      const params = {
        query: {
          ...props,
          fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
        }
      };

      return http.get<QueryAssistResponse>('users/queryAssist', params);
    };
  }, [auth]);

  if (!authReady) {
    return <span>Loading...</span>;
  }

  return (
    <>
      <QueryAssist
        {...args}
        dataSource={dataSource}
      />
      <QueryAssist
        {...args}
        dataSource={dataSource}
        size={Size.S}
      />
    </>
  );
};

Basic.storyName = 'basic';
Basic.parameters = {hermione: {skip: true}};
Basic.args = {
  query: 'test',
  focus: true,
  hint: 'lol',
  hintOnSelection: 'lol selected',
  popupClassName: 'test',
  className: 'custom-class'
};
basic.tags = ['skip-test'];

export const noAuth: StoryFn<QueryAssistAttrs> = args => <QueryAssist {...args}/>;

noAuth.storyName = 'no auth';
noAuth.args = {
  dataSource: ({query, caret}) => ({
    query,
    caret,
    styleRanges: [
      {start: 0, length: 1, style: 'text'},
      {start: 1, length: 1, style: 'field_value'},
      {start: 2, length: 1, style: 'field_name'},
      {start: 3, length: 1, style: 'operator'}
    ],
    suggestions: [
      {
        prefix: 'login: ',
        option: 'test',
        suffix: ' ',
        description: '1',
        matchingStart: 0,
        matchingEnd: query.length,
        caret: 2,
        completionStart: 0,
        completionEnd: query.length,
        group: 'Logins'
      },
      {
        prefix: 'login: ',
        option: 'test.1',
        suffix: ' ',
        description: '2',
        matchingStart: 0,
        matchingEnd: query.length,
        caret: 2,
        completionStart: 0,
        completionEnd: query.length,
        group: 'Logins'
      },
      {
        prefix: 'name: ',
        option: 'another',
        suffix: ' ',
        description: '2',
        matchingStart: 0,
        matchingEnd: query.length,
        caret: 2,
        completionStart: 0,
        completionEnd: query.length,
        group: 'Names'
      }
    ]
  })
};
noAuth.parameters = {
  hermione: {
    actions: [
      {type: 'capture', name: 'queryAssist', selector: ['[data-test~=ring-query-assist]']},
      {type: 'click', selector: '[data-test=ring-query-assist-input]'},
      {type: 'sendKeys', selector: '[data-test=ring-query-assist-input]', value: 'test '},
      {
        type: 'capture',
        name: 'withPopup',
        selector: ['[data-test~=ring-query-assist]', '[data-test~=ring-query-assist-popup]']
      }
    ]
  }
};

export const withCustomRenderer: StoryFn<QueryAssistAttrs> = args => <QueryAssist {...args}/>;

withCustomRenderer.args = {
  useCustomItemRender: true,
  dataSource: ({query, caret}) => ({
    query,
    caret,
    styleRanges: [
      {start: 0, length: 1, style: 'text'},
      {start: 1, length: 1, style: 'field_value'},
      {start: 2, length: 1, style: 'field_name'},
      {start: 3, length: 1, style: 'operator'}
    ],
    suggestions: [
      {
        prefix: 'login:',
        option: 'John.Abrams',
        description: 'John Abrams',
        group: 'Logins'
      },
      {
        prefix: 'login:',
        option: 'lenni',
        description: 'Lenni Joy',
        group: 'Names'
      }
    ].map(i => ({
      ...i,
      rgItemType: List.ListProps.Type.CUSTOM,
      template: React.createElement(
        'span',
        null,
        `My name is ${i.description}, my ${i.prefix} is ${i.option}`
      ),
      data: i
    }))
  })
};
withCustomRenderer.storyName = 'with custom renderer';
withCustomRenderer.parameters = {hermione: {skip: true}};

export const WithCustomActions: StoryFn<QueryAssistAttrs> = args => {
  const [authReady, setAuthReady] = React.useState(false);
  const auth = useMemo(() => new Auth(hubConfig), []);

  React.useEffect(() => {
    auth.init().then(() => setAuthReady(true));
  }, [auth]);

  const dataSource = useMemo(() => {
    const http = new HTTP(auth, auth.getAPIPath());

    return (props: QueryAssistRequestParams) => {
      const params = {
        query: {
          ...props,
          fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
        }
      };

      return http.get<QueryAssistResponse>('users/queryAssist', params);
    };
  }, [auth]);

  if (!authReady) {
    return <span>Loading...</span>;
  }

  return (
    <QueryAssist
      {...args}
      dataSource={dataSource}
    />
  );
};

WithCustomActions.args = {
  query: 'test',
  focus: true,
  hint: 'lol',
  hintOnSelection: 'lol selected',
  popupClassName: 'test',
  actions: [
    <Icon glyph={permissionIcon} key="custom-action" style={{color: 'var(--ring-icon-color)'}}/>
  ]
};
WithCustomActions.storyName = 'with custom actions';
WithCustomActions.parameters = {hermione: {skip: true}};
WithCustomActions.tags = ['skip-test'];

export const HugeOne: StoryFn<QueryAssistAttrs> = args => {
  const [authReady, setAuthReady] = React.useState(false);
  const auth = useMemo(() => new Auth(hubConfig), []);

  React.useEffect(() => {
    auth.init().then(() => setAuthReady(true));
  }, [auth]);

  const dataSource = useMemo(() => {
    const http = new HTTP(auth, auth.getAPIPath());

    return (props: QueryAssistRequestParams) => {
      const params = {
        query: {
          ...props,
          fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
        }
      };

      return http.get<QueryAssistResponse>('users/queryAssist', params);
    };
  }, [auth]);

  if (!authReady) {
    return <span>Loading...</span>;
  }

  return (
    <QueryAssist
      {...args}
      dataSource={dataSource}
    />
  );
};

HugeOne.storyName = 'huge one';
HugeOne.parameters = {hermione: {skip: true}};
HugeOne.args = {
  huge: true,
  query: 'test',
  focus: true,
  hint: 'lol',
  hintOnSelection: 'lol selected',
  popupClassName: 'test',
  className: 'custom-class'
};
hugeOne.tags = ['skip-test'];

export const disabledOne: StoryFn<QueryAssistAttrs> = args => (
  <QueryAssist
    {...args}
    disabled
    dataSource={() => [] as QueryAssistResponse}
  />
);

disabledOne.storyName = 'disabled one';
disabledOne.parameters = {hermione: {skip: true}};
disabledOne.args = {
  query: ''
};
