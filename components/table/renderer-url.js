import React from 'react';
import DefaultRenderer from './renderer-default';
import Cell from './cell';
import Link from '../link/link';

export default class URLRenderer extends DefaultRenderer {
  render() {
    const {item, column} = this.props;
    const value = item[column.id];

    let url;
    let title;

    if (value.url && value.title) {
      url = value.url;
      title = value.title;
    } else if (value.url) {
      url = title = value.url;
    } else {
      url = title = value;
    }

    return <Cell><Link href={url}>{title}</Link></Cell>;
  }
}
