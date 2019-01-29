// Configuration and stories must use same package
import {configure} from '../../../node_modules/@storybook/react';

function loadStories() {
  require('../../../components/alert/alert.examples');
}

configure(loadStories, module);
