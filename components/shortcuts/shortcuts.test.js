/* eslint-disable func-names */

import Shortcuts from './shortcuts';
import React from 'react';
import renderIntoDocument from 'render-into-document';
import guid from 'mout/random/guid';
import simulateKeypress from 'simulate-keypress';


describe('ShortcutsComponent', () => {
  const Enter = 13;


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
    simulateKeypress(null, Enter);

    expect(this.component.props.map.enter).to.be.called;
  });
});
