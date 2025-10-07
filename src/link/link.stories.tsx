import {Component} from 'react';
import classNames from 'classnames';


import Icon from '../icon/icon';
import Link, {linkHOC} from './link';
import {type ClickableLinkProps} from './clickable-link';

import hubLogo from '@jetbrains/logos/hub/hub.svg';

export default {
  title: 'Components/Link',

  parameters: {
    notes: 'Displays a link.',
  },
};

interface CustomComponentProps extends ClickableLinkProps {
  active?: boolean;
}

export const allVariants = () => {
  class CustomComponent extends Component<CustomComponentProps> {
    render() {
      const {active, activeClassName, onPlainLeftClick, className, href, children, ...props} = this.props;
      const classes = classNames(className, {
        [activeClassName ?? '']: active,
      });
      return (
        <a href={href} {...props} className={classes}>
          {children}
        </a>
      );
    }
  }

  const CustomLink = linkHOC(CustomComponent);

  class LinkDemo extends Component<unknown> {
    render() {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} data-test='lik-example'>
          <Link href='/'>Ordinary link</Link>

          <Link href='/' active>
            Active link (inherits color)
          </Link>

          <Link href='/' pseudo>
            Pseudo link (no underline on hover)
          </Link>

          <Link href='/' hover>
            Hovered link
          </Link>

          <Link href='/'>Link with a very long text, wrapping over lines</Link>

          <Link href='/'>Link with a very long text, wrapping over lines</Link>

          <Link href='/' className='hub-link'>
            <Icon key='icon' glyph={hubLogo} className='hub-icon' />
            <div key='text'>
              <span>Link with non-text content</span>
            </div>
          </Link>

          <CustomLink href='/'>Custom link component</CustomLink>

          <CustomLink href='/' active>
            Active custom link component
          </CustomLink>
        </div>
      );
    }
  }

  return <LinkDemo />;
};

allVariants.storyName = 'Link';
allVariants.parameters = {screenshots: {captureSelector: '*[data-test~=lik-example]'}};
