import React, {Component} from 'react';
import {storiesOf} from '@storybook/html';
import {action} from '@storybook/addon-actions';

import QueryAssist from '../query-assist/query-assist';
import hubConfig from '../../.storybook/hub-config';
import Auth from '../auth/auth';
import HTTP from '../http/http';
import List from '../list/list';
import {PermissionIcon} from '../icon';

import reactDecorator from '../../.storybook/react-decorator';

const queryAssistLog = action('queryAssistLog');

storiesOf('Components|Query Set', module).
  addDecorator(reactDecorator()).
  add('basic', () => {
    const auth = new Auth(hubConfig);
    const http = new HTTP(auth, auth.getAPIPath());

    class QueryAssistExample extends Component {
      constructor() {
        super();
        auth.init().
          then(() => this.setState({authReady: true}));
      }

      state = {authReady: false};

      dataSource = props => {
        const params = {
          query: {
            ...props,
            fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
          }
        };

        return http.get('users/queryAssist', params);
      };

      render() {
        if (!this.state.authReady) {
          return <span>Loading...</span>;
        }

        return (
          <QueryAssist
            query="test"
            placeholder="placeholder"
            glass
            clear
            onApply={queryAssistLog}
            focus
            hint="lol"
            hintOnSelection="lol selected"
            popupClassName="test"
            dataSource={this.dataSource}
          />
        );
      }
    }

    return <QueryAssistExample/>;
  }).
  add('no auth', () => {
    const dataSource = ({query, caret}) => ({
      query,
      caret,
      styleRanges: [
        {start: 0, length: 1, style: 'text'},
        {start: 1, length: 1, style: 'field_value'},
        {start: 2, length: 1, style: 'field_name'},
        {start: 3, length: 1, style: 'operator'}
      ],
      suggestions: [{
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
      }, {
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
      }, {
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
      }]
    });

    return (
      <QueryAssist
        placeholder="placeholder"
        glass
        clear
        onApply={queryAssistLog}
        hint="hint"
        hintOnSelection="hint on selection"
        dataSource={dataSource}
      />
    );
  }).
  add('with custom renderer', () => {
    const template = item => (
      React.createElement(
        'span',
        null,
        `My name is ${item.description}, my ${item.prefix} is ${item.option}`
      )
    );

    const dataSource = ({query, caret}) => ({
      query,
      caret,
      styleRanges: [
        {start: 0, length: 1, style: 'text'},
        {start: 1, length: 1, style: 'field_value'},
        {start: 2, length: 1, style: 'field_name'},
        {start: 3, length: 1, style: 'operator'}
      ],
      suggestions: [{
        prefix: 'login:',
        option: 'John.Abrams',
        description: 'John Abrams',
        group: 'Logins'
      }, {
        prefix: 'login:',
        option: 'lenni',
        description: 'Lenni Joy',
        group: 'Names'
      }].map(i => {
        i.rgItemType = List.ListProps.Type.CUSTOM;
        i.template = template(i);
        i.data = i;
        return i;
      })
    });

    return (
      <QueryAssist
        placeholder="placeholder"
        glass
        clear
        onApply={queryAssistLog}
        hint="hint"
        hintOnSelection="hint on selection"
        dataSource={dataSource}
        useCustomItemRender
      />
    );
  }).
  add('dark theme (no-auth)', () => {
    const dataSource = async ({query, caret}) => ({
      query,
      caret,
      styleRanges: [
        {start: 0, length: 1, style: 'text'},
        {start: 1, length: 1, style: 'field_value'},
        {start: 2, length: 1, style: 'field_name'},
        {start: 3, length: 1, style: 'operator'}
      ],
      suggestions: [{
        prefix: 'login: ',
        option: 'test',
        suffix: ' ',
        description: '1',
        matchingStart: 0,
        matchingEnd: query.length,
        caret: 2,
        completionStart: 0,
        completionEnd: query.length,
        group: 'logins'
      }, {
        prefix: 'login: ',
        option: 'test.1',
        suffix: ' ',
        description: '2',
        matchingStart: 0,
        matchingEnd: query.length,
        caret: 2,
        completionStart: 0,
        completionEnd: query.length,
        group: 'logins'
      }]
    });

    return (
      <div style={{background: '#000', padding: '24px', margin: '-16px', paddingBottom: 0}}>
        <QueryAssist
          placeholder="placeholder"
          theme={QueryAssist.Theme.DARK}
          glass
          clear
          onApply={queryAssistLog}
          hint="hint"
          hintOnSelection="hint on selection"
          dataSource={dataSource}
        />
      </div>
    );
  }).
  add('with custom actions', () => {
    const auth = new Auth(hubConfig);
    const http = new HTTP(auth, auth.getAPIPath());

    class QueryAssistExample extends Component {
      constructor() {
        super();
        auth.init().
          then(() => this.setState({authReady: true}));
      }

      state = {authReady: false};

      dataSource = props => {
        const params = {
          query: {
            ...props,
            fields: `query,caret,styleRanges${props.omitSuggestions ? '' : ',suggestions'}`
          }
        };

        return http.get('users/queryAssist', params);
      };

      render() {
        if (!this.state.authReady) {
          return <span>Loading...</span>;
        }

        return (
          <QueryAssist
            query="test"
            placeholder="placeholder"
            glass
            clear
            onApply={queryAssistLog}
            focus
            hint="lol"
            hintOnSelection="lol selected"
            popupClassName="test"
            dataSource={this.dataSource}
            actions={[<PermissionIcon key="custom-action"/>]}
          />
        );
      }
    }

    return <QueryAssistExample/>;
  });
