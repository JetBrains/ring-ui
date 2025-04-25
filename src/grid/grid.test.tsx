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
    expect(screen.getByTestId('ring-grid')).to.exist;
  });

  it('should wrap children with div', () => {
    renderGrid();
    expect(screen.getByTestId('ring-grid')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    renderGrid({className: 'test-class'});
    expect(screen.getByTestId('ring-grid')).to.have.class('test-class');
  });
});

describe('Row', () => {
  const renderRow = (props?: RowProps) => render(<Row {...props} />);

  it('should create component', () => {
    renderRow();
    expect(screen.getByTestId('ring-grid-row')).to.exist;
  });

  it('should wrap children with div', () => {
    renderRow();
    expect(screen.getByTestId('ring-grid-row')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    renderRow({className: 'test-class'});
    expect(screen.getByTestId('ring-grid-row')).to.have.class('test-class');
  });

  it('should convert "center" modifier to appropriate className', () => {
    renderRow({center: 'md'});
    expect(screen.getByTestId('ring-grid-row')).to.have.class(styles['center-md']);
  });

  it('should convert "reverse" modifier to appropriate className', () => {
    renderRow({reverse: true});
    expect(screen.getByTestId('ring-grid-row')).to.have.class(styles.reverse);
  });
});

describe('Col', () => {
  const renderCol = (props?: ColProps) => render(<Col {...props} />);

  it('should create component', () => {
    renderCol();
    expect(screen.getByTestId('ring-grid-column')).to.exist;
  });

  it('should wrap children with div', () => {
    renderCol();
    expect(screen.getByTestId('ring-grid-column')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    renderCol({className: 'test-class'});
    expect(screen.getByTestId('ring-grid-column')).to.have.class('test-class');
  });

  it('should convert digital value to appropriate className', () => {
    renderCol({xs: 2});
    expect(screen.getByTestId('ring-grid-column')).to.have.class(styles['col-xs-2']);
  });

  it('should convert autosize to appropriate className', () => {
    renderCol({xs: true});
    expect(screen.getByTestId('ring-grid-column')).to.have.class(styles['col-xs']);
  });
});
