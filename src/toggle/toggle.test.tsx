import {mount} from 'enzyme';

import Toggle, {ToggleAttrs} from './toggle';
import styles from './toggle.css';

describe('Toggle', () => {
  const mountToggle = (props?: ToggleAttrs) => mount(<Toggle {...props} />);
  const getToggleLabel = (props?: ToggleAttrs) => mountToggle(props).find('label');

  it('should create component', () => {
    mountToggle().type().should.equal(Toggle);
  });

  it('should wrap children with label', () => {
    getToggleLabel().should.exist;
  });

  it('should use passed className', () => {
    getToggleLabel({
      className: 'test-class',
    }).should.have.className('test-class');
  });

  it('should render input with type checkbox', () => {
    const toggle = getToggleLabel();
    toggle.find('input').should.have.attr('type', 'checkbox');
  });

  it('should render switch', () => {
    const toggle = getToggleLabel();
    toggle.find(`.${styles.switch}`).should.exist;
  });
});
