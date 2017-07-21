import React from 'react';
import {shallow, mount} from 'enzyme';
import guid from 'mout/random/guid';

import simulateCombo from '../../test-helpers/simulate-combo';

import Shortcuts from './shortcuts';

describe('ShortcutsComponent', () => {
  const factory = props => (
    <Shortcuts
      map={{enter: sandbox.spy()}}
      scope={guid()}
      {...props}
    />
  );

  const shallowShortcuts = props => shallow(factory(props));
  const mountShortcuts = props => mount(factory(props));


  it('should initialize', () => {
    shallowShortcuts().should.exist;
  });


  it('should call shortcut handler', () => {
    const wrapper = mountShortcuts();
    simulateCombo('enter');

    wrapper.prop('map').enter.should.be.called;
  });
});
