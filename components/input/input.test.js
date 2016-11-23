import 'dom4';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import Input from './input';
import styles from './input.css';

describe('Input', () => {
  const renderComponent = params => renderIntoDocument(Input.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), Input).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should create input by default', () => {
    renderComponent().node.query(`.${styles.input}`).should.match('input');
  });

  it('should create textarea with multiline option', () => {
    renderComponent({multiline: true}).node.query(`.${styles.input}`).should.match('textarea');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });

  // TODO Add more tests
});
