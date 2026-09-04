const getViewportSize = () => ({
  width: document.documentElement.clientWidth || window.innerWidth,
  height: document.documentElement.clientHeight || window.innerHeight,
});

export default getViewportSize;
