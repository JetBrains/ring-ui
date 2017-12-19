import 'whatwg-fetch';
import 'dom4';

import React, {Component} from 'react';
import {render} from 'react-dom';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import ContentLayout, {
  Sidebar
} from '@jetbrains/ring-ui/components/content-layout/content-layout';

import Header from './header';
import Footer from './footer';
import Nav from './nav';
import Content from './content';
import {getDocs, getIndexDoc} from './utils';
import styles from './index.css';

const {source, navData, version} = window;

const docs = getDocs();
const docsItems = docs.items;
const categories = navData.filter(category => category !== docs);

class App extends Component {
  componentDidMount() {
    const iFrameSelector = 'iframe[data-resize="enabled"]';
    this.iframesToResize = document.querySelectorAll(iFrameSelector).length;

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
          version={version}
          docsItems={docsItems}
          noAuth={window.location.hostname === 'teamcity.jetbrains.com'}
        />
        <ContentLayout className={styles.main} responsive={false}>
          <Sidebar
            className={styles.sidebar}
            fixedClassName={styles.sidebarFixed}
          >
            <Nav categories={categories}/>
          </Sidebar>
          <Content {...source}/>
          <Footer/>
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
    document.querySelector('#app')
  );
}
