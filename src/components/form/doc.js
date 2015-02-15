/**
 * @example
 <example name="NewForm">
 <file name="index.html">
   <form class="ring-form">
     <div class="ring-form__title">License</div>
       <div class="ring-form__group">
        <label for="userNameSample" class="ring-form__label">Whatever you do, make sure you've got the right tools for the job. Tools Matter.</label>
        <div class="ring-form__control"><input class="ring-input" id="userNameSample" type="text"/></div>
       </div>
       <div class="ring-form__group">
         <label for="licenseSample" class="ring-form__label">License Key</label>
         <div class="ring-form__control ring-form__control_double">
         <input class="ring-input ring-input_error" id="licenseSample" type="text">
         <div class="ring-input__error-bubble">Wrong value</div>
         </div>
       </div>
       <div class="ring-form__group">
         <label for="passSample" class="ring-form__label">Password</label>
         <div class="ring-form__control">
         <input class="ring-input" id="passSample" type="password"/>
         </div>
         <div class="ring-form__group ring-form__group_nested">
          <label for="passSample2" class="ring-form__label">Password confirmation</label>
          <div class="ring-form__control ring-form__control_secondary">
          <input class="ring-input" id="passSample" type="password">
         </div>
       </div>
     </div>
     <div class="ring-panel">
       <button class="ring-btn_blue ring-btn">Save</button>
       <button class="ring-btn">Cancel</button>
       <button class="ring-btn ring-btn_danger ring-btn_opposite">Delete</button>
     </div>
   </form>
 </file>
 </example>
 */
