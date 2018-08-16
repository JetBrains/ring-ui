import sayHello from './say-hello';

describe('sayHello', () => {
  const defaultName = 'World';

  it('greets World by default', () => {
    (sayHello()).should.contain(defaultName);
  });

  it('by name, when one is provided', () => {
    const name = '%username%';

    (sayHello(name)).should.contain(name);
  });
});
