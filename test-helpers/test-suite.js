import {configure} from '@testing-library/dom';

import './mocha-globals';
import './enzyme-configuration';

configure({testIdAttribute: 'data-test'});

const testsContext = require.context('../components', true, /\.test\.js$/);

testsContext.keys().forEach(testsContext);
