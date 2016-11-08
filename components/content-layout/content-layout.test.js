import 'dom4';
import React from 'react';
import {renderIntoDocument, isCompositeComponentWithType} from 'react-addons-test-utils';

import ContentLayout from './content-layout';
import Sidebar from './sidebar';
import styles from './content-layout.css';

describe('Content Layout', () => {
  const renderComponent = params => renderIntoDocument(ContentLayout.factory(params));

  it('should create component', () => {
    isCompositeComponentWithType(renderComponent(), ContentLayout).should.be.true;
  });

  it('should wrap children with div', () => {
    renderComponent().node.should.match('div');
  });

  it('should use passed className', () => {
    renderComponent({className: 'test-class'}).node.should.match('.test-class');
  });

  it('should render sidebar', () => {
    const component = renderIntoDocument(<ContentLayout>
      <Sidebar>{'In sidebar'}</Sidebar>
      <div>{'Foo'}</div>
    </ContentLayout>);

    component.node.should.contain(`div.${styles.sidebar}`);
  });

  it('should render sidebar on the right', () => {
    const component = renderIntoDocument(<ContentLayout>
      <Sidebar right={true}>{'In sidebar'}</Sidebar>
      <div>{'Foo'}</div>
    </ContentLayout>);

    component.node.should.contain(`div.${styles.sidebarRight}`);
  });
});
