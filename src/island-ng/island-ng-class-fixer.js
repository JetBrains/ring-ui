// Workaround fo Angular bug with ng-class & replace: true support
// See https://github.com/angular/angular.js/issues/5695#issuecomment-31898355
export default function compile(tElement, tAttrs) {
  if (tAttrs.ngClass) {
    tAttrs.ngClass = tAttrs.ngClass.replace(/}\s*{/g, ', ');
  }
}
