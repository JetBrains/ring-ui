import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './button-toolbar.css';

/**
 * @name Button Toolbar
 * @tags Ring UI Language
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

      import Button from '@jetbrains/ring-ui/components/button/button';
      import ButtonGroup from '@jetbrains/ring-ui/components/button-group/button-group';
      import ButtonToolbar from '@jetbrains/ring-ui/components/button-toolbar/button-toolbar';

      const container = document.getElementById('button-toolbar');

      const buttonToolbarDemo = (
        <ButtonToolbar>
          <Button primary={true} delayed={true}>Run</Button>
          <ButtonGroup>
            <Button>Button one</Button>
            <Button>Button two</Button>
            <Button disabled="disabled">Button three</Button>
          </ButtonGroup>
          <Button>Another action</Button>
        </ButtonToolbar>
      );

      render(buttonToolbarDemo, container);
    </file>
  </example>
*/

export default class ButtonToolbar extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  }

  render() {
    const {className} = this.props;
    const classes = classNames(styles.buttonToolbar, className);

    return (
      <div
        {...this.props}
        className={classes}
      />
    );
  }
}

