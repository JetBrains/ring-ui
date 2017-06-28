/* @flow */
/* eslint-disable react/jsx-no-literals */
/* eslint-disable react/self-closing-comp */
import React from 'react';

import Link from '../link/link';
import Badge from '../badge/badge';

export default [
  {
    type: 'group',
    id: 1,
    title: <span><strong>Assigner</strong> in 60 projects</span>,
    size: 62,
    selectable: true,
    items: [
      {
        type: 'item',
        id: 1,
        collapsed: true,
        title: '6 projects: as a member of jetbrains-team',
        subitems: [
          {
            id: 1,
            title: <Link href="#">TeamCity</Link>
          },

          {
            id: 2,
            title: <Link href="#">YouTrack</Link>
          },

          {
            id: 3,
            title: <Link href="#">Sandbox</Link>
          },

          {
            id: 4,
            title: <Link href="#">Exception Analyzer</Link>
          },

          {
            id: 5,
            title: <Link href="#">MPS</Link>
          }
        ]
      }
    ]
  },

  {
    type: 'group',
    id: 2,
    title: <span><strong>Code Reviewer</strong> in 5 projects</span>,
    size: 5,
    selectable: true,
    items: [
      {
        type: 'item',
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
        type: 'item',
        id: 2,
        collapsed: true,
        title: '6 projects: as a member of jetbrains-team',
        subitems: [
          {
            id: 1,
            title: <Link href="#">TeamCity</Link>
          },

          {
            id: 2,
            title: <Link href="#">YouTrack</Link>
          },

          {
            id: 3,
            title: <Link href="#">Sandbox</Link>
          },

          {
            id: 4,
            title: <Link href="#">Exception Analyzer</Link>
          },

          {
            id: 5,
            title: <Link href="#">MPS</Link>
          }
        ]
      },

      {
        type: 'item',
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
    type: 'group',
    id: 3,
    title: <span><strong>Code Viewer</strong> in 5 projects</span>,
    size: 5,
    selectable: true,
    items: [
      {
        type: 'item',
        id: 1,
        title: (
          <span>
            <Link href="#">ide-frontend</Link>
            <span>: as a member of ide-developers</span>
          </span>
        )
      },

      {
        type: 'item',
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
    type: 'group',
    id: 4,
    title: <span><strong>Commenter</strong> in 12 projects</span>,
    size: 12,
    items: [
      {
        type: 'item',
        id: 1,
        title: (
          <span>
            <Link href="#">Intellij IDEA</Link>
            <span>: as a member of Registered Users</span>
          </span>
        )
      },

      {
        type: 'item',
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
    type: 'group',
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
        type: 'item',
        id: 1,
        selectable: true,
        title: <Link href="#">Wasabi</Link>
      }
    ]
  },

  {
    type: 'group',
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
    type: 'group',
    id: 7,
    title: <span><strong>Git Hosting Checkout</strong> in 7 projects</span>,
    size: 12,
    selectable: true,
    items: []
  }
];
