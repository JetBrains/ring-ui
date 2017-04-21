/* eslint-disable func-names */

import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';
import guid from 'mout/random/guid';

import Shortcuts from './shortcuts';

import simulateCombo from 'simulate-combo';


describe('ShortcutsComponent', () => {
  beforeEach(function () {
    this.component = renderIntoDocument(
      <Shortcuts
        map={{enter: this.sinon.spy()}}
        scope={guid()}
      />
    );
  });


  it('should initialize', function () {
    expect(this.component).to.be.defined;
  });


  it('should call shortcut handler', function () {
    simulateCombo('enter');

    expect(this.component.props.map.enter).to.be.called;
  });
});
