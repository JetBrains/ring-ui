import 'babel/polyfill';

export default function debugDecorate(target) {
  let keys = Reflect.ownKeys(target).map(key => ({ obj: target, key: key }));

  let proto = target.prototype;
  while (proto) {
    // don't touch Object.prorotype
    if (!Object.getPrototypeOf(proto)) break;

    Reflect.ownKeys(proto).forEach(key => key !== 'constructor' && keys.push({ obj: proto, key: key }));
    proto = Object.getPrototypeOf(proto);
  }

  keys.forEach(({ obj, key }) => {
    let descriptor = Object.getOwnPropertyDescriptor(obj, key);

    if (typeof descriptor.value === 'function') {
      obj[key] = function (...args) {
        // static method
        if (obj === target) {
          console.info(`${target.name}.${key}`, [...args]);

        // own prorotype method
        } else if (this.constructor === obj.constructor) {
          // check if a method has been mixed with Mixin
          let mixins = (this.constructor.__mixins__ && this.constructor.__mixins__[key]) || [];

          if (mixins.length) {
            console.info(`${this.constructor.name}.prototype.${key} (mixed with ${mixins.map(mixin => mixin.name).join()})`, [...args]);
          } else {
            console.info(`${this.constructor.name}.prototype.${key}`, [...args]);
          }

        // inherited prorotype method (check if a method has been invoked on the target class)
        } else if (this.constructor === target) {
          console.info(`${this.constructor.name}.prototype.${key} (inherited from ${obj.constructor.name})`, [...args]);
        }

        return this::descriptor.value(...args);
      };
    }
  });
}
