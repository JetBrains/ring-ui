import {Component} from 'react';
import PropTypes from 'prop-types';

/**
  * @name Fragment
  * @category Components
  * @framework React 16
  * @tags Ring UI Language
  * @category Utilities
  * @description A component that just returns its children. Can be used for easier array rendering

  * @example
    <example name="fragment">
      <file name="index.html">
        <div id="fragment"></div>
      </file>

      <file name="index.css">
        :global(.emphasis) {
          font-weight: bold;
        }
      </file>

      <file name="index.js">
        import React from 'react';
        import {render} from 'react-dom';

        import Fragment from '@jetbrains/ring-ui/components/fragment/fragment';

        const container = document.getElementById('fragment');


        render((
          <Fragment>
            Hello,
            {' '}
            <span className="emphasis">World!</span>
          </Fragment>
        ), container);
      </file>
    </example>
  */

export default class Fragment extends Component {
  static propTypes = {
    children: PropTypes.node
  };

  render() {
    return this.props.children;
  }
}
