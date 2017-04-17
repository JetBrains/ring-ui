import 'file-loader?name=favicon.ico!jetbrains-logos/hub/favicon.ico';
import 'whatwg-fetch';
import 'dom4';

import React from 'react';
import {render} from 'react-dom';

import ContentLayout, {Sidebar} from '../components/content-layout/content-layout';

import {fetchData, fetchNavData} from './utils';
import Header from './components/header';
import Nav from './components/nav';
import Content from './components/content';
import styles from './index.css';

const jsonURL = document.querySelector('body').getAttribute('data-json-url');
const promises = [fetchData(jsonURL), fetchNavData()];

Promise.all(promises).then(([source, navData]) => {
  const {version} = navData;

  const docs = navData.categories.find(({name}) => name === 'Docs');
  const docsItems = docs.items;
  const categories = navData.categories.filter(category => category !== docs);


  const App = () => (
    <div className={styles.app}>
      <Header {...{version, docsItems}}/>
      <ContentLayout className={styles.main}>
        <Sidebar>
          <Nav {...{categories}} />
        </Sidebar>
        <Content {...source} />
      </ContentLayout>
    </div>
  );

  render(
    <App />,
    document.query('#app')
  );
});
