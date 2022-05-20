import React from 'react';
import classNames from 'classnames';
import hubLogo from '@jetbrains/logos/hub/hub.svg';

import reactDecorator from '../../.storybook/react-decorator';

import Icon from '../icon/icon';
import Toggle from '../toggle/toggle';

import Link, {linkHOC, setCompatibilityMode} from './link';
import {ClickableLinkProps} from './clickableLink';

export default {
  title: 'Components/Link',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a link.'
  }
};

interface CustomComponentProps extends ClickableLinkProps {
  active?: boolean
}
interface LinkDemoState {
  compatibility: boolean
}
export const allVariants = () => {
  class CustomComponent extends React.Component<CustomComponentProps> {
    render() {
      const {active, activeClassName, onPlainLeftClick, className, href, children,
        ...props} = this.props;
      const classes = classNames(className, {
        [activeClassName ?? '']: active
      });
      return <a href={href} {...props} className={classes}>{children}</a>;
    }
  }

  const CustomLink = linkHOC(CustomComponent);

  class LinkDemo extends React.Component<unknown, LinkDemoState> {
    state = {compatibility: false};

    changeCompatibility = () => this.setState(({compatibility}) => {
      const newCompat = !compatibility;
      setCompatibilityMode(newCompat);
      return {compatibility: newCompat};
    });

    render() {
      return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}} data-test="lik-example">
          <Link href="/">Ordinary link</Link>

          <Link href="/" active>
            Active link (inherits color)
          </Link>

          <Link href="/" pseudo>
            Pseudo link (no underline on hover)
          </Link>

          <Link href="/">Link with a very long text, wrapping over lines</Link>

          <Link href="/">Link with a very long text, wrapping over lines</Link>

          <Link href="/" className="hub-link">
            {WrapText => [
              <Icon key="icon" glyph={hubLogo} className="hub-icon"/>,
              <div key="text">
                <WrapText>Link with non-text content</WrapText>
              </div>
            ]}
          </Link>

          <CustomLink href="/">Custom link component</CustomLink>

          <CustomLink href="/" active>
            Active custom link component
          </CustomLink>

          <Toggle onChange={this.changeCompatibility}>Compatibility mode</Toggle>
        </div>
      );
    }
  }

  return <LinkDemo/>;
};

allVariants.storyName = 'Link';
allVariants.parameters = {hermione: {captureSelector: '*[data-test~=lik-example]'}};
