import {render} from '@testing-library/react';

import Toggle, {ToggleAttrs} from './toggle';
import styles from './toggle.css';

describe('Toggle', () => {
  const renderToggle = (props?: ToggleAttrs) => render(<Toggle {...props} />);

  it('should create component', () => {
    const {container} = renderToggle();
    expect(container.querySelector('label')).to.exist;
  });

  it('should wrap children with label', () => {
    const {container} = renderToggle();
    expect(container.querySelector('label')).to.exist;
  });

  it('should use passed className', () => {
    const {container} = renderToggle({className: 'test-class'});
    expect(container.querySelector('.test-class')).to.exist;
  });

  it('should render input with type checkbox', () => {
    const {container} = renderToggle();
    const input = container.querySelector('input');
    expect(input).to.exist;
    expect(input?.getAttribute('type')).to.equal('checkbox');
  });

  it('should render switch', () => {
    const {container} = renderToggle();
    expect(container.querySelector(`.${styles.switch}`)).to.exist;
  });
});
