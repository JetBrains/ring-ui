export default `<div
  class="ring-sidebar"
  rg-place-under="{{sidebar.placeUnderSibling}}"
  place-top-offset="{{sidebar.topOffset}}"
  sync-height="true"
  ng-class="{'ring-sidebar_active': sidebar.show}"
>
  <rg-dialog in-sidebar="true" active="sidebar.dialogIsActive"></rg-dialog>
  <div class="ring-sidebar__content" ng-transclude ng-if="!sidebar.dialogIsActive"></div>
</div>`;
