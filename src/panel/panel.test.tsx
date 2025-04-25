import {render, screen} from '@testing-library/react';

import Panel from './panel';

describe('Panel', () => {
  it('should create component', () => {
    render(<Panel />);
    expect(screen.getByTestId('ring-panel')).to.exist;
  });

  it('should use provided className', () => {
    render(<Panel className="custom-class" />);
    expect(screen.getByTestId('ring-panel')).to.have.class('custom-class');
  });

  it('should render children', () => {
    render(<Panel>{'text'}</Panel>);
    expect(screen.getByText('text')).to.exist;
  });
});
