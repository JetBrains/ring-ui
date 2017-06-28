import React from 'react';
import {shallow, mount, render} from 'enzyme';

import Badge from './badge';
import style from './badge.css';

describe('Badge', () => {
  const shallowBadge = (params, content) => shallow(<Badge {...params}>{content}</Badge>);
  const mountBadge = (params, content) => mount(<Badge {...params}>{content}</Badge>);
  const renderBadge = (params, content) => render(<Badge {...params}>{content}</Badge>);

  it('should create component', () => {
    mountBadge().should.have.type(Badge);
  });

  it('should render span with badge class', () => {
    const wrapper = shallowBadge();
    wrapper.should.have.tagName('span');
    wrapper.should.have.className(style.badge);
  });

  it('should use passed className', () => {
    shallowBadge({className: 'test-class'}).should.have.className('test-class');
  });

  it('should render children', () => {
    renderBadge({}, 'foo').should.have.text('foo');
  });

  it('should render valid badge', () => {
    shallowBadge({valid: true}, 'foo').should.have.className(style.valid);
  });
});
