import React, {PureComponent} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import './loader-inline.scss';

/**
 * @name Loader Inline
 * @category Components
 * @constructor
 * @description Displays a small animated loader, shown inline with text. Use case: contextual loading animation.
 * @extends {ReactComponent}
 * @example
   <example name="Inline loader">
     <file name="index.html">
        <span>some text on top</span>
        <div>before <span id="loader-inline"></span> some text after</div>
        <div>some text under loader</div>
     </file>

     <file name="index.js" webpack="true">
       import React from 'react';
       import {render} from 'react-dom';
       import Loader from '@jetbrains/ring-ui/components/loader-inline/loader-inline';

       render(<Loader/>, document.getElementById('loader-inline'));
     </file>
   </example>
    <example name="Inline loader without React">
     <file name="index.html">
       <div class="ring-loader-inline">
         <div class="ring-loader-inline__ball"></div>
         <div class="ring-loader-inline__ball ring-loader-inline__ball_second"></div>
         <div class="ring-loader-inline__ball ring-loader-inline__ball_third"></div>
       </div>
     </file>
      <file name="index.js" webpack="true">
        import '@jetbrains/ring-ui/components/loader-inline/loader-inline';
      </file>
   </example>
 */

export default class LoaderInline extends PureComponent {
  static propTypes = {
    className: PropTypes.string
  };

  render() {
    const classes = classNames(
      'ring-loader-inline',
      this.props.className
    );

    return (
      <div
        {...this.props}
        className={classes}
      >
        <div className="ring-loader-inline__ball"/>
        <div className="ring-loader-inline__ball ring-loader-inline__ball_second"/>
        <div className="ring-loader-inline__ball ring-loader-inline__ball_third"/>
      </div>
    );
  }
}
