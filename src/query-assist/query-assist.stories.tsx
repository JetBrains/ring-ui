import React, {Component} from 'react';
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
import {QueryAssistSuggestion} from './query-assist__suggestions';

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

class Basic extends Component {
  constructor(props: QueryAssistAttrs) {
    super(props);
    this.auth.init().then(() => this.setState({authReady: true}));
  }

  state = {authReady: false};
  auth = new Auth(hubConfig);
  http = new HTTP(this.auth, this.auth.getAPIPath());

  dataSource = (props: QueryAssistRequestParams) => {
    const params = {
      query: {
        ...props,
        fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
      }
    };

    return this.http.get<QueryAssistResponse>('users/queryAssist', params);
  };

  render() {
    if (!this.state.authReady) {
      return <span>Loading...</span>;
    }

    return (
      <>
        <QueryAssist
          {...this.props}
          dataSource={this.dataSource}
        />
        <QueryAssist
          {...this.props}
          dataSource={this.dataSource}
          size={Size.S}
        />
      </>
    );
  }
}
export const basic: StoryFn<QueryAssistAttrs> = args => <Basic {...args}/>;

basic.storyName = 'basic';
basic.parameters = {hermione: {skip: true}};
basic.args = {
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

const template = (item: QueryAssistSuggestion) =>
  React.createElement(
    'span',
    null,
    `My name is ${item.description}, my ${item.prefix} is ${item.option}`
  );

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
      template: template(i),
      data: i
    }))
  })
};
withCustomRenderer.storyName = 'with custom renderer';
withCustomRenderer.parameters = {hermione: {skip: true}};

class QueryAssistExample extends Component {
  constructor(props: QueryAssistAttrs) {
    super(props);
    const auth = new Auth(hubConfig);
    this.http = new HTTP(auth, auth.getAPIPath());
    auth.init().then(() => this.setState({authReady: true}));
  }

  state = {authReady: false};
  http: HTTP;

  dataSource = (props: QueryAssistRequestParams) => {
    const params = {
      query: {
        ...props,
        fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
      }
    };

    return this.http.get<QueryAssistResponse>('users/queryAssist', params);
  };

  render() {
    if (!this.state.authReady) {
      return <span>Loading...</span>;
    }

    return (
      <QueryAssist
        {...this.props}
        dataSource={this.dataSource}
      />
    );
  }
}

export const withCustomActions: StoryFn<QueryAssistAttrs> = args => <QueryAssistExample {...args}/>;

withCustomActions.args = {
  query: 'test',
  focus: true,
  hint: 'lol',
  hintOnSelection: 'lol selected',
  popupClassName: 'test',
  actions: [
    <Icon glyph={permissionIcon} key="custom-action" style={{color: 'var(--ring-icon-color)'}}/>
  ]
};
withCustomActions.storyName = 'with custom actions';
withCustomActions.parameters = {hermione: {skip: true}};
withCustomActions.tags = ['skip-test'];

class HugeOne extends Component {
  constructor(props: QueryAssistAttrs) {
    super(props);
    this.auth.init().then(() => this.setState({authReady: true}));
  }

  state = {authReady: false};
  auth = new Auth(hubConfig);
  http = new HTTP(this.auth, this.auth.getAPIPath());

  dataSource = (props: QueryAssistRequestParams) => {
    const params = {
      query: {
        ...props,
        fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
      }
    };

    return this.http.get<QueryAssistResponse>('users/queryAssist', params);
  };

  render() {
    if (!this.state.authReady) {
      return <span>Loading...</span>;
    }

    return (
      <QueryAssist
        {...this.props}
        dataSource={this.dataSource}
      />
    );
  }
}
export const hugeOne: StoryFn<QueryAssistAttrs> = args => <HugeOne {...args}/>;

hugeOne.storyName = 'huge one';
hugeOne.parameters = {hermione: {skip: true}};
hugeOne.args = {
  huge: true,
  query: 'test',
  focus: true,
  hint: 'lol',
  hintOnSelection: 'lol selected',
  popupClassName: 'test',
  className: 'custom-class'
};
hugeOne.tags = ['skip-test'];


class DisabledOne extends Component {
  dataSource = () => [] as QueryAssistResponse;

  render() {
    return (
      <QueryAssist
        disabled
        dataSource={this.dataSource}
        {...this.props}
      />
    );
  }
}
export const disabledOne: StoryFn<QueryAssistAttrs> = args => <DisabledOne {...args}/>;

disabledOne.storyName = 'disabled one';
disabledOne.parameters = {hermione: {skip: true}};
disabledOne.args = {
  query: ''
};
