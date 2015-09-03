import 'babel/polyfill';
import reactMixin from 'react-mixin';
import Mixin from 'mixin/mixin';

export default function mixinDecorate(mixin) {
  if (!Mixin.isPrototypeOf(mixin)) {
    throw new Error('A mixin should be a descendant of the Mixin class');
  }

  return function decorator(target) {
    let proto = {};

    Reflect.ownKeys(mixin.prototype).forEach(key => {
      if (key !== 'constructor') {
        target['__mixins__'] = target['__mixins__'] || {};
        target['__mixins__'][key] = target['__mixins__'][key] || [];
        target['__mixins__'][key].push(mixin);

        proto[key] = mixin.prototype[key];
      }
    });

    reactMixin.onClass(target, proto);
  }
}
