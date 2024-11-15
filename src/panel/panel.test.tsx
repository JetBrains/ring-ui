import {render, screen} from '@testing-library/react';

import Panel from './panel';

describe('Panel', () => {
  it('should create component', () => {
    render(<Panel />);
    screen.getByTestId('ring-panel').should.exist;
  });

  it('should use provided className', () => {
    render(<Panel className="custom-class" />);
    screen.getByTestId('ring-panel').should.have.class('custom-class');
  });

  it('should render children', () => {
    render(<Panel>{'text'}</Panel>);
    screen.getByText('text').should.exist;
  });
});
