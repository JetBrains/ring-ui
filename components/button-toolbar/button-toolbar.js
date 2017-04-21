import React from 'react';
import classNames from 'classnames';

import RingComponent from '../ring-component/ring-component';

import './button-toolbar.scss';

/**
 * @name Button Toolbar
 * @category Components
 * @framework React
 * @constructor
 * @extends {ReactComponent}
 * @description Displays a toolbar with several buttons.
 * @example
  <example name="Button Toolbar">
    <file name="index.html">
      <div id="button-toolbar"></div>
    </file>
    <file name="index.js" webpack="true">
      import React from 'react';
      import {render} from 'react-dom';

      import Button from 'ring-ui/components/button-legacy/button-legacy';
      import ButtonGroup from 'ring-ui/components/button-group/button-group';
      import ButtonToolbar from 'ring-ui/components/button-toolbar/button-toolbar';

      const container = document.getElementById('button-toolbar');

      const buttonToolbarDemo = (
        <ButtonToolbar>
          <Button primary={true} delayed={true}>Do it</Button>
          <ButtonGroup>
            <Button>Just do it</Button>
            <Button>Yes you can</Button>
            <Button disabled="disabled">Do it</Button>
          </ButtonGroup>
          <Button>Just do it</Button>
        </ButtonToolbar>
      );

      render(buttonToolbarDemo, container);
    </file>
  </example>
*/

export default class ButtonToolbar extends RingComponent {
  render() {
    const classes = classNames('ring-button-toolbar', this.props.className);
    return (
      <div
        {...this.props}
        className={classes}
      >
        {this.props.children}
      </div>
    );
  }
}

