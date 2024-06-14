/* eslint-disable @typescript-eslint/no-magic-numbers */
import {shallow, mount, render} from 'enzyme';

import Footer, {FooterProps} from './footer';

describe('Footer', () => {
  const shallowFooter = (props?: FooterProps) => shallow(<Footer {...props}/>);
  const mountFooter = (props?: FooterProps) => mount(<Footer {...props}/>);
  const renderFooter = (props?: FooterProps) => render(<Footer {...props}/>);

  it('should create component', () => {
    shallowFooter().should.exist;
  });

  it('should be empty by default', () => {
    const wrapper = shallowFooter();
    wrapper.should.have.tagName('footer');
    wrapper.should.be.blank();
  });

  describe('should render items', () => {
    it('should add given class', () => {
      const wrapper = shallowFooter({className: 'myClass'});

      wrapper.should.have.className('myClass');
    });

    it('add left column one line', () => {
      const wrapper = renderFooter({left: ['One Line']});
      wrapper.should.have.text('One Line');
      wrapper.find('li').should.have.text('One Line');
    });

    it('add left column two lines', () => {
      const wrapper = renderFooter({left: ['One Line', 'Second Line']});
      wrapper.should.have.exactly(2).descendants('li');
    });

    it('add three columns two lines', () => {
      const wrapper = mountFooter({
        left: ['One Line', 'Second Line'],
        center: ['One Line', 'Second Line'],
        right: ['One Line', 'Second Line']
      });

      wrapper.should.have.exactly(3).descendants('ul');
      const uls = wrapper.find('ul');

      uls.forEach(ul => ul.should.have.exactly(2).descendants('li'));
    });

  });

  it('should render copyright', () => {
    const wrapper = renderFooter({
      left: [
        {copyright: 2010, label: ' JetBrains'}
      ]
    });

    wrapper.find('li').should.contain.text(`Copyright © 2010–${(new Date()).getFullYear()} JetBrains`);
  });

  it('should render link', () => {
    const wrapper = renderFooter({
      left: [
        {url: 'http://jetbrains.com', label: 'JetBrains', title: 'JetBrains Official Site'}
      ]
    });

    const link = wrapper.find('a');

    link.should.have.text('JetBrains');
    link.should.have.attr('href', 'http://jetbrains.com');
    link.should.have.attr('title', 'JetBrains Official Site');
  });
});
