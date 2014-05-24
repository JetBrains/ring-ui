// __tests__/hello-world-test.js

/* jshint ignore:start */
function sum(value1, value2) {
  return value1 + value2;
}

describe('sum', function () {
  it('adds 1 + 2 to equal 3', function () {
    expect(sum(1, 2)).toBe(3);
  });
});
/* jshint ignore:end */