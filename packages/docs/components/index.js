import 'whatwg-fetch';
import 'dom4';

import React, {Component} from 'react';
import {render} from 'react-dom';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import ContentLayout, {
  Sidebar
} from '@jetbrains/ring-ui/components/content-layout/content-layout';

import Header from './header';
import SideFooter from './side-footer';
import Nav from './nav';
import Content from './content';
import {getIndexDoc} from './utils';
import styles from './index.css';

const {source, navData, version} = window;

class App extends Component {
  componentDidMount() {
    const iFrameSelector = 'iframe[data-resize="enabled"]';
    this.iframesToResize = document.queryAll(iFrameSelector).length;

    this.retriggerHashNavigation();
    iFrameResize({
      resizedCallback: () => {
        this.iframesToResize--;
        this.retriggerHashNavigation();
      }
    }, iFrameSelector);
  }

  retriggerHashNavigation() {
    if (this.iframesToResize > 0) {
      return;
    }

    const {hash} = window.location;
    if (hash) {
      window.location.replace(hash);
    }
  }

  render() {
    return (
      <div className={styles.app}>
        <Header
          categories={navData}
          version={version}
        />
        <ContentLayout className={styles.main} responsive={false}>
          <Sidebar
            className={styles.sidebar}
            fixedClassName={styles.sidebarFixed}
          >
            <Nav categories={navData}/>
            <SideFooter/>
          </Sidebar>
          <Content {...source}/>
        </ContentLayout>
      </div>
    );
  }
}

const {pathname} = window.location;
const indexDoc = getIndexDoc();

if (!/\.html$/.test(pathname) && indexDoc) {
  const {hash} = window.location;
  window.location.replace(indexDoc + hash);
} else {
  render(
    <App/>,
    document.query('#app')
  );
}
