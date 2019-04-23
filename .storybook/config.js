import {configure} from '@storybook/html';
import './preview.css';

const req = require.context('../components', true, /\.examples\.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
