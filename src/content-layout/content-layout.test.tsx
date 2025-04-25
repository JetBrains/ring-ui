import {render, screen} from '@testing-library/react';

import ContentLayout from './content-layout';
import Sidebar from './sidebar';
import styles from './content-layout.css';

describe('Content Layout', () => {
  it('should create component', () => {
    render(<ContentLayout />);
    expect(screen.getByTestId('content-layout')).to.exist;
  });

  it('should wrap children with div', () => {
    render(<ContentLayout />);
    expect(screen.getByTestId('content-layout')).to.have.tagName('div');
  });

  it('should use passed className', () => {
    render(<ContentLayout className="test-class" />);
    expect(screen.getByTestId('content-layout')).to.have.class('test-class');
  });

  it('should render sidebar', () => {
    render(
      <ContentLayout>
        <Sidebar>{'In sidebar'}</Sidebar>
        <div>{'Foo'}</div>
      </ContentLayout>,
    );

    expect(screen.getByRole('complementary')).to.exist;
  });

  it('should render sidebar on the right', () => {
    render(
      <ContentLayout>
        <Sidebar right>{'In sidebar'}</Sidebar>
        <div>{'Foo'}</div>
      </ContentLayout>,
    );

    expect(screen.getByRole('complementary')).to.have.descendants(`div.${styles.sidebarRight}`);
  });
});
