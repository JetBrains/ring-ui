import React from 'react';
import {render} from 'react-dom';

import AuthDialog from '../auth-dialog/auth-dialog';

/**
 * @name Auth Dialog Service
 * @category Components
 * @framework React
 * @constructor
 * @description A wrapper for AuthDialog component. Allows showing confirmation dialog
 * without mounting AuthDialog component. Could be used outside React.
 * @example
 <example name="AuthDialog Service">
 <file name="index.html">
 <div id="auth-dialog"></div>
 </file>

 <file name="index.js">
 import React from 'react';
 import {render} from 'react-dom';

 import Auth from 'ring-ui/components/auth/auth';
 import HTTP from 'ring-ui/components/http/http';
 import Button from 'ring-ui/components/button/button';
 import showAuthDialog from 'ring-ui/components/auth-dialog-service/auth-dialog-service';

 import hubConfig from 'ring-ui/site/hub-config';

 const auth = new Auth(hubConfig);
 const http = new HTTP(auth, auth.getAPIPath());


 class AuthDialogDemo extends React.Component {
       componentDidMount() {
         auth.init();
         http.get(`services/0-0-0-0-0?fields=name,iconUrl`).then(serviceDetails => {
           this.setState({serviceDetails});
           this.showAuthDialog();
         })
       }

       showAuthDialog = () => {
         const {serviceDetails} = this.state;
         const errorMessage = "Error message"

         showAuthDialog({serviceDetails, errorMessage}).
           then(positive => console.info(positive ? 'Should authorize' : 'Should leave as is'));
       }

       render() {
         return (
           <div>
             <Button onClick={this.showAuthDialog}>Show auth dialog</Button>
           </div>
         );
      }
     }

 render(<AuthDialogDemo/>, document.getElementById('auth-dialog'));
 </file>
 </example>
 */

const containerElement = document.createElement('div');

/**
 * Renders AuthDialog into virtual node to skip mantaining container
 */
function renderAuthDialog(props) {
  render(<AuthDialog {...props}/>, containerElement);
}

export default function showAuthDialog(props = {}) {
  renderAuthDialog({
    ...props,
    show: true
  });

  return () => {
    renderAuthDialog({show: false});
  };
}
