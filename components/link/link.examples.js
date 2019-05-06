import React from 'react';
import classNames from 'classnames';
import hubLogo from '@jetbrains/logos/hub/hub.svg';
import {storiesOf} from '@storybook/html';

import reactDecorator from '../../.storybook/react-decorator';

import Icon from '../icon';
import Toggle from '../toggle/toggle';

import Link, {linkHOC, setCompatibilityMode} from './link';


storiesOf('Components|Link', module).
  addParameters({
    notes: 'Displays a link.'
  }).
  addDecorator(reactDecorator()).
  add('all variants', () => {
    class CustomComponent extends React.Component {
      render() {
        const {active, activeClassName, className, ...props} = this.props;
        const classes = classNames(className, {
          [activeClassName]: active
        });
        return (
          <a
            {...props}
            className={classes}
          />
        );
      }
    }

    const CustomLink = linkHOC(CustomComponent);

    class LinkDemo extends React.Component {
      state = {compatibility: false};

      changeCompatibility = () => {
        // eslint-disable-next-line react/no-access-state-in-setstate
        const newCompat = !this.state.compatibility;
        setCompatibilityMode(newCompat);

        this.setState({compatibility: newCompat});
      };

      render() {
        return (
          <div style={{display: 'flex', flexDirection: 'column'}} data-test="lik-example">

            <Link href="#hash">Ordinary link</Link>

            <Link href="#hash" active>Active link (inherits color)</Link>

            <Link href="#hash" pseudo>Pseudo link (no underline on hover)</Link>

            <Link href="#hash">Link with a very long text, wrapping over lines</Link>

            <Link href="#hash">Link with a very long text, wrapping over lines</Link>

            <Link href="#hash" className="hub-link">
              {WrapText => [
                <Icon key="icon" glyph={hubLogo} className="hub-icon"/>,
                <div key="text"><WrapText>Link with non-text content</WrapText></div>
              ]}
            </Link>

            <CustomLink href="#hash">Custom link component</CustomLink>

            <CustomLink href="#hash" active>Active custom link component</CustomLink>

            <Toggle onChange={this.changeCompatibility}>Compatibility mode</Toggle>
          </div>
        );
      }
    }

    return <LinkDemo/>;
  }, {hermione: {captureSelector: '*[data-test~=lik-example]'}});
