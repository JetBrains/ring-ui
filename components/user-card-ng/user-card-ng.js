/**
 * @name User Card Ng
 */
import angular from 'angular';

import {createAngularComponent} from '../global/angular-component-factory';
import SmartUserCardTooltip from '../user-card/smart-user-card-tooltip';
import UserCardTooltip from '../user-card/tooltip';

const angularModule = angular.module('Ring.user-card', []);

angularModule.
  component('rgUserCardTooltip', createAngularComponent(UserCardTooltip, 'UserCardTooltip')).
  component('rgSmartUserCardTooltip', createAngularComponent(SmartUserCardTooltip, 'SmartUserCardTooltip'));

export default angularModule.name;
