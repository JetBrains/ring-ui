/* eslint-disable @typescript-eslint/no-magic-numbers */

import {getAllByRole, render, screen} from '@testing-library/react';

import Footer, {FooterProps} from './footer';

describe('Footer', () => {
  const renderFooter = (props?: FooterProps) => render(<Footer {...props} />);

  it('should create component', () => {
    renderFooter();
    screen.getByRole('contentinfo').should.exist;
  });

  it('should be empty by default', () => {
    renderFooter();
    const footer = screen.getByRole('contentinfo');
    footer.should.be.empty;
  });

  describe('should render items', () => {
    it('should add given class', () => {
      renderFooter({className: 'myClass'});
      screen.getByRole('contentinfo').should.have.class('myClass');
    });

    it('add left column one line', () => {
      renderFooter({left: ['One Line']});
      screen.getByRole('contentinfo').should.contain.text('One Line');
      screen.getByRole('listitem').should.contain.text('One Line');
    });

    it('add left column two lines', () => {
      renderFooter({left: ['One Line', 'Second Line']});
      screen.getAllByRole('listitem').should.have.length(2);
    });

    it('add three columns two lines', () => {
      renderFooter({
        left: ['One Line', 'Second Line'],
        center: ['One Line', 'Second Line'],
        right: ['One Line', 'Second Line'],
      });

      const uls = screen.getAllByRole('list');
      uls.should.have.length(3);

      uls.forEach(ul => getAllByRole(ul, 'listitem').should.have.length(2));
    });
  });

  it('should render copyright', () => {
    renderFooter({
      left: [{copyright: 2010, label: ' JetBrains'}],
    });

    screen.getByRole('listitem').should.contain.text(`Copyright © 2010–${new Date().getFullYear()} JetBrains`);
  });

  it('should render link', () => {
    renderFooter({
      left: [{url: 'http://jetbrains.com', label: 'JetBrains', title: 'JetBrains Official Site'}],
    });

    const link = screen.getByRole('link');

    link.should.have.text('JetBrains');
    link.should.have.attr('href', 'http://jetbrains.com');
    link.should.have.attr('title', 'JetBrains Official Site');
  });
});
