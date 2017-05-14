/* @flow */

import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import DataList from './data-list';

import mock from './data-list.mock';

class DataListDemo extends PureComponent {
  state = {
  };

  render() {
    return (
      <DataList data={mock}/>
    );
  }
}

const container = document.getElementById('data-list');
render(<DataListDemo />, container);
