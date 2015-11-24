/**
 * @name Form
 * @description Ring form markup
 * @example
 <example name="Form">
   <file name="index.html">
    <div ng-app="Example.form">
     <form class="ring-form" ng-controller="FormExampleCtrl as formExampleCtrl">
       <span class="ring-form__title">Form Title</span>
       <div class="ring-form__group">
         <label for="ring-form-1" class="ring-form__label">Simple Input</label>
         <div class="ring-form__control">
           <input class="ring-input" id="ring-form-1" type="text">
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-2" class="ring-form__label">Medium Input with Error</label>
         <div class="ring-form__control">
           <input class="ring-input ring-input_medium ring-input_error" id="ring-form-2" type="text">
           <div class="ring-input__error-bubble">Wrong value</div>
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-3" class="ring-form__label">Long input</label>
         <div class="ring-form__control">
           <input class="ring-input ring-input_long" id="ring-form-3" type="text">
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-4" class="ring-form__label">Full-width control</label>
         <div class="ring-form__control ring-form__control_full-width">
           <input class="ring-input" id="ring-form-4" type="text">
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-4" class="ring-form__label">Rg Select in Form</label>
         <div class="ring-form__control">
           <rg-select options="item.name for item in formExampleCtrl.arr track by item.name"></rg-select>
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-5" class="ring-form__label">Rg Select in Small</label>
         <div class="ring-form__control ring-form__control_small">
           <rg-select id="ring-form-5" options="item.name for item in formExampleCtrl.arr track by item.name"></rg-select>
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-6" class="ring-form__label">Input in Small</label>
         <div class="ring-form__control ring-form__control_small">
           <input class="ring-input" id="ring-form-6" type="text">
         </div>
       </div>
       <div class="ring-form__footer">
         <button class="ring-btn_blue ring-btn">Save</button>
         <button class="ring-btn">Cancel</button>
       </div>
     </form>
   </file>
   <file name="index.js" webpack="true">
      require('ring-ui/components/input/input.scss');
      require('ring-ui/components/form/form.scss');
      require('ring-ui/components/panel/panel.scss');
      require('ring-ui/components/button/button.scss');

      require('angular');
      require('ring-ui/components/select-ng/select-ng');

      angular.module('Example.form', ['Ring.select'])
        .controller('FormExampleCtrl', function() {
          var formExampleCtrl = this;
          formExampleCtrl.arr = [{name: 'Ada'}, {name: 'Nik'}];
        });
   </file>
 </example>
 */
