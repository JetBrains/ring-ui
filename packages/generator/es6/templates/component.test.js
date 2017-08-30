import <%= pascalCaseName %> from './<%= paramCaseName %>';

describe('<%= titleCaseName %>', () => {
  const createInstance = params => new <%= pascalCaseName %>(params);

  it('should create instance', () => {
    createInstance().should.be.instanceof(<%= pascalCaseName %>);
  });

  // TODO Add more tests
});
