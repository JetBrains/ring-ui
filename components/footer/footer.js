/**
 * @fileoverview Ring Footer.
 */

import React, { PropTypes, isValidElement } from 'react';
import classNames from 'classnames';
import RingComponent from 'ring-component/ring-component';
import Link from 'link/link';
import './footer.scss';
import isArray from 'mout/lang/isArray';

/**
 * @constructor
 * @extends {ReactComponent}
 */
class FooterColumn extends RingComponent {
  static propTypes = {
    position: PropTypes.string
  };

  render() {
    let classes = classNames('ring-footer__column', 'ring-footer__column_' + this.props.position);
    return (
      <div className={classes}>
        <ul className="ring-footer__column__i">
          {this.props.children}
        </ul>
      </div>
    );
  }
}

/**
 * Return copyright string
 * @param year {int}
 * @returns {string}
 */
function copyright(year) {
  let currentYear = (new Date()).getUTCFullYear();
  let ret = '© ';

  if (year >= currentYear) {
    ret += year;
  } else {
    ret += year + '—' + currentYear;
  }

  return ret;
};

/**
 * @constructor
 * @extends {ReactComponent}
 */
class FooterLine extends RingComponent {
  props = {
    item: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array
    ])
  };

  render() {
    let items = isArray(this.props.item) ? this.props.item : [this.props.item];

    let renderItem = function(item) {
      if (isValidElement(item)) {
        return item;
      }

      let element = (item.copyright ? copyright(item.copyright) : '') + (item.label || item);

      if (item.url) {
        return <Link href={item.url} title={item.title}>{element}</Link>;
      }

      return element;
    };

    return (
      <li className="ring-footer__line">
        {items.map(renderItem)}
      </li>
    );
  }
}

/**
 * @name Footer
 * @constructor
 * @extends {ReactComponent}
 * @description
 *
 * This component defines the page footer.
 *
 * A footer consists of three sections, each optional:
 *  - left
 *  - center
 *  - right
 *
 * @param {string[]} className Additional classnames to component
 * @param {Object[]} left Left footer column elements
 * @param {Object[]} center Center footer column elements
 * @param {Object[]} right Right footer column elements
 * @returns {React} react component
 *
 * @example
   <example name="Footer">
   <file name="index.html">
   <div>
   <div id="footer"></div>
   </div>
   </file>
   <file name="index.js" webpack="true">
   var render = require('react-dom').render;
   var Footer = require('footer/footer');

   render(
     Footer.factory({
       className: 'stuff',
       left: [
         [{url: 'http://www.jetbrains.com/teamcity/?fromserver', label: 'TeamCity'}, ' by JetBrains'],
         'Enterprise 8.0.2 EAP (build 27448)'
       ],
       center: [
         [{copyright: 2000, label: ' JetBrains'}, ' · All rights reserved'],
         {url: 'http://teamcity.jetbrains.com/showagreement.html', label: 'License agreement', title: 'read me!'}
       ],
       right: [
         {url: 'http://www.jetbrains.com/teamcity/feedback?source=footer&version=8.0.3%20(build%2027531)&build=27531&mode=ent', label: 'Feedback'}
       ]
     }
   ), document.getElementById('footer'));
   </file>
   </example>
 */
export default class Footer extends RingComponent {
  /** @override */
  static propTypes = {
    className: PropTypes.string,
    left: PropTypes.array,
    center: PropTypes.array,
    right: PropTypes.array
  };

  render() {
    function content(elements, position) {
      if (!elements) {
        return false;
      }

      return (
        <FooterColumn key={position} position={position}>{
          elements.map(function(item, idx) {
            return <FooterLine key={idx} item={item} />;
          })
        }</FooterColumn>
      );
    }

    let classes = classNames('ring-footer', this.props.className);

    return (
      <div className={classes}>{
        [
          content(this.props.left, 'left'),
          content(this.props.center, 'center'),
          content(this.props.right, 'right')
        ]
      }</div>
    );
  }
}
