define(['global/global__modules'], function(Module) {
  'use strict';

  // Ring
  var ring = function(module, method) {
    // Get method
    if (module && method) {
      var mdl = Module.get(module);
      // TODO figure best way
      // return Module.get(module).bind({}, method);
      return function() {
        return mdl.apply(mdl, [method].concat(arguments));
      };

    // Get module
    } else if (module) {
      return Module.get(module);

    // Get global module
    } else {
      return Module.get(Module.GLOBAL);
    }
  };

  // Global module
  Module.add(Module.GLOBAL, {
    add: {
      method: Module.add,
      override: true
    },
    remove: {
      method: Module.remove,
      override: true
    }
  });

  return ring;
});
