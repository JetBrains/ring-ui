import React from 'react';
import {findDOMNode} from 'react-dom';
import {renderIntoDocument} from 'react-dom/test-utils';

import Footer from './footer';

describe('Footer', () => {
  const renderComponent = props => renderIntoDocument(<Footer {...props}/>);
  const renderNode = props => findDOMNode(renderComponent(props));

  it('should create component', () => {
    renderComponent().should.exist;
  });

  it('should be empty by default', () => {
    const node = renderNode();

    node.tagName.toLowerCase().should.equal('div');
    node.innerHTML.should.be.empty;
  });

  describe('should render items', () => {
    it('should add given class', () => {
      const node = renderNode({className: 'myClass'});

      node.should.have.class('myClass');
    });

    it('add left column one line', () => {
      const node = renderNode({left: ['One Line']});
      node.should.have.text('One Line');
      node.query('li').textContent.should.equal('One Line');
    });

    it('add left column two lines', () => {
      const node = renderNode({left: ['One Line', 'Second Line']});
      const li = node.queryAll('li');

      li.should.not.be.empty;
      li.should.have.length(2);
    });

    it('add three columns two lines', () => {
      const node = renderNode({
        left: ['One Line', 'Second Line'],
        center: ['One Line', 'Second Line'],
        right: ['One Line', 'Second Line']
      });

      function assertLines(lines, count) {
        lines.should.not.be.empty;
        lines.should.have.length(count);
      }

      const ul = node.queryAll('ul');

      ul.should.have.length(3);
      assertLines(ul[0].queryAll('li'), 2);
      assertLines(ul[1].queryAll('li'), 2);
      assertLines(ul[2].queryAll('li'), 2);
    });

  });

  it('should render copyright', () => {
    const node = renderNode({
      left: [
        {copyright: 2010, label: ' JetBrains'}
      ]
    });

    node.query('li').should.contain.text(`© 2010—${(new Date()).getFullYear()} JetBrains`);
  });

  it('should render link', () => {
    const node = renderNode({
      left: [
        {url: 'http://jetbrains.com', label: 'JetBrains', title: 'JetBrains Official Site'}
      ]
    });

    const link = node.query('a');

    link.should.have.text('JetBrains');
    link.should.have.attr('href', 'http://jetbrains.com');
    link.should.have.attr('title', 'JetBrains Official Site');
  });
});
