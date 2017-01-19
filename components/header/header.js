import React, {PropTypes, Children, Component} from 'react';
import classnames from 'classnames';

import Icon from '../icon/icon';

import styles from './header.css';

/**
 * @name Header
 * @category Components
 * @framework React
 * @constructor
 * @description Displays a configurable page header.
 * @example
   <example name="header">
     <file name="index.html">
       <div id="header"></div>
       <div class="page-content"></div>
     </file>

     <file name="index.css">
       body {
         margin: 0;
         background: #e8e8e9;
       }

      :global(.page-content) {
        background: #FFF;
        padding: 32px;
        height: 370px;
      }
     </file>

     <file name="index.js">
       import {render} from 'react-dom';
       import React from 'react';

       import jetbrainsLogo from 'jetbrains-logos/jetbrains/jetbrains.svg';
       import cog from 'jetbrains-icons/cog.svg';
       import help from 'jetbrains-icons/help.svg';
       import services from 'jetbrains-icons/services.svg';

       import Header, {HeaderRight, HeaderIcon} from 'ring-ui/components/header/header';
       import Link from 'ring-ui/components/link/link';
       import Icon from 'ring-ui/components/icon/icon';
       import Input from 'ring-ui/components/input/input';
       import Button from 'ring-ui/components/button/button';

       const container = document.getElementById('header');
       const renderHeaderDemo = () => (
         <Header>
           <Link href="/">
            <Icon glyph={jetbrainsLogo} size={Icon.Size.Size48} />
           </Link>
           <Link href="#">Users</Link>
           <Link href="#">Groups</Link>
           <Link href="#">Spaces</Link>
           <Link href="#">Services</Link>
           <Button>Create issue</Button>
           <HeaderRight>
             <Input placeholder="search" />
             <HeaderIcon glyph={cog} />
             <Link target="_blank" href="https://www.jetbrains.com/help/hub/">
               <HeaderIcon glyph={help} />
             </Link>
             <HeaderIcon glyph={services} />
           </HeaderRight>
         </Header>
       );

       render(renderHeaderDemo(), container);
     </file>
   </example>
 */

// TODO Spit to files
/* eslint-disable react/no-multi-comp */

const wrapChild = child => (
  <div className={styles.item}>
    {child}
  </div>
);

class HeaderRight extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classnames(styles.rightPart, className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {Children.map(children, wrapChild)}
      </div>
    );
  }
}

export default class Header extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classnames(styles.header, className);

    return (
      <div
        {...restProps}
        className={classes}
      >
        {Children.map(children, child => (
          child.type === HeaderRight ? child : wrapChild(child)
        ))}
      </div>
    );
  }
}

const HeaderIcon = class extends Icon {
  static propTypes = {
    className: PropTypes.string
  };

  static defaultProps = {
    activeEvent: 'onClick',
    color: Icon.Color.GRAY,
    size: Icon.Size.Size18
  };

  render() {
    const {children, className, ...restProps} = this.props;
    const classes = classnames(styles.icon, className);
    return (
      <Icon
        hoverColor={Icon.Color.ORANGE}
        {...restProps}
        className={classes}
      >
        {children}
      </Icon>
    );
  }
};


export {HeaderRight, HeaderIcon};
