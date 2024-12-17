import {Component, Fragment} from 'react';
import pencilIcon from '@jetbrains/icons/pencil';
import pencil12pxIcon from '@jetbrains/icons/pencil-12px';
import hourglassIcon from '@jetbrains/icons/hourglass';

import Loader from '../loader-inline/loader-inline';

import {ControlsHeight, ControlsHeightContext} from '../global/controls-height';

import {Grid} from '../grid/grid';
import Row from '../grid/row';

import Button, {ButtonProps} from './button';

export default {
  title: 'Components/Button',

  component: Button,
  parameters: {
    zeplinLink: 'https://app.zeplin.io/project/5afd8f5511c2d1c625752bb0/screen/6193bc70fc4aa2a937f165ad',
  },
  argTypes: {
    blue: {
      table: {disable: true},
    },
  },
};

export const single = (args: ButtonProps) => <Button {...args} />;
single.args = {children: 'Label'};
single.parameters = {screenshots: {skip: true}};

export const basic = () => (
  <Grid className="buttons">
    {[ControlsHeight.S, ControlsHeight.M, ControlsHeight.L].map(height => (
      <ControlsHeightContext.Provider value={height} key={height}>
        {[
          {inline: false},
          {primary: true, inline: false},
          {success: true, inline: false},
          {error: true, inline: false},
          {secondary: true, inline: false},
          {danger: true, inline: false},
          {inline: true},
          {primary: true, inline: true},
          {danger: true, inline: true},
        ].map(typeProps => (
          <Fragment key={JSON.stringify(typeProps)}>
            {[{}, {active: true}, {disabled: true}, {loader: true}].map(stateProps => {
              const icon = height === ControlsHeight.S && !typeProps.inline ? pencil12pxIcon : pencilIcon;
              return (
                <Row key={JSON.stringify(stateProps)}>
                  {[
                    {children: 'Button'},
                    {children: '...', short: true},
                    {children: 'Button link', href: '/'},
                    {children: 'Icon button', icon},
                    {children: 'Button delayed', delayed: true},
                    {children: 'Button dropdown', dropdown: true},
                    {title: 'Just icon button', icon},
                  ].map(contentProps => (
                    <Button
                      data-test={stateProps.active ? 'button-active' : undefined}
                      key={JSON.stringify(contentProps)}
                      {...typeProps}
                      {...stateProps}
                      {...contentProps}
                    />
                  ))}
                </Row>
              );
            })}
            <br />
          </Fragment>
        ))}
      </ControlsHeightContext.Provider>
    ))}
  </Grid>
);

basic.storyName = 'basic';

basic.parameters = {
  screenshots: {
    actions: [
      {type: 'capture', name: '', selector: '#storybook-root'},
      {type: 'focus', selector: '[data-test=button-active]'},
      {type: 'capture', name: 'focus active', selector: '#storybook-root'},
    ],
  },
  storyStyles: `
<style>
  .buttons {
    background: var(--ring-content-background-color);
  }

  .buttons :is(button, a) {
    margin: 8px;
  }
</style>`,
};

export const longAction = () => {
  class Sleeper extends Component {
    state = {
      loading: false,
    };

    load = () => {
      this.setState({loading: true}, () => {
        setTimeout(this.sleep, 2000);
      });
    };

    sleep = () => {
      const date = Date.now();
      let curDate;
      do {
        curDate = Date.now();
      } while (curDate - date < 2000);

      this.setState({loading: false});
    };

    render() {
      const {loading} = this.state;
      return (
        <Fragment>
          <Button loader={loading} onClick={this.load}>
            Sleep
          </Button>
          <Button title="Sleep" loader={loading} icon={hourglassIcon} onClick={this.load} />
          {loading && <Loader />}
        </Fragment>
      );
    }
  }

  return <Sleeper />;
};

longAction.storyName = 'long action';
longAction.parameters = {screenshots: {skip: true}};
