/* eslint-disable func-names */

import Shortcuts from './shortcuts';
import React from 'react';
import renderIntoDocument from 'render-into-document';
import guid from 'mout/random/guid';
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
