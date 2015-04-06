import '!!file?name=favicon.ico!../../favicon.ico';
import './app.scss';
<% if (useReact) { %>
//Example of usage react components
import React from 'react';
import alerts from 'alert/alerts';

let alertsContainer = React.renderComponent(alerts(null),
   document.getElementById('alerts__container'));

alertsContainer.add('Test message');
alertsContainer.add('Another test message', alerts.Type.MESSAGE, 1000);
alertsContainer.add('Test warning', alerts.Type.WARNING);
<% } %>
<% if (useAngular) { %>
import 'angular';
import 'angular-resource';
import 'angular-route';
import 'angular-gettext';

import Footer from 'footer/footer';
import reactNG from 'react-ng/react-ng';

reactNG({Footer});

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
