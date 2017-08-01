import 'whatwg-fetch';
import 'dom4';

import React, {Component} from 'react';
import {render} from 'react-dom';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import ContentLayout, {
  Sidebar
} from 'ring-ui/components/content-layout/content-layout';

import Header from './header';
import Nav from './nav';
import Content from './content';
import {getIndexDoc} from './utils';
import styles from './index.css';

const {source, navData} = window;
const {version} = navData;

const docs = navData.categories.find(({name}) => name === 'Docs');
const docsItems = docs.items;
const categories = navData.categories.filter(category => category !== docs);

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
          version={version}
          docsItems={docsItems}
          noAuth={window.frameElement != null}
        />
        <ContentLayout className={styles.main}>
          <Sidebar>
            <Nav categories={categories}/>
          </Sidebar>
          <Content {...source}/>
        </ContentLayout>
      </div>
    );
  }
}

const {pathname} = window.location;
const indexDoc = getIndexDoc(docsItems);

if (pathname === '/' && indexDoc) {
  window.location.replace(indexDoc);
} else {
  render(
    <App/>,
    document.query('#app')
  );
}
