import {Component, ReactNode} from 'react';
import classNames from 'classnames';

import Text from '../text/text';

import Popup from './popup';

const {Directions} = Popup.PopupProps;
export default {
  title: 'Components/Popup',

  parameters: {
    notes: 'Displays a popup.',
  },
};

interface PopupDemoState {
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
}
export const basic = () => {
  const directionMap = {
    topLeft: Directions.BOTTOM_RIGHT,
    topRight: Directions.BOTTOM_LEFT,
    bottomLeft: Directions.TOP_RIGHT,
    bottomRight: Directions.TOP_LEFT,
  };

  const directionKeys = Object.keys(directionMap) as (keyof typeof directionMap)[];
  const initialState = directionKeys.reduce((acc: PopupDemoState, key) => {
    acc[key] = true;
    return acc;
  }, {});

  class PopupDemo extends Component {
    state = initialState;

    renderPopup = (key: keyof PopupDemoState) => (
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

  return <PopupDemo />;
};

basic.storyName = 'basic';

basic.parameters = {
  screenshots: {captureSelector: ['.topLeft', '.topRight', '.bottomLeft', '.bottomRight']},
  a11y: {context: '#storybook-root,.topLeft,.topRight,.bottomLeft,.bottomRight'},
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
      `,
};

export const autoPositioning = () => {
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

autoPositioning.storyName = 'auto-positioning';

autoPositioning.parameters = {
  screenshots: {captureSelector: 'body'},
  a11y: {context: '#storybook-root,.left,.right,.bottom,.top'},
  storyStyles: `
<style>
  html, body {
    height: 100%;
    margin: 0 !important;
  }

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
      `,
};

export const popupInAPopup = () => {
  interface PopupBoxProps {
    children?: ReactNode;
  }
  class PopupBox extends Component<PopupBoxProps> {
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

popupInAPopup.storyName = 'popup in a popup';

popupInAPopup.parameters = {
  screenshots: {captureSelector: 'body'},
  storyStyles: `
<style>
  body {
    min-height: 400px !important;
  }

  .parent-popup {
    width: 100px;
    height: 100px;
    text-align: center;
  }

  .child-popup {
    background-color: var(--ring-error-container-light-color);
    text-align: center;
    margin: 8px;
  }
</style>
      `,
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

insideAScrollableContainer.storyName = 'inside a scrollable container';

insideAScrollableContainer.parameters = {
  screenshots: {skip: true},
  storyStyles: `
<style>
    body {
      margin: 0 !important;
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
      `,
};

export const fitsScreen = () => {
  const PopupDemo = (
    <div className="anchorBottom">
      Popup anchor on bottom
      <Popup maxHeight={1380}>
        {/* Scrollable */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <div className="popupContent" tabIndex={0}>
          <div>Popup top</div>
          <div>popup bottom</div>
        </div>
      </Popup>
    </div>
  );

  return PopupDemo;
};

fitsScreen.storyName = 'fits screen';

fitsScreen.parameters = {
  screenshots: {captureSelector: 'body'},
  storyStyles: `
<style>
    body {
      margin: 0 !important;
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
      `,
};

export const AllDirections = () => (
  <div style={{padding: 32}}>
    <div
      style={{
        margin: 'auto',
        width: 320,
        height: 80,
        border: '1px solid var(--ring-borders-color)',
        padding: '16px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      Anchor
      <Popup directions={[Directions.BOTTOM_LEFT]}>Bottom left</Popup>
      <Popup directions={[Directions.BOTTOM_CENTER]}>Bottom center</Popup>
      <Popup directions={[Directions.BOTTOM_RIGHT]}>Bottom right</Popup>
      <Popup directions={[Directions.TOP_LEFT]}>Top left</Popup>
      <Popup directions={[Directions.TOP_CENTER]}>Top center</Popup>
      <Popup directions={[Directions.TOP_RIGHT]}>Top right</Popup>
      <Popup directions={[Directions.LEFT_BOTTOM]}>Left bottom</Popup>
      <Popup directions={[Directions.LEFT_CENTER]}>Left center</Popup>
      <Popup directions={[Directions.LEFT_TOP]}>Left top</Popup>
      <Popup directions={[Directions.RIGHT_BOTTOM]}>Right bottom</Popup>
      <Popup directions={[Directions.RIGHT_CENTER]}>Right center</Popup>
      <Popup directions={[Directions.RIGHT_TOP]}>Right top</Popup>
    </div>
  </div>
);
AllDirections.parameters = {};

export const CSSPositioning = () => {
  interface CSSPositionDemoState {
    position: {
      x: number;
      y: number;
    };
    isDragging: boolean;
  }

  class CSSPositionDemo extends Component<{}, CSSPositionDemoState> {
    state: CSSPositionDemoState = {
      position: {
        x: 8,
        y: 8,
      },
      isDragging: false,
    };

    componentDidMount() {
      document.addEventListener('mousemove', this.handleMouseMove);
      document.addEventListener('mouseup', this.handleMouseUp);
    }

    componentWillUnmount() {
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }

    // Store the starting position for drag calculations
    dragStartPosition = {
      x: 0,
      y: 0,
    };

    handleMouseDown = (e: React.MouseEvent) => {
      this.setState({isDragging: true});
      this.dragStartPosition = {
        x: e.clientX - this.state.position.x,
        y: e.clientY - this.state.position.y,
      };

      // Prevent text selection during drag
      e.preventDefault();
    };

    handleMouseMove = (e: MouseEvent) => {
      if (this.state.isDragging) {
        this.setState({
          position: {
            x: e.clientX - this.dragStartPosition.x,
            y: e.clientY - this.dragStartPosition.y,
          },
        });
      }
    };

    handleMouseUp = () => {
      this.setState({isDragging: false});
    };

    render() {
      const {position} = this.state;

      return (
        <div className="container">
          {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus */}
          <div
            className="draggable-anchor"
            style={{
              left: `${position.x}px`,
              top: `${position.y}px`,
              cursor: this.state.isDragging ? 'grabbing' : 'grab',
            }}
            onMouseDown={this.handleMouseDown}
            role="button"
          >
            <Text>CSS Anchor Positioning. Drag me!</Text>
            <Popup offset={4} cssPositioning hidden={false}>
              <div className="popup-content css-popup">Uses CSS Anchor API</div>
            </Popup>
          </div>
        </div>
      );
    }
  }

  return <CSSPositionDemo />;
};

CSSPositioning.storyName = 'CSS Anchor Positioning';

CSSPositioning.parameters = {
  screenshots: {captureSelector: 'body'},
  storyStyles: `
<style>
  body {
    min-height: 90vh;
  }

  .container {
    width: auto;
  }

  .popup-content {
    padding: 16px;
    border-radius: 4px;
    min-width: 200px;
    text-align: left;
  }

  .draggable-anchor {
    position: absolute;
    user-select: none;
    touch-action: none;
  }
</style>
  `,
  docs: {
    description: {
      story: `
This story demonstrates the new \`cssPositioning\` prop that enables CSS Anchor positioning.
      `,
    },
  },
};

export const CssPositionAllDirections = () => (
  <div style={{padding: 32, minHeight: '90vh'}}>
    <div
      style={{
        margin: 'auto',
        width: 320,
        height: 80,
        border: '1px solid var(--ring-borders-color)',
        padding: '16px',
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      Anchor
      <Popup cssPositioning directions={[Directions.BOTTOM_LEFT]}>
        Bottom left
      </Popup>
      <Popup cssPositioning directions={[Directions.BOTTOM_CENTER]}>
        Bottom center
      </Popup>
      <Popup cssPositioning directions={[Directions.BOTTOM_RIGHT]}>
        Bottom right
      </Popup>
      <Popup cssPositioning directions={[Directions.TOP_LEFT]}>
        Top left
      </Popup>
      <Popup cssPositioning directions={[Directions.TOP_CENTER]}>
        Top center
      </Popup>
      <Popup cssPositioning directions={[Directions.TOP_RIGHT]}>
        Top right
      </Popup>
      <Popup cssPositioning directions={[Directions.LEFT_BOTTOM]}>
        Left bottom
      </Popup>
      <Popup cssPositioning directions={[Directions.LEFT_CENTER]}>
        Left center
      </Popup>
      <Popup cssPositioning directions={[Directions.LEFT_TOP]}>
        Left top
      </Popup>
      <Popup cssPositioning directions={[Directions.RIGHT_BOTTOM]}>
        Right bottom
      </Popup>
      <Popup cssPositioning directions={[Directions.RIGHT_CENTER]}>
        Right center
      </Popup>
      <Popup cssPositioning directions={[Directions.RIGHT_TOP]}>
        Right top
      </Popup>
    </div>
  </div>
);
CssPositionAllDirections.parameters = {
  screenshots: {captureSelector: 'body'},
};
