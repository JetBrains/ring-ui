/**
 * @name Form
 * @description Ring form markup
 * @example
 <example name="Form">
   <file name="index.html">
     <form class="ring-form">
       <span class="ring-form__title">License</span>
       <div class="ring-form__group">
         <label for="ring-form-1" class="ring-form__label">License User Name</label>
         <div class="ring-form__control">
           <input class="ring-input" id="ring-form-1" type="text">
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-2" class="ring-form__label">License Key</label>
         <div class="ring-form__control">
           <input class="ring-input ring-input_error" id="ring-form-2" type="text">
           <div class="ring-input__error-bubble">Wrong value</div>
         </div>
       </div>
       <div class="ring-form__group">
         <label for="ring-form-3" class="ring-form__label">License Key</label>
         <div class="ring-form__control">
           <input class="ring-input ring-input_long" id="ring-form-3" type="text">
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
   </file>
 </example>
 */
