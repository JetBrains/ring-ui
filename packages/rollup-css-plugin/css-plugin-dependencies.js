const MAX_PASSES = 999999;

class DependencyGraph {
  constructor() {
    this.graph = new Map();
  }

  addDependency(module, dependency) {
    if (!this.graph.has(module)) {
      this.graph.set(module, new Set());
    }
    this.graph.get(module).add(dependency);

    // Ensure the dependency is in the graph
    if (!this.graph.has(dependency)) {
      this.graph.set(dependency, new Set());
    }
  }

  /*
  It then iterates through the order, checking each module's dependencies.
  If a dependency is found after the current module, it's moved to just before the current module.
  This process repeats until no more reordering is needed.
   */
  // eslint-disable-next-line complexity
  topologicalSort() {
    const order = this.initialTopologicalSort();
    let reordered;
    let counter = 0;

    do {
      reordered = false;
      if (counter++ > MAX_PASSES) {
        throw new Error('Circular dependency detected');
      }
      for (let i = 0; i < order.length; i++) {
        const module = order[i];
        const dependencies = this.graph.get(module) || new Set();

        for (const dependency of dependencies) {
          const dependencyIndex = order.indexOf(dependency);
          if (dependencyIndex > i) {
            // Dependency is after the current module, need to move it
            order.splice(dependencyIndex, 1);
            order.splice(i, 0, dependency);
            reordered = true;
            break; // Start over with the new order
          }
        }

        if (reordered) break;
      }
    } while (reordered);

    return order;
  }

  // Initial topological sort using DFS
  initialTopologicalSort() {
    const visited = new Set();
    const stack = [];

    const dfs = node => {
      visited.add(node);

      const dependencies = this.graph.get(node) || new Set();
      for (const dependency of dependencies) {
        if (!visited.has(dependency)) {
          dfs(dependency);
        }
      }

      stack.push(node);
    };

    for (const node of this.graph.keys()) {
      if (!visited.has(node)) {
        dfs(node);
      }
    }

    return stack.reverse();
  }
}

module.exports = {DependencyGraph};
