/* eslint-disable react/jsx-no-literals */
import {ReactNode} from 'react';

import Link from '../link/link';
import Tag from '../tag/tag';
import {SelectionItem} from '../table/selection';

export interface Item extends SelectionItem {
  title: ReactNode;
  collapsible?: boolean;
  selectable?: boolean;
  items?: Item[];
}

const items: Item[] = [
  {
    id: 1,
    title: (
      <span>
        <strong>Assigner</strong> in 60 projects
      </span>
    ),
    collapsible: true,
    selectable: true,
    items: [
      {
        id: 11,
        title: '6 projects: as a member of jetbrains-team',
        collapsible: true,
        selectable: true,
        items: [
          {
            id: 111,
            selectable: true,
            title: <Link href="#">TeamCity</Link>,
          },

          {
            id: 112,
            selectable: true,
            title: <Link href="#">YouTrack</Link>,
          },

          {
            id: 113,
            selectable: true,
            title: <Link href="#">Sandbox</Link>,
          },

          {
            id: 114,
            selectable: true,
            title: <Link href="#">Exception Analyzer</Link>,
          },

          {
            id: 115,
            selectable: true,
            title: <Link href="#">MPS</Link>,
          },
        ],
      },
    ],
  },

  {
    id: 2,
    title: (
      <span>
        <strong>Code Reviewer</strong> in 5 projects
      </span>
    ),
    selectable: true,
    collapsible: true,
    items: [
      {
        id: 21,
        selectable: true,
        title: (
          <span>
            <Link href="#">JetProfile</Link>
            <span> </span>
            <Tag>duplicate</Tag>
          </span>
        ),
      },

      {
        id: 22,
        title: '6 projects: as a member of jetbrains-team',
        collapsible: true,
        items: [
          {
            id: 221,
            collapsible: true,
            title: <Link href="#">TeamCity</Link>,
          },

          {
            id: 222,
            collapsible: true,
            title: <Link href="#">YouTrack</Link>,
          },

          {
            id: 223,
            collapsible: true,
            title: <Link href="#">Sandbox</Link>,
          },

          {
            id: 224,
            collapsible: true,
            title: <Link href="#">Exception Analyzer</Link>,
          },

          {
            id: 225,
            collapsible: true,
            title: <Link href="#">MPS</Link>,
          },
        ],
      },

      {
        id: 23,
        collapsible: true,
        title: (
          <span>
            <Link href="#">CustomJDK</Link>
            <span>: as a member of ide-developers</span>
          </span>
        ),
      },
    ],
  },

  {
    id: 3,
    title: (
      <span>
        <strong>Code Viewer</strong> in 5 projects
      </span>
    ),
    selectable: true,
    collapsible: true,
    items: [
      {
        id: 31,
        collapsible: true,
        title: (
          <span>
            <Link href="#">ide-frontend</Link>
            <span>: as a member of ide-developers</span>
          </span>
        ),
      },

      {
        id: 32,
        collapsible: true,
        title: (
          <span>
            <Link href="#">ide-frontend</Link>
            <span>: as a member of ide-frontend Code Viewers</span>
          </span>
        ),
      },
    ],
  },

  {
    id: 4,
    title: (
      <span>
        <strong>Commenter</strong> in 12 projects
      </span>
    ),
    collapsible: true,
    items: [
      {
        id: 41,
        collapsible: true,
        title: (
          <span>
            <Link href="#">Intellij IDEA</Link>
            <span>: as a member of Registered Users</span>
          </span>
        ),
      },

      {
        id: 42,
        collapsible: true,
        title: (
          <span>
            <Link href="#">YouTrack Backlog</Link>
            <span>: as a member of jetbrains-team</span>
          </span>
        ),
      },
    ],
  },

  {
    id: 5,
    collapsible: true,
    title: (
      <span>
        <strong>Developer</strong>
        <span> in 57 projects </span>
        <Tag>team role</Tag>
      </span>
    ),
    items: [
      {
        id: 51,
        selectable: true,
        collapsible: true,
        title: <Link href="#">Wasabi</Link>,
      },
    ],
  },

  {
    id: 6,
    collapsible: true,
    title: (
      <span>
        <strong>Git Hosting Admin</strong>
        <span> in project </span>
        <Link href="#">Hackathon 2016</Link>
        <span>: as a member of jetbrains-team</span>
      </span>
    ),
  },

  {
    id: 7,
    title: (
      <span>
        <strong>Git Hosting Checkout</strong> in 7 projects
      </span>
    ),
    selectable: true,
    collapsible: true,
  },
];

export const moreItems = [
  {
    id: 91,
    selectable: true,
    collapsible: true,
    title: (
      <span>
        <Link href="#">More item 1</Link>
        <span> </span>
        <Tag>duplicate</Tag>
      </span>
    ),
  },

  {
    id: 92,
    selectable: true,
    collapsible: true,
    title: (
      <span>
        <Link href="#">More item 2</Link>
        <span> </span>
        <Tag>duplicate</Tag>
      </span>
    ),
  },
];
export default items;
