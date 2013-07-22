define(['global/global__modules', 'global/global__templates'], function(Module, Template) {
  'use strict';

  // Global module
  Module.add(Module.GLOBAL, {
    add: {
      method: Module.add,
      override: true
    },
    remove: {
      method: Module.remove,
      override: true
    },
    config: {
      method: Module.config,
      override: true
    },
    init: Module.init,
    render: {
      method: Template.render,
      override: true
    }
  });

});
