'use strict';
import '!!file?name=favicon.ico!../../favicon.ico';
import './app.scss';

<% if (useReact) { %>
//Example of usage react components
import React from 'react';
import Alerts from 'alert/alerts';

let alertsContainer = React.renderComponent(Alerts(null),
   document.getElementById('alerts__container'));

alertsContainer.add('Test message');
alertsContainer.add('Another test message', Alerts.Type.MESSAGE, 1000);
alertsContainer.add('Test warning', Alerts.Type.WARNING);
<% } %>

<% if (useAngular) { %>
import 'angular';
import 'angular-resource';
import 'angular-route';
import 'angular-gettext';

import Footer from 'footer/footer';
import ReactNG from 'react-ng/react-ng';

ReactNG({Footer});

angular.module('project', [
  'ngRoute',
  'gettext',
  'Ring.react-ng'
])
.run(function ($rootScope) {
  var renderFooter = function () {
    $rootScope.footer = {
      'right': [{
        label: 'Leave Feedback',
        url: 'https://some.link'
      }]
    };
  };

  renderFooter();
})
.config(($locationProvider) => {
  $locationProvider.html5Mode(true);

});

<% } %>

export default {};
