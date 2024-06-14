import {render, screen} from '@testing-library/react';

import ButtonGroup from './button-group';

describe('Button Group', () => {
  it('should create component', () => {
    render(<ButtonGroup/>);
    screen.getByTestId('ring-button-group').should.exist;
  });
});
