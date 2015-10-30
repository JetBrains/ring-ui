import React from 'react';
import RingComponent from '../ring-component/ring-component';
import './loader.scss';
import {getPixelRatio} from '../dom/dom';

/**
 * @name Loader
 * @constructor
 * @extends {ReactComponent}
 * @example
 <example name="Loader">
   <file name="index.html">
     <div id="loader1" class="loader-container"></div>
     <div id="loader2" class="loader-container loader-container_black"></div>
   </file>

   <file name="index.js" webpack="true">
     require('./index.scss');
     var render = require('react-dom').render;
     var Loader = require('ring-ui/components/loader/loader');

     render(Loader.factory({message: 'Loading...'}), document.getElementById('loader1'));

     render(Loader.factory({message: 'Loading...'}), document.getElementById('loader2'));
   </file>
   <file name="index.scss">
    .loader-container {
      padding: 32px;

      &_black {
        background-color: black;

        & .ring-loader__text {
          color: #FFF;
        }
      }
    }
   </file>
 </example>
 */

const INITIAL_TICKS = 100;

class Particle {
  constructor({x, y, radius, color}) {
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.color = color;

    this.decay = 0.01;
    this.life = 1;
  }

  step() {
    this.life -= this.decay;
  }

  isAlive() {
    return this.life >= 0;
  }

  draw(ctx) {
    const alpha = this.life >= 0 ? this.life : 0;
    ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;

    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default class Loader extends RingComponent {
  static defaultProps = {
    size: 96,
    colors: [
      {r: 215, g: 60, b: 234},  //#D73CEA
      {r: 145, g: 53, b: 224},  //#9135E0
      {r: 88, g: 72, b: 224},   //#5848F4
      {r: 37, g: 183, b: 255},  //#25B7FF
      {r: 89, g: 189, b: 0},    //#59BD00
      {r: 251, g: 172, b: 2},   //#FBAC02
      {r: 227, g: 37, b: 129}   //#E32581
    ]
  };

  static calculateGradient(startColor, stopColor, position) {
    const calculateChannelValue = (a, b) => {
      return a + Math.round((b - a) * position);
    };

    return {
      r: calculateChannelValue(startColor.r, stopColor.r),
      g: calculateChannelValue(startColor.g, stopColor.g),
      b: calculateChannelValue(startColor.b, stopColor.b)
    };
  }

  static getPixelRatio() {
    return getPixelRatio();
  }

  setCanvasSize() {
    const pixelRatio = Loader.getPixelRatio();
    const canvasSize = this.props.size * pixelRatio;

    this.refs.canvas.width = canvasSize;
    this.refs.canvas.height = canvasSize;

    //Fixate canvas physical size to avoid real size scaling
    this.refs.canvas.style.width = `${this.props.size}px`;
    this.refs.canvas.style.height = `${this.props.size}px`;

    this.ctx = this.refs.canvas.getContext('2d');

    //Scale on HDPI displays
    if (pixelRatio > 1) {
      this.ctx.scale(pixelRatio, pixelRatio);
    }
  }

  didMount() {
    this.setCanvasSize();

    this.height = this.props.size;
    this.width = this.props.size;

    this.particles = [];

    //Configuration
    this.baseSpeed = 1.0;
    this.colorIndex = 0;
    this.maxRadius = 12;
    this.minRadius = 6;
    this.colorChangeTick = 40;

    //State
    this.x = 0;
    this.y = 0;
    this.radius = 8;
    this.hSpeed = 1.5;
    this.vSpeed = 0.5;
    this.radiusSpeed = 0.05;
    this.tick = 0;

    this.prepareInitialState(INITIAL_TICKS);
    this.loop();
  }

  prepareInitialState(ticks) {
    for (let i = 0; i < ticks; i++) {
      this.step();
    }
  }

  handleLimits(coord, radius, speed, limit) {
    const randomizedSpeedChange = Math.random(this.baseSpeed) - this.baseSpeed / 2;

    if (coord + (radius * 2) + this.baseSpeed >= limit) {
      return -(this.baseSpeed + randomizedSpeedChange);
    } else if (coord <= this.baseSpeed) {
      return this.baseSpeed + randomizedSpeedChange;
    }
    return speed;
  }

  calculateNextCoordinates() {
    this.x += this.hSpeed;
    this.y += this.vSpeed;

    this.hSpeed = this.handleLimits(this.x, this.radius, this.hSpeed, this.width);
    this.vSpeed = this.handleLimits(this.y, this.radius, this.vSpeed, this.height);
  }

  calculateNextRadius() {
    this.radius += this.radiusSpeed;

    if (this.radius > this.maxRadius || this.radius < this.minRadius) {
      this.radiusSpeed = -this.radiusSpeed;
    }
  }

  getNextColor() {
    const colors = this.props.colors;

    const currentColor = colors[this.colorIndex];
    const nextColor = colors[this.colorIndex + 1] || colors[0];

    return Loader.calculateGradient(currentColor, nextColor, this.tick / this.colorChangeTick);
  }

  nextTick() {
    this.tick++;

    if (this.tick > this.colorChangeTick) {
      this.tick = 0;
      this.colorIndex++;
      if (this.colorIndex > this.props.colors.length - 1) {
        this.colorIndex = 0;
      }
    }
  }

  step() {
    this.nextTick();
    this.calculateNextCoordinates();
    this.calculateNextRadius();
    this.particles.forEach(particle => particle.step());

    this.particles.push(new Particle({
      x: this.x,
      y: this.y,
      radius: this.radius,
      color: this.getNextColor()
    }));
  }

  removeDeadParticles() {
    this.particles = this.particles.filter(it => it.isAlive());
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.removeDeadParticles();
    this.particles.forEach(particle => particle.draw(this.ctx));
  }

  loop() {
    this.step();
    this.draw();
    window.requestAnimationFrame(() => this.loop());
  }

  _renderText() {
    if (this.props.message) {
      return <div className="ring-loader__text">{this.props.message}</div>;
    }
  }

  render() {
    return (
      <div {...this.props}>
        <canvas
          ref="canvas"
          className="ring-loader__canvas"
        />
        {this._renderText()}
      </div>
    );
  }
}
