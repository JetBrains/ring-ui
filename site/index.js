import './index.scss';
import 'github-markdown-css/github-markdown.css';
import 'file-loader?name=favicon.ico!jetbrains-logos/hub/favicon.ico';

import 'dom4';
import React from 'react';
import {render} from 'react-dom';

// import ContentLayout, {Sidebar} from 'ring-ui/components/content-layout/content-layout';

import Header from './components/header';
import Nav from './components/nav';
import Content from './components/content';

const {source, categories} = window;

const App = () => (
  <div>
    <Header />
    <div className="app__main">
      <Nav
        version={source.package.version}
        categories={categories}
      />
      <Content {...source}/>
    </div>
  </div>
);

render(
  <App />,
  document.query('.app')
);
