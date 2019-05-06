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

storiesOf('Components|Query Assist', module).
  addParameters({
    notes: `
## Component params

+ __autoOpen__ \`bool=false\` Open suggestions popup during the initial render
+ __caret__ \`number=query.length\` Initial caret position
+ __clear__ \`bool=false\` Show clickable "cross" icon on the right which clears the query
+ __className__ \`string=''\` Additional class for the component
+ __popupClassName__ \`string=''\` Additional class for the popup
+ __dataSource__ \`func\` Data source function
+ __delay__ \`number=0\` Input debounce delay
+ __disabled__ \`bool=false\` Disable the component
+ __focus__ \`bool=false\` Initial focus
+ __hint__ \`string=''\` Hint under the suggestions list
+ __hintOnSelection__ \`string=''\` Hint under the suggestions list visible when a suggestion is selected
+ __glass__ \`bool=false\` Show clickable "glass" icon on the right which applies the query
+ __loader__ \`bool=false\` Show loader when a data request is in process
+ __placeholder__ \`string=''\` Field placeholder value
+ __onApply__ \`func=\` Called when the query is applied. An object with fields \`caret\`, \`focus\` and \`query\` is passed as an argument
+ __onChange__ \`func=\`  Called when the query is changed. An object with fields \`caret\` and \`query\` is passed as an argument
+ __onClear__ \`func=\` Called when the query is cleared. Called without arguments
+ __onFocusChange__ \`func\` Called when the focus status is changed. An object with fields \`focus\` is passed as an argument
+ __shortcuts__ \`bool=true\` Enable shortcut
+ __query__ \`string=''\` Initial query

 ## Data source function

 Component class calls a data source function when user input happens and passes an object with fields \`caret\`, \`focus\` and \`query\` as the only argument.
 The function must return an object with the fields described below. The object can be optionally wrapped in a Promise.

 ### Return object fields

 \`caret\` and \`query\` should just return server values provided to data source function.
 These fields allow the Query Assist component to recognise and drop earlier responses from the server.

+ __caret__ (\`string=0\`) Caret from request
+ __query__ (\`string=''\`) Query from request
+ __styleRanges__ (\`Array<suggestion>=\`) Array of \`styleRange\` objects, used to highlight the request in the input field
+ __suggestions__ (\`Array<styleRange>\`) Array of \`suggestion\` objects to show.

 ### **styleRange** object fields

 start \`number\` Range start (in characters)
 length \`number\` Range length (in characters)
 style \`string\` Style of the range. Possible values: \`text\`, \`field_value\`, \`field_name\`, \`operator\`

 ### **suggestion** object fields

+ __prefix__ \`string=\` Suggestion option prefix
+ __option__ \`string\` Suggestion option
+ __suffix__ \`string=\` Suggestion option suffix
+ __description__ \`string=\` Suggestion option description. Is not visible when a group is set
+ __matchingStart__ \`number\` (required when matchingEnd is set) Start of the highlighted part of an option in the suggestions list (in characters)
+ __matchingEnd__ \`number\` (required when matchingEnd is set) End of the highlighted part of an option in the suggestions list (in characters)
+ __caret__ \`number\` Caret position after option completion (in characters)
+ __completionStart__ \`number\` Where to start insertion (or replacement, when completing with the \`Tab\` key) of the completion option (in characters)
+ __completionEnd__ \`number\` Where to end insertion of the completion option (in characters)
+ __group__ \`string=\` Group title. Options with the same title are grouped under it
+ __icon__ \`string=\` Icon URI, Data URI is possible

    `
  }).
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
  }, {hermione: {skip: true}}).
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
  }, {
    hermione: {
      actions: [
        {type: 'capture', name: 'queryAssist', selector: ['[data-test~=ring-query-assist]']},
        {type: 'click', selector: '[data-test=ring-query-assist-input]'},
        {type: 'sendKeys', selector: '[data-test=ring-query-assist-input]', value: 'test '},
        {type: 'capture', name: 'withPopup', selector: ['[data-test~=ring-query-assist]', '[data-test~=ring-query-assist-popup]']}
      ]
    }
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
  }, {hermione: {skip: true}}).
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
  }, {
    hermione: {
      actions: [
        {type: 'capture', name: 'queryAssist', selector: ['[data-test~=ring-query-assist]']},
        {type: 'click', selector: '[data-test=ring-query-assist-input]'},
        {type: 'capture', name: 'withPopup', selector: ['[data-test~=ring-query-assist]', '[data-test~=ring-query-assist-popup]']}
      ]
    }
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
  }, {hermione: {skip: true}});
