import angular from 'angular';

import confirm from '../confirm-service/confirm-service';
import MessageBundle from '../message-bundle-ng/message-bundle-ng';

/**
 * @name Confirm Ng
 */

const angularModule = angular.module('Ring.confirm', [
  MessageBundle
]);

angularModule.service('confirm', function service($q, RingMessageBundle) {
  return function showConfirm(
    message, description, actionTitle, cancelTitle,
    cancelIsDefault, actionFn
  ) {
    return $q.when(confirm({
      text: message,
      description,
      confirmLabel: actionTitle || RingMessageBundle.confirmation_ok(),
      rejectLabel: cancelTitle || RingMessageBundle.confirmation_cancel(),
      cancelIsDefault,
      onBeforeConfirm: actionFn
    }));
  };
});

export default angularModule.name;
