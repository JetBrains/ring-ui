import {configure} from '@storybook/html';
import './preview.css';

function loadStories() {
  require('../components/alert/alert.examples');
}

configure(loadStories, module);
