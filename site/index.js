import styles from './index.css';
import 'github-markdown-css/github-markdown.css';
import 'file-loader?name=favicon.ico!jetbrains-logos/hub/favicon.ico';

import 'dom4';
import React from 'react';
import {render} from 'react-dom';

import ContentLayout, {Sidebar} from 'ring-ui/components/content-layout/content-layout';

import Header from './components/header';
import Nav from './components/nav';
import Content from './components/content';

const {nav, content} = window;

const App = () => (
  <div className={styles.app}>
    <Header />
    <ContentLayout className={styles.main}>
      <Sidebar>
        <Nav {...nav} />
      </Sidebar>
      <Content {...content} />
    </ContentLayout>
  </div>
);

render(
  <App />,
  document.query('#app')
);
