import {configure} from '@testing-library/react';

import './mocha-globals';
import './enzyme-configuration';

configure({testIdAttribute: 'data-test'});

const testsContext = require.context('../src', true, /\.test\.[jt]sx?$/);

testsContext.keys().forEach(testsContext);
