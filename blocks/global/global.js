define(['global/global__modules'], function(Module) {
  'use strict';

  // Ring
  var ring = function(module, method) {
    // Get method
    if (module && method) {
      return Module.get(module).bind({}, method);

    // Get module
    } else if (module) {
      return Module.get(module);

    // Get global module
    } else {
      return Module.get(Module.GLOBAL);
    }
  };

  // Basic methods
  ring.add = Module.add;
  ring.remove = Module.remove;

  // Global module
  ring.add(Module.GLOBAL, {
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
