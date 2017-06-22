import React from 'react';
import {shallow, mount} from 'enzyme';

import ContentLayout from './content-layout';
import Sidebar from './sidebar';
import styles from './content-layout.css';

describe('Content Layout', () => {
  const shallowContentLayout = params => shallow(<ContentLayout {...params}/>);
  const mountContentLayout = params => mount(<ContentLayout {...params}/>);

  it('should create component', () => {
    mountContentLayout().should.have.type(ContentLayout);
  });

  it('should wrap children with div', () => {
    shallowContentLayout().should.have.type('div');
  });

  it('should use passed className', () => {
    shallowContentLayout({className: 'test-class'}).should.have.className('test-class');
  });

  it('should render sidebar', () => {
    const component = mount(<ContentLayout>
      <Sidebar>{'In sidebar'}</Sidebar>
      <div>{'Foo'}</div>
    </ContentLayout>);

    component.should.have.descendants(`div.${styles.sidebar}`);
  });

  it('should render sidebar on the right', () => {
    const component = mount(<ContentLayout>
      <Sidebar right={true}>{'In sidebar'}</Sidebar>
      <div>{'Foo'}</div>
    </ContentLayout>);

    component.should.have.descendants(`div.${styles.sidebarRight}`);
  });
});
