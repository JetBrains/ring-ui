/* eslint-disable */
const {test, describe} = require('node:test');
const assert = require('node:assert/strict');

const {DependencyGraph} = require('./css-plugin-dependencies');

describe('DependencyGraph', () => {
  test('should handle a simple dependency chain', () => {
    const graph = new DependencyGraph();
    graph.addDependency('A', 'B');
    graph.addDependency('B', 'C');

    const result = graph.topologicalSort();
    assert.deepEqual(result, ['C', 'B', 'A']);
  });

  test('should handle multiple dependencies', () => {
    const graph = new DependencyGraph();
    graph.addDependency('A', 'B');
    graph.addDependency('A', 'C');
    graph.addDependency('B', 'D');
    graph.addDependency('C', 'D');

    const result = graph.topologicalSort();
    assert.deepEqual(result, ['D', 'B', 'C', 'A']);
  });

  test('should handle complex dependencies', () => {
    const graph = new DependencyGraph();
    graph.addDependency('A', 'B');
    graph.addDependency('B', 'C');
    graph.addDependency('C', 'D');
    graph.addDependency('A', 'D');
    graph.addDependency('E', 'A');
    graph.addDependency('E', 'D');

    const result = graph.topologicalSort();
    assert.deepEqual(result, ['D', 'C', 'B', 'A', 'E']);
  });

  test('should crash on circular dependencies', () => {
    const graph = new DependencyGraph();
    graph.addDependency('A', 'B');
    graph.addDependency('B', 'C');
    graph.addDependency('C', 'A');

    const callFn = () => graph.topologicalSort();
    assert.throws(callFn, /Circular dependency detected/);
  });

  test('should handle independent modules', () => {
    const graph = new DependencyGraph();
    graph.addDependency('A', 'B');
    graph.addDependency('C', 'D');
    graph.addDependency('E', 'F');

    const result = graph.topologicalSort();
    assert.equal(result.length, 6);
    assert.ok(result.indexOf('A') > result.indexOf('B'));
    assert.ok(result.indexOf('C') > result.indexOf('D'));
    assert.ok(result.indexOf('E') > result.indexOf('F'));
  });

  test('should handle a large number of dependencies', () => {
    const graph = new DependencyGraph();
    for (let i = 0; i < 1000; i++) {
      graph.addDependency(`M${i}`, `M${i + 1}`);
    }

    const result = graph.topologicalSort();
    assert.equal(result.length, 1001);
    for (let i = 0; i < 1000; i++) {
      assert.ok(result.indexOf(`M${i}`) > result.indexOf(`M${i + 1}`));
    }
  });

  test('should handle modules with no dependencies', () => {
    const graph = new DependencyGraph();
    graph.addDependency('A', 'B');
    graph.addDependency('C', 'D');
    graph.addDependency('E', 'F');
    graph.addDependency('G', 'H');

    const result = graph.topologicalSort();
    assert.equal(result.length, 8);
    assert.ok(result.indexOf('A') > result.indexOf('B'));
    assert.ok(result.indexOf('C') > result.indexOf('D'));
    assert.ok(result.indexOf('E') > result.indexOf('F'));
    assert.ok(result.indexOf('G') > result.indexOf('H'));
  });
});
