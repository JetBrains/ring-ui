/* @flow */
/* eslint-disable react/jsx-no-literals */

import React, {PureComponent} from 'react';
import {render} from 'react-dom';
import Link from '../link/link';
import Badge from '../badge/badge';
import DataList from './data-list';

const mock = [
  {
    id: 1,
    title: <span><strong>Assigner</strong> in 60 projects</span>,
    size: 62,
    items: [
      {
        id: 1,
        collapsed: true,
        title: '6 projects: as a member of jetbrains-team'
      }
    ]
  },

  {
    id: 2,
    title: <span><strong>Code Reviewer</strong> in 5 projects</span>,
    size: 5,
    items: [
      {
        id: 1,
        selectable: true,
        title: (
          <span>
            <Link href="#">JetProfile</Link>
            <span> </span>
            <Badge gray={true}>duplicate</Badge>
          </span>
        )
      },

      {
        id: 3,
        title: (
          <span>
            <Link href="#">CustomJDK</Link>
            <span>: as a member of ide-developers</span>
          </span>
        )
      }
    ]
  },

  {
    id: 3,
    title: <span><strong>Code Viewer</strong> in 5 projects</span>,
    size: 5,
    items: [
      {
        id: 1,
        title: (
          <span>
            <Link href="#">ide-frontend</Link>
            <span>: as a member of ide-developers</span>
          </span>
        )
      },

      {
        id: 2,
        title: (
          <span>
            <Link href="#">ide-frontend</Link>
            <span>: as a member of ide-frontend Code Viewers</span>
          </span>
        )
      }
    ]
  },

  {
    id: 4,
    title: <span><strong>Commenter</strong> in 12 projects</span>,
    size: 12,
    items: [
      {
        id: 1,
        title: (
          <span>
            <Link href="#">Intellij IDEA</Link>
            <span>: as a member of Registered Users</span>
          </span>
        )
      },

      {
        id: 2,
        title: (
          <span>
            <Link href="#">YouTrack Backlog</Link>
            <span>: as a member of jetbrains-team</span>
          </span>
        )
      }
    ]
  },

  {
    id: 5,
    title: (
      <span>
        <strong>Developer</strong>
        <span> in 57 projects </span>
        <Badge>team role</Badge>
      </span>
    ),
    size: 12,
    items: [
      {
        id: 1,
        selectable: true,
        title: <Link href="#">Wasabi</Link>
      }
    ]
  },

  {
    id: 6,
    title: (
      <span>
        <strong>Git Hosting Admin</strong>
        <span> in project </span>
        <Link href="#">Hackathon 2016</Link>
        <span>: as a member of jetbrains-team</span>
      </span>
    ),
    size: 12,
    items: []
  },

  {
    id: 7,
    title: <span><strong>Git Hosting Checkout</strong> in 7 projects</span>,
    size: 12,
    items: []
  }
];

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
