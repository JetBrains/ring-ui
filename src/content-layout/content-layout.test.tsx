import {render, screen} from '@testing-library/react';

import ContentLayout from './content-layout';
import Sidebar from './sidebar';
import styles from './content-layout.css';

describe('Content Layout', () => {
  it('should create component', () => {
    render(<ContentLayout/>);
    screen.getByTestId('content-layout').should.exist;
  });

  it('should wrap children with div', () => {
    render(<ContentLayout/>);
    screen.getByTestId('content-layout').should.have.tagName('div');
  });

  it('should use passed className', () => {
    render(<ContentLayout className="test-class"/>);
    screen.getByTestId('content-layout').should.have.class('test-class');
  });

  it('should render sidebar', () => {
    render(<ContentLayout>
      <Sidebar>{'In sidebar'}</Sidebar>
      <div>{'Foo'}</div>
    </ContentLayout>);

    screen.getByRole('complementary').should.exist;
  });

  it('should render sidebar on the right', () => {
    render(<ContentLayout>
      <Sidebar right>{'In sidebar'}</Sidebar>
      <div>{'Foo'}</div>
    </ContentLayout>);

    screen.getByRole('complementary').should.have.descendants(`div.${styles.sidebarRight}`);
  });
});
