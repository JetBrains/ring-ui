

import {getAllByRole, render, screen} from '@testing-library/react';

import Footer, {type FooterProps} from './footer';

describe('Footer', () => {
  const renderFooter = (props?: FooterProps) => render(<Footer {...props} />);

  it('should create component', () => {
    renderFooter();
    expect(screen.getByRole('contentinfo')).to.exist;
  });

  it('should be empty by default', () => {
    renderFooter();
    const footer = screen.getByRole('contentinfo');
    expect(footer).to.be.empty;
  });

  describe('should render items', () => {
    it('should add given class', () => {
      renderFooter({className: 'myClass'});
      expect(screen.getByRole('contentinfo')).to.have.class('myClass');
    });

    it('add left column one line', () => {
      renderFooter({left: ['One Line']});
      expect(screen.getByRole('contentinfo')).to.contain.text('One Line');
      expect(screen.getByRole('listitem')).to.contain.text('One Line');
    });

    it('add left column two lines', () => {
      renderFooter({left: ['One Line', 'Second Line']});
      expect(screen.getAllByRole('listitem')).to.have.length(2);
    });

    it('add three columns two lines', () => {
      renderFooter({
        left: ['One Line', 'Second Line'],
        center: ['One Line', 'Second Line'],
        right: ['One Line', 'Second Line'],
      });

      const uls = screen.getAllByRole('list');
      expect(uls).to.have.length(3);

      uls.forEach(ul => expect(getAllByRole(ul, 'listitem')).to.have.length(2));
    });
  });

  it('should render copyright', () => {
    renderFooter({
      left: [{copyright: 2010, label: ' JetBrains'}],
    });

    expect(screen.getByRole('listitem')).to.contain.text(`Copyright © 2010–${new Date().getFullYear()} JetBrains`);
  });

  it('should render link', () => {
    renderFooter({
      left: [{url: 'http://jetbrains.com', label: 'JetBrains', title: 'JetBrains Official Site'}],
    });

    const link = screen.getByRole('link');

    expect(link).to.have.text('JetBrains');
    expect(link).to.have.attr('href', 'http://jetbrains.com');
    expect(link).to.have.attr('title', 'JetBrains Official Site');
  });
});
