/**
 * @name Dialog
 * @description Ring dialog markup
 * @example
 <example name="Dialog">
   <file name="index.html">
     <div class="ring-dialog__container">
       <div class="ring-dialog__header">
         <span class="ring-dialog__header__title">New space</span>
       </div>
       <form class="ring-dialog__content ring-form">
         <div class="ring-form__group">
           <label class="ring-form__label" for="dialog__key">Key</label>
           <div class="ring-form__control">
             <input id="dialog__key" class="ring-input" type="text">
           </div>
          </div>
         <div class="ring-form__group">
           <label class="ring-form__label" for="dialog__name">Name</label>
           <div class="ring-form__control">
             <input id="dialog__name" class="ring-input" type="text">
           </div>
         </div>
       </form>
       <div class="ring-dialog__footer">
         <div class="ring-dialog__footer__spacer"></div>
         <button class="ring-dialog__footer__item_first ring-dialog__footer__item ring-btn ring-btn_blue">Create space</button>
         <button class="ring-dialog__footer__item ring-btn">Cancel</button>
       </div>
     </div>
   </file>
   <file name="index.js" webpack="true">
     require('ring-ui/components/dialog/dialog.scss');
     require('ring-ui/components/input/input.scss');
     require('ring-ui/components/form/form.scss');
     require('ring-ui/components/panel/panel.scss');
     require('ring-ui/components/button/button.scss');
   </file>
 </example>
 */

