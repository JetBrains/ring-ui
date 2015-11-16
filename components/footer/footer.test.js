import React from 'react';
import TestUtils from 'react-addons-test-utils';
import Footer from './footer';

describe('Footer', function () {
  let footer;

  beforeEach(function () {
    footer = TestUtils.renderIntoDocument(React.createElement(Footer));
  });

  it('should create component', function () {
    footer.should.exist;
  });

  it('should be empty by default', function () {
    footer.node.tagName.toLowerCase().should.equal('div');
    footer.node.innerHTML.should.be.empty;
  });

  describe('should render items', function () {
    it('should add given class', function () {
      footer.rerender({className: 'myClass'});

      footer.node.should.have.class('myClass');
    });

    it('add left column one line', function () {
      footer.rerender({left: ['One Line']});

      footer.node.should.have.text('One Line');
      footer.node.query('li').should.not.be.empty;
      footer.node.query('li').should.have.length(1);
    });

    it('add left column two lines', function () {
      footer.rerender({left: ['One Line', 'Second Line']});
      const li = footer.node.queryAll('li');

      li.should.not.be.empty;
      li.should.have.length(2);
    });

    it('add three columns two lines', function () {
      footer.rerender({
        left: ['One Line', 'Second Line'],
        center: ['One Line', 'Second Line'],
        right: ['One Line', 'Second Line']
      });

      function assertLines(lines, count) {
        lines.should.not.be.empty;
        lines.should.have.length(count);
      }

      const root = footer.node;
      const ul = root.queryAll('ul');

      ul.should.have.length(3);
      assertLines(ul[0].queryAll('li'), 2);
      assertLines(ul[1].queryAll('li'), 2);
      assertLines(ul[2].queryAll('li'), 2);
    });

  });

  it('should render copyright', function () {
    footer.rerender({
      left: [
        {copyright: 2010, label: ' JetBrains'}
      ]
    });

    footer.node.query('li').should.contain.text('© 2010—' + (new Date()).getFullYear() + ' JetBrains');
  });

  it('should render link', function () {
    footer.rerender({
      left: [
        {url: 'http://jetbrains.com', label: 'JetBrains', title: 'JetBrains Official Site'}
      ]
    });

    const link = footer.node.query('a');

    link.should.have.text('JetBrains');
    link.should.have.attr('href', 'http://jetbrains.com');
    link.should.have.attr('title', 'JetBrains Official Site');
  });
});
