import 'dom4';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';
import React from 'react';
import Island, {Content} from './island';
import styles from './island.css';

describe('Island', () => {
  const renderComponent = params => renderIntoDocument(<Island {...params}/>);

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Island).should.be.true;
  });

  it('should wrap children with div', () => {
    findDOMNode(renderComponent()).should.match('div');
  });

  it('should use passed className', () => {
    findDOMNode(renderComponent({className: 'test-class'})).should.match('.test-class');
  });

  it('should render content fades', () => {
    const node = findDOMNode(renderIntoDocument(<Content fade={true}/>));

    node.should.contain(`.${styles.fadeTop}`);
    node.should.contain(`.${styles.fadeBottom}`);
  });
});
