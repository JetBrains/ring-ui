import {render} from '@testing-library/react';

import Toggle, {ToggleAttrs} from './toggle';
import styles from './toggle.css';

describe('Toggle', () => {
  const renderToggle = (props?: ToggleAttrs) => render(<Toggle {...props} />);

  it('should create component', () => {
    const {container} = renderToggle();
    container.querySelector('label')?.should.exist;
  });

  it('should wrap children with label', () => {
    const {container} = renderToggle();
    container.querySelector('label')?.should.exist;
  });

  it('should use passed className', () => {
    const {container} = renderToggle({className: 'test-class'});
    container.querySelector('.test-class')?.should.exist;
  });

  it('should render input with type checkbox', () => {
    const {container} = renderToggle();
    const input = container.querySelector('input');
    input?.should.exist;
    input?.getAttribute('type')?.should.equal('checkbox');
  });

  it('should render switch', () => {
    const {container} = renderToggle();
    container.querySelector(`.${styles.switch}`)?.should.exist;
  });
});
