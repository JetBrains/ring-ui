import {render, screen} from '@testing-library/react';

import Breadcrumbs, {type BreadcrumbsProps} from './breadcrumbs';

import styles from './breadcrumbs.css';

describe('Breadcrumbs', () => {
  const renderBreadcrumbs = (props?: Partial<BreadcrumbsProps>) => {
    render(
      <Breadcrumbs {...props}>
        <span data-test='child-1'>{'First'}</span>
        <span data-test='child-2'>{'Second'}</span>
        <span data-test='child-3'>{'Third'}</span>
      </Breadcrumbs>,
    );
  };

  it('should render all children', () => {
    renderBreadcrumbs();
    expect(screen.getByTestId('child-1')).to.exist;
    expect(screen.getByTestId('child-2')).to.exist;
    expect(screen.getByTestId('child-3')).to.exist;
  });

  it('should render separators between children', () => {
    const {container} = render(
      <Breadcrumbs>
        <span>{'First'}</span>
        <span>{'Second'}</span>
      </Breadcrumbs>,
    );
    const separators = container.querySelectorAll(`.${styles.separator}`);
    expect(separators).to.have.length(1);
  });

  it('should not render separator before first child', () => {
    const {container} = render(
      <Breadcrumbs>
        <span>{'First'}</span>
      </Breadcrumbs>,
    );
    const separators = container.querySelectorAll(`.${styles.separator}`);
    expect(separators).to.have.length(0);
  });

  it('should use custom separator class name', () => {
    const {container} = render(
      <Breadcrumbs separatorClassName='custom-separator'>
        <span>{'First'}</span>
        <span>{'Second'}</span>
      </Breadcrumbs>,
    );
    expect(container.querySelector('.custom-separator')).to.exist;
  });
});
