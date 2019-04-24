import {configure} from '@storybook/html';
import './preview.css';

const req = require.context('../components', true, /\.examples\.js$/);

function loadStories() {
  // Make welcome stories default
  require('../components/welcome.examples');
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
