export default class RingAngularComponent {
  static $inject = [];

  static get controller() {
    return this;
  }

  $inject = {};

  constructor(...args) {
    this.constructor.$inject.forEach((injectName, i) => {
      this.$inject[injectName] = args[i];
    });
  }
}
