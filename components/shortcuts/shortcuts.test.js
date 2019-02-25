import React from 'react';
import {shallow, mount} from 'enzyme';

import simulateCombo from '../../test-helpers/simulate-combo';
import getUID from '../global/get-uid';

import Shortcuts from './shortcuts';

describe('ShortcutsComponent', () => {
  const factory = props => (
    <Shortcuts
      map={{enter: sandbox.spy()}}
      scope={getUID('shortcuts-test-')}
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

  it('should enable shortcuts if disabled becomes "false"', () => {
    const wrapper = mountShortcuts({disabled: true});

    simulateCombo('enter');
    wrapper.prop('map').enter.should.not.be.called;

    wrapper.setProps({disabled: false});

    simulateCombo('enter');
    wrapper.prop('map').enter.should.be.called;
  });
});
