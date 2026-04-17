import {render, screen} from '@testing-library/react';

import {Col, Grid, Row, type GridProps} from './grid';
import {type RowProps} from './row';
import {type ColProps} from './col';

import styles from './grid.css';

describe('Grid', () => {
  const renderGrid = (props?: GridProps) => render(<Grid {...props} />);

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

  it('should merge external data-test with default', () => {
    renderGrid({'data-test': 'my-grid'});
    expect(screen.getByTestId('ring-grid my-grid')).to.exist;
  });

  it('should pass DOM props to div', () => {
    renderGrid({id: 'grid-id'});
    expect(screen.getByTestId('ring-grid')).to.have.attr('id', 'grid-id');
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

  it('should merge external data-test with default', () => {
    renderRow({'data-test': 'my-row'});
    expect(screen.getByTestId('ring-grid-row my-row')).to.exist;
  });

  it('should pass DOM props to div', () => {
    renderRow({id: 'row-id'});
    expect(screen.getByTestId('ring-grid-row')).to.have.attr('id', 'row-id');
  });

  it('should not pass row-specific props to DOM', () => {
    renderRow({center: 'md', start: 'lg'});
    const el = screen.getByTestId('ring-grid-row');
    expect(el).to.not.have.attr('center');
    expect(el).to.not.have.attr('start');
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

  it('should only add classes for provided size props', () => {
    renderCol({xs: 2});
    const el = screen.getByTestId('ring-grid-column');
    expect(el).to.have.class(styles['col-xs-2']);
    expect(el).to.not.have.class(styles['col-sm']);
    expect(el).to.not.have.class(styles['col-md']);
    expect(el).to.not.have.class(styles['col-lg']);
  });

  it('should not add any size classes when no size props are provided', () => {
    renderCol();
    const el = screen.getByTestId('ring-grid-column');
    expect(el).to.not.have.class(styles['col-xs']);
    expect(el).to.not.have.class(styles['col-sm']);
    expect(el).to.not.have.class(styles['col-md']);
    expect(el).to.not.have.class(styles['col-lg']);
  });

  it('should merge external data-test with default', () => {
    renderCol({'data-test': 'my-col'});
    expect(screen.getByTestId('ring-grid-column my-col')).to.exist;
  });

  it('should pass DOM props to div', () => {
    renderCol({id: 'col-id'});
    expect(screen.getByTestId('ring-grid-column')).to.have.attr('id', 'col-id');
  });

  it('should not pass col-specific props to DOM', () => {
    renderCol({xs: 2, xsOffset: 1});
    const el = screen.getByTestId('ring-grid-column');
    expect(el).to.not.have.attr('xs');
    expect(el).to.not.have.attr('xsOffset');
  });
});
