import * as Sinon from 'sinon';
import * as Chai from 'chai';

declare global {
  const sinon: Sinon.SinonStatic;
  const sandbox: Sinon.SinonSandbox;
  const should: Chai.Should;
}
