/* eslint-disable modules/no-cjs */

require('babel-polyfill');
require('core-js');
require('dom4');
require('whatwg-fetch');
require.context('../node_modules/babel-runtime', true, /\.js$/);

require('react');
require('react-dom');
require('@hypnosphi/react-portal');
require('react-waypoint');

require('angular');

require('classnames');
require('combokeys');
require('moment');
require('simply-uuid');
require('sniffr');

require('mout/function/debounce');
require('mout/random/guid');
require('mout/function/throttle');
require('mout/lang/deepEquals');
require('mout/object/deepMatches');
