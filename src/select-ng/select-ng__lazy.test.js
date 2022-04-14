import SelectLazy from './select-ng__lazy';

describe('Select Lazy', () => {


  let containerNode;
  let ctrl;
  beforeEach(() => {
    containerNode = document.createElement('div');
    ctrl = {};
  });


  it('should create lazy select', () => {
    const lazySelect = renderLazySelect();
    lazySelect.should.not.be.undefined;
  });


  it('should render static markup', () => {
    renderLazySelect();
    should.exist(findSelectNode(containerNode));
  });


  it('should render react select on click', () => {
    const lazySelect = renderLazySelect();
    simulateClick(lazySelect);
    ctrl.selectInstance.should.not.be.undefined;
  });


  it('should detach lazy select after render', () => {
    const lazySelect = renderLazySelect();
    sandbox.spy(lazySelect, '_clickHandler');

    simulateClick(lazySelect);
    simulateClick(lazySelect);
    simulateClick(lazySelect);

    lazySelect._clickHandler.should.be.calledOnce;
  });


  it('should not render markup for select dropdown', () => {
    renderDropdownSelect();
    should.not.exist(findSelectNode(containerNode));
  });


  it('should render select dropdown on click', () => {
    const lazySelect = renderDropdownSelect();
    simulateClick(lazySelect);
    should.exist(ctrl.selectInstance);
  });


  function simulateClick(select) {
    const clickEvent = new CustomEvent('click');
    select.container.dispatchEvent(clickEvent);
  }


  function renderDropdownSelect() {
    return renderLazySelect('dropdown');
  }


  function renderLazySelect(type = 'button') {
    const lazySelect = new SelectLazy(containerNode, {}, ctrl, type, instance => {
      ctrl.selectInstance = instance;
    });
    lazySelect.render();
    return lazySelect;
  }


  function findSelectNode(container) {
    return container.querySelector('[data-test="ring-select"]');
  }
});
