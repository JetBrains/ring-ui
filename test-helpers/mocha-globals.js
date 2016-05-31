beforeEach(function createSandbox() {
  this.sinon = sinon.sandbox.create();
});

afterEach(function restoreSandbox() {
  this.sinon.restore();
});
