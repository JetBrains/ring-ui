import styles from './index.css';
import 'github-markdown-css/github-markdown.css';
import 'file-loader?name=favicon.ico!jetbrains-logos/hub/favicon.ico';
import 'whatwg-fetch';

import 'dom4';
import React from 'react';
import {render} from 'react-dom';

import ContentLayout, {Sidebar} from 'ring-ui/components/content-layout/content-layout';
import currentPath from './currentPath';

import Header from './components/header';
import Nav from './components/nav';
import Content from './components/content';

const url = currentPath();

fetch('data.json').
  then(response => response.json()).
  then(data => {
    const nav = {
      categories: data.sourcesByCategory,
      version: data.version,
      url
    };
    const source = data.sources.find(s => s.url === url);

    const App = () => (
      <div className={styles.app}>
        <Header />
        <ContentLayout className={styles.main}>
          <Sidebar>
            <Nav {...nav} />
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
