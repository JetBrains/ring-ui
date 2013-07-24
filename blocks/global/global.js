define(['global/global__modules'], function(Module) {
  'use strict';

  // Ring
  var ring = function(module, method) {
    // Get method
    if (module && method) {
      var mdl = Module.get(module);
      return mdl.bind(mdl, method);

    // Get module
    } else if (module) {
      return Module.get(module);

    // Get global module
    } else {
      return Module.get(Module.GLOBAL);
    }
  };

  return ring;
});
