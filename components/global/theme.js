const Theme = {
  LIGHT: 'light',
  DARK: 'dark',
  DARCULA: 'darcula'
};

function applyTheme(params) {
  if (!params || !params.element || !params.currentTheme) {
    return;
  }

  if (params.prevTheme) {
    params.element.classList.remove(params.prevTheme);
  }

  params.element.classList.add(params.currentTheme);
}


export {applyTheme};
export default Theme;
