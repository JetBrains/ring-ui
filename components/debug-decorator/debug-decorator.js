import 'babel/polyfill';

export default function debugDecorate(target) {
  let keys = Reflect.ownKeys(target).map(key => ({ obj: target, key: key }));

  let proto = target.prototype;
  while (proto) {
    // don't touch the Object.prototype
    if (!Object.getPrototypeOf(proto)) break;

    Reflect.ownKeys(proto).forEach(key => key !== 'constructor' && keys.push({ obj: proto, key: key }));
    proto = Object.getPrototypeOf(proto);
  }

  keys.forEach(({ obj, key }) => {
    let descriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (typeof descriptor.value === 'function') {
      obj[key] = function (...args) {
        let message = '';

        // a static method
        if (obj === target) {
          message = `${target.name}.${key}`;

        // own prototype method
        } else if (this.constructor === obj.constructor) {
          message = `${this.constructor.name}.prototype.${key}`;

        // inherited prototype method (check if a method has been invoked on the target class)
        } else if (this.constructor === target) {
          message = `${this.constructor.name}.prototype.${key} (inherited from ${obj.constructor.name})`;
        }

        let result = this::descriptor.value(...args);

        if (message) {
          console.info(message, [...args], '=>', result);
        }

        return result;
      };
    }
  });
}
