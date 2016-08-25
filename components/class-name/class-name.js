/**
 * @name ClassName
 * @category Utilities
 */

class ClassName {
  constructor(baseName) {
    this.setBaseName(baseName);
  }

  getClassName(element, modifier) {
    let className = this.baseName;

    if (element) {
      className += `__${element}`;
    }
    if (modifier) {
      className += `_${modifier}`;
    }

    return className;
  }

  getElement(element) {
    return this.getClassName(element);
  }

  getModifier(modifier) {
    return this.getClassName(undefined, modifier);
  }

  setBaseName(baseName) {
    this.baseName = baseName;
  }
}

export default ClassName;
