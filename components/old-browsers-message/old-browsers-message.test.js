var OldBrowsersMessage = require('./old-browsers-message');

describe('Old browsers message', function () {
  var oldGlobalErrorHandler;

  beforeEach(function () {
    this.sinon.stub(window, 'onerror');
    oldGlobalErrorHandler = window.onerror;
  });

  it('Should call detection callback if error happend', function () {
    var onDetected = this.sinon.stub();
    OldBrowsersMessage.startOldBrowsersDectector(onDetected);

    window.onerror();

    onDetected.should.been.called;
  });

  it('Should call previous onerror handler', function () {
    var onDetected = this.sinon.stub();

    OldBrowsersMessage.startOldBrowsersDectector(onDetected);

    window.onerror();

    oldGlobalErrorHandler.should.been.called;
  });

  it('Should not call detection callback if turned off', function () {
    var onDetected = this.sinon.stub();

    OldBrowsersMessage.startOldBrowsersDectector(onDetected);

    OldBrowsersMessage.stopOldBrowsersDetector();

    window.onerror();

    onDetected.should.not.been.called;
  });

  it('Should return previous error handler back after turning off', function () {
    var onDetected = this.sinon.stub();

    OldBrowsersMessage.startOldBrowsersDectector(onDetected);

    OldBrowsersMessage.stopOldBrowsersDetector();

    window.onerror();

    oldGlobalErrorHandler.should.been.called;
  });
});
