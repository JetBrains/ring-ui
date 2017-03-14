import 'dom4';
import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument} from 'react-addons-test-utils';

import Markdown from './markdown';

describe('Markdown', () => {
  class Wrapper extends PureComponent {
    render() {
      return (
        <Markdown
          source=""
          {...this.props}
        />
      );
    }
  }

  const renderComponent = props => renderIntoDocument(<Wrapper {...props} />);

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  // TODO Add more tests
});
