import {type HTMLAttributes} from 'react';
import {render, screen} from '@testing-library/react';

import {Col, Grid, Row} from './grid';
import {type RowProps} from './row';
import {type ColProps} from './col';

import styles from './grid.css';

describe('Grid', () => {
  const renderGrid = (props?: HTMLAttributes<HTMLDivElement>) => render(<Grid {...props} />);

  it('should use passed className', () => {
    renderGrid({className: 'test-class'});
    expect(screen.getByTestId('ring-grid')).to.have.class('test-class');
  });

  it('should render children', () => {
    render(
      <Grid>
        <div data-test='child-content'>{'Test Content'}</div>
      </Grid>,
    );
    expect(screen.getByTestId('child-content')).to.exist;
  });

  it('should always apply container-fluid class', () => {
    renderGrid();
    expect(screen.getByTestId('ring-grid')).to.have.class(styles['container-fluid']);
  });

  it('should pass through restProps', () => {
    renderGrid({id: 'custom-id', role: 'main', 'aria-label': 'test-grid'});
    const grid = screen.getByTestId('ring-grid');
    expect(grid).to.have.attribute('id', 'custom-id');
    expect(grid).to.have.attribute('role', 'main');
    expect(grid).to.have.attribute('aria-label', 'test-grid');
  });
});

describe('Row', () => {
  const renderRow = (props?: RowProps) => render(<Row {...props} />);

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

  it('should handle all size modifiers', () => {
    renderCol({xs: 1, sm: 2, md: 3, lg: 4});
    const col = screen.getByTestId('ring-grid-column');
    expect(col).to.have.class(styles['col-xs-1']);
    expect(col).to.have.class(styles['col-sm-2']);
    expect(col).to.have.class(styles['col-md-3']);
    expect(col).to.have.class(styles['col-lg-4']);
  });

  it('should handle all offset modifiers', () => {
    renderCol({xsOffset: 1, smOffset: 2, mdOffset: 3, lgOffset: 4});
    const col = screen.getByTestId('ring-grid-column');
    expect(col).to.have.class(styles['col-xs-offset-1']);
    expect(col).to.have.class(styles['col-sm-offset-2']);
    expect(col).to.have.class(styles['col-md-offset-3']);
    expect(col).to.have.class(styles['col-lg-offset-4']);
  });

  it('should handle reverse prop', () => {
    renderCol({reverse: true});
    expect(screen.getByTestId('ring-grid-column')).to.have.class(styles.reverse);
  });

  it('should handle combination of size and offset', () => {
    renderCol({xs: 6, xsOffset: 3});
    const col = screen.getByTestId('ring-grid-column');
    expect(col).to.have.class(styles['col-xs-6']);
    expect(col).to.have.class(styles['col-xs-offset-3']);
  });

  it('should handle null/undefined values', () => {
    renderCol({xs: null, sm: undefined, className: null});
    expect(screen.getByTestId('ring-grid-column')).to.exist;
  });
});
