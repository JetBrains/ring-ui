export default `<div
  ng-class=":: [styles.tabs, styles[theme]]"
  rg-shortcuts="ring-tabs"
  shortcuts-map="keyMap"
  shortcuts-focus="focus"
>
  <div
    ng-class=":: [styles.titles, tabsClass]"
    role="tablist"
  >
    <button
      role="tab"
      type="button"
      ng-repeat="pane in panes | orderBy:'tabIndex'"
      ng-click="control.select(pane)"
      ng-attr-tabindex="{{(pane.selected || pane.ngDisabled) ? -1 : 0}}"
      ng-disabled="pane.ngDisabled"
      data-test="ring-tab"
      ng-attr-data-test-active="{{pane.selected  ? 'true' : 'false'}}"
      ng-attr-class="{{ tabClass(pane) }}"
    ><span
      ng-class=":: styles.visible">{{pane.title}}<span
      ng-class=":: styles.tabCounter"
      ng-show="pane.counter !== undefined">{{ pane.counter }}</span
    ></span><!--
      hack for preserving constant tab width
    --><span ng-class=":: styles.hidden">{{pane.title}}<span
      ng-class=":: styles.tabCounter" ng-show="pane.counter !== undefined">{{ pane.counter }}</span></span>
      <span ng-class=":: styles.hiddenBold">{{pane.title}}<span
        ng-class=":: styles.tabCounter" ng-show="pane.counter !== undefined">{{ pane.counter }}</span></span>
      <span ng-class=":: styles.hiddenRegular">{{pane.title}}<span
        ng-class=":: styles.tabCounter" ng-show="pane.counter !== undefined">{{ pane.counter }}</span></span>
    </button>
  </div>

  <div ng-transclude></div>

</div>`;
