import '!!file?name=favicon.ico!../../favicon.ico';
import './app.scss';
//Example of usage react components
import React from 'react';
import alerts from 'alert/alerts';

let alertsContainer = React.renderComponent(alerts(null),
   document.getElementById('alerts__container'));

alertsContainer.add('Test message');
alertsContainer.add('Another test message', alerts.Type.MESSAGE, 1000);
alertsContainer.add('Test warning', alerts.Type.WARNING);

export default {};
