import React, {Component} from 'react';
import classNames from 'classnames';

import reactDecorator from '../../.storybook/react-decorator';

import Popup from '@jetbrains/ring-ui/components/popup/popup';

export default {
  title: 'Components/Popup',
  decorators: [reactDecorator()],

  parameters: {
    notes: 'Displays a popup.'
  }
};

export const basic = () => {
  const {Directions} = Popup.PopupProps;

  const directionMap = {
    topLeft: Directions.BOTTOM_RIGHT,
    topRight: Directions.BOTTOM_LEFT,
    bottomLeft: Directions.TOP_RIGHT,
    bottomRight: Directions.TOP_LEFT
  };

  const directionKeys = Object.keys(directionMap);
  const initialState = directionKeys.reduce((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});

  class PopupDemo extends Component {
    state = initialState;

    renderPopup = key => (
      <div className={classNames('anchor', key)} key={key}>
        <Popup
          hidden={!this.state[key]}
          onCloseAttempt={() => this.setState({[key]: false})}
          directions={[directionMap[key]]}
        >
          <span>Hello, world!</span>
        </Popup>
      </div>
    );

    showAgain = () =>
      setTimeout(() => {
        this.setState({bottomLeft: true});
      });

    render() {
      return (
        <div>
          {directionKeys.map(this.renderPopup)}
          <button className="button" type="button" onClick={this.showAgain}>
            Show again
          </button>
        </div>
      );
    }
  }

  return <PopupDemo/>;
};

basic.story = {
  name: 'basic',

  parameters: {
    hermione: {captureSelector: ['.topLeft', '.topRight', '.bottomLeft', '.bottomRight']},
    a11y: {element: '.topLeft,.topRight,.bottomLeft,.bottomRight'},
    storyStyles: `
  <style>
    body {
      overflow: hidden;
    }

    .button {
      position: absolute;
      left: 50px;
      bottom: 50px;
    }

    .anchor {
      position: absolute;
      width: 10px;
      height: 10px;
    }

    .topLeft {
      left: 0;
      top: 0;
      background-color: red;
    }

    .topRight {
      right: 0;
      top: 0;
      background-color: blue;
    }

    .bottomLeft {
      left: 0;
      bottom: 0;
      background-color: green;
    }

    .bottomRight {
      right: 0;
      bottom: 0;
      background-color: orange;
    }
  </style>
        `
  }
};

export const autoPositioning = () => {
  const Directions = Popup.PopupProps.Directions;

  const content = <span className="popup">This is a popup</span>;
  const PopupDemo = (
    <div>
      <div className="message">
        Popup should change open direction when reaching window borders
        <Popup directions={[Directions.TOP_CENTER]}>{content}</Popup>
      </div>
      <div className="message vert">
        Popup should change open direction when reaching window borders
        <Popup directions={[Directions.RIGHT_CENTER]}>{content}</Popup>
      </div>
      <div className="anchor left">
        Left side open popup
        <Popup directions={[Directions.LEFT_BOTTOM, Directions.RIGHT_BOTTOM]}>{content}</Popup>
      </div>
      <div className="anchor right">
        Right side open popup
        <Popup directions={[Directions.RIGHT_BOTTOM, Directions.LEFT_BOTTOM]}>{content}</Popup>
      </div>
      <div className="anchor bottom">
        Downside open popup
        <Popup directions={[Directions.BOTTOM_RIGHT, Directions.TOP_LEFT]}>{content}</Popup>
      </div>
      <div className="anchor top">
        Upside open popup
        <Popup directions={[Directions.TOP_LEFT, Directions.BOTTOM_RIGHT]}>{content}</Popup>
      </div>
    </div>
  );

  return PopupDemo;
};

autoPositioning.story = {
  name: 'auto-positioning',

  parameters: {
    hermione: {captureSelector: ['.left', '.right', '.bottom', '.top']},
    a11y: {element: '.left,.right,.bottom,.top'},
    storyStyles: `
  <style>
    .message {
      position: absolute;

      top: 50%;
      left: 300px;
    }

    .vert {
      top: 20%;
      width: 150px;
    }

    .anchor {
      position: absolute;
    }

    .left {
      left: 0;
      top: 50px;
    }

    .right {
      right: 0;
      top: 50px;
    }

    .bottom {
      left: 150px;
      bottom: 0;
    }

    .top {
      right: 150px;
      top: 0;
    }
  </style>
        `
  }
};

export const popupInAPopup = () => {
  class PopupBox extends Component {
    state = {hidden: false};

    render() {
      return (
        <Popup {...this.state} onCloseAttempt={() => this.setState({hidden: true})}>
          {this.props.children}
        </Popup>
      );
    }
  }

  const PopupDemo = (
    <div>
      Parent popup anchor
      <PopupBox>
        <div className="parent-popup">
          This is a parent popup
          <PopupBox>
            <div className="child-popup">This is a child popup</div>
          </PopupBox>
        </div>
      </PopupBox>
    </div>
  );

  return PopupDemo;
};

popupInAPopup.story = {
  name: 'popup in a popup',

  parameters: {
    hermione: {captureSelector: 'body'},
    storyStyles: `
  <style>
    body {
      min-height: 400px;
    }

    .parent-popup {
      width: 100px;
      height: 100px;
      text-align: center;
    }

    .child-popup {
      background-color: red;
      text-align: center;
      margin: 8px;
    }
  </style>
        `
  }
};

export const insideAScrollableContainer = () => (
  // Scrollable
  // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
  <div className="container" tabIndex={0}>
    <div className="example">
      <div className="anchor">
        Popup anchor
        <Popup>Popup content</Popup>
      </div>
    </div>
  </div>
);

insideAScrollableContainer.story = {
  name: 'inside a scrollable container',

  parameters: {
    hermione: {skip: true},
    storyStyles: `
  <style>
      body {
        margin: 0;
      }

      .container {
        height: 100vh;
        overflow: auto;
      }

      .example {
        height: 200vh;
        display: inline-block;
      }

      .anchor {
        display: inline-block;
      }
  </style>
        `
  }
};

export const fitsScreen = () => {
  const PopupDemo = (
    <div className="anchorBottom">
      Popup anchor on bottom
      <Popup maxHeight={1380}>
        <div className="popupContent">
          <div>Popup top</div>
          <div>popup bottom</div>
        </div>
      </Popup>
    </div>
  );

  return PopupDemo;
};

fitsScreen.story = {
  name: 'fits screen',

  parameters: {
    hermione: {captureSelector: 'body'},
    storyStyles: `
  <style>
      body {
        margin: 0;
      }

      html,
      body {
        height: 100%;
      }

      .popupContent {
        height: 1300px;
        padding: 8px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .anchorBottom {
        position: absolute;
        bottom: 20px;
      }
  </style>
        `
  }
};
