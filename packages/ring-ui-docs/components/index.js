import 'whatwg-fetch';
import 'dom4';

import React, {Component} from 'react';
import {render} from 'react-dom';
import iFrameResize from 'iframe-resizer/js/iframeResizer';
import ContentLayout, {
  Sidebar
} from 'ring-ui/components/content-layout/content-layout';

import {fetchData, fetchNavData} from './utils';
import Header from './header';
import Nav from './nav';
import Content from './content';
import styles from './index.css';

const jsonURL = document.querySelector('body').getAttribute('data-json-url');
const promises = [fetchData(jsonURL), fetchNavData()];

Promise.all(promises).then(([source, navData]) => {
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
          <Header {...{version, docsItems}}/>
          <ContentLayout className={styles.main}>
            <Sidebar>
              <Nav {...{categories}}/>
            </Sidebar>
            <Content {...source}/>
          </ContentLayout>
        </div>
      );
    }
  }

  render(
    <App/>,
    document.query('#app')
  );
});
