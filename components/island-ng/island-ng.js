/* global angular: false */
/**
 * @name Island Ng
 * @category Angular Components
 * @framework Angular
 * @description Provides an Angular wrapper for Island.
 * @example-file ./island-ng.examples.html
 */

import {createAngularComponent} from '../global/angular-component-factory';
import Island, {AdaptiveIsland, Header, Content} from '../island/island';

const angularModule = angular.module('Ring.island-ng', []);

angularModule.
  component('rgIsland', createAngularComponent(Island, 'Island')).
  component('rgAdaptiveIsland', createAngularComponent(AdaptiveIsland, 'AdaptiveIsland')).
  component('rgIslandHeader', createAngularComponent(Header, 'IslandHeader')).
  component('rgIslandContent', createAngularComponent(Content, 'IslandContent'));

export default angularModule.name;
