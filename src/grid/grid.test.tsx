import {HTMLAttributes} from 'react';

import {render, screen} from '@testing-library/react';

import styles from './grid.css';
import {Col, Grid, Row} from './grid';
import {RowProps} from './row';
import {ColProps} from './col';

describe('Grid', () => {
  const renderGrid = (props?: HTMLAttributes<HTMLDivElement>) => render(<Grid {...props} />);

  it('should create component', () => {
    renderGrid();
    screen.getByTestId('ring-grid').should.exist;
  });

  it('should wrap children with div', () => {
    renderGrid();
    screen.getByTestId('ring-grid').should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderGrid({className: 'test-class'});
    screen.getByTestId('ring-grid').should.have.class('test-class');
  });
});

describe('Row', () => {
  const renderRow = (props?: RowProps) => render(<Row {...props} />);

  it('should create component', () => {
    renderRow();
    screen.getByTestId('ring-grid-row').should.exist;
  });

  it('should wrap children with div', () => {
    renderRow();
    screen.getByTestId('ring-grid-row').should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderRow({className: 'test-class'});
    screen.getByTestId('ring-grid-row').should.have.class('test-class');
  });

  it('should convert "center" modifier to appropriate className', () => {
    renderRow({center: 'md'});
    screen.getByTestId('ring-grid-row').should.have.class(styles['center-md']);
  });

  it('should convert "reverse" modifier to appropriate className', () => {
    renderRow({reverse: true});
    screen.getByTestId('ring-grid-row').should.have.class(styles.reverse);
  });
});

describe('Col', () => {
  const renderCol = (props?: ColProps) => render(<Col {...props} />);

  it('should create component', () => {
    renderCol();
    screen.getByTestId('ring-grid-column').should.exist;
  });

  it('should wrap children with div', () => {
    renderCol();
    screen.getByTestId('ring-grid-column').should.have.tagName('div');
  });

  it('should use passed className', () => {
    renderCol({className: 'test-class'});
    screen.getByTestId('ring-grid-column').should.have.class('test-class');
  });

  it('should convert digital value to appropriate className', () => {
    renderCol({xs: 2});
    screen.getByTestId('ring-grid-column').should.have.class(styles['col-xs-2']);
  });

  it('should convert autosize to appropriate className', () => {
    renderCol({xs: true});
    screen.getByTestId('ring-grid-column').should.have.class(styles['col-xs']);
  });
});
