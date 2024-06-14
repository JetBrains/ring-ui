import {HTMLAttributes} from 'react';
import {shallow, mount} from 'enzyme';

import styles from './grid.css';
import {Col, Grid, Row} from './grid';
import {RowProps} from './row';
import {ColProps} from './col';

describe('Grid', () => {
  const shallowGrid = (props?: HTMLAttributes<HTMLDivElement>) => shallow(<Grid {...props}/>);
  const mountGrid = (props?: HTMLAttributes<HTMLDivElement>) => mount(<Grid {...props}/>);

  it('should create component', () => {
    mountGrid().should.have.type(Grid);
  });

  it('should wrap children with div', () => {
    shallowGrid().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowGrid({className: 'test-class'}).should.have.className('test-class');
  });
});

describe('Row', () => {
  const shallowRow = (props?: RowProps) => shallow(<Row {...props}/>);
  const mountRow = (props?: RowProps) => mount(<Row {...props}/>);

  it('should create component', () => {
    mountRow().should.have.type(Row);
  });

  it('should wrap children with div', () => {
    shallowRow().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowRow({className: 'test-class'}).should.have.className('test-class');
  });

  it('should convert "center" modifier to appropriate className', () => {
    shallowRow({center: 'md'}).should.have.className(styles['center-md']);
  });

  it('should convert "reverse" modifier to appropriate className', () => {
    shallowRow({reverse: true}).should.have.className(styles.reverse);
  });
});

describe('Col', () => {
  const shallowCol = (props?: ColProps) => shallow(<Col {...props}/>);
  const mountCol = (props?: ColProps) => mount(<Col {...props}/>);

  it('should create component', () => {
    mountCol().should.have.type(Col);
  });

  it('should wrap children with div', () => {
    shallowCol().should.have.tagName('div');
  });

  it('should use passed className', () => {
    shallowCol({className: 'test-class'}).should.have.className('test-class');
  });

  it('should convert digital value to appropriate className', () => {
    shallowCol({xs: 2}).should.have.className(styles['col-xs-2']);
  });

  it('should convert autosize to appropriate className', () => {
    shallowCol({xs: true}).should.have.className(styles['col-xs']);
  });
});
