import React from 'react';
import Footer from '@jetbrains/ring-ui/components/footer/footer';

const data = [
  [
    {copyright: 2000, label: ' JetBrains'},
    ' · All rights reserved'
  ],
  {
    url: 'https://raw.githubusercontent.com/JetBrains/ring-ui/master/LICENSE.txt',
    label: 'License agreement',
    title: 'read me!'
  }
];

const SiteFooter = () => <Footer right={data}/>;
export default SiteFooter;
