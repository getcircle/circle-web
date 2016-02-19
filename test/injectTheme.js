import stubContext from 'react-stub-context';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import lightBaseTheme from 'material-ui/lib/styles/baseThemes/lightBaseTheme';

function injectTheme(Component, theme) {
  let injectedTheme = theme || ThemeManager.getMuiTheme(lightBaseTheme);
  return stubContext(Component, {muiTheme: injectedTheme});
}

module.exports = injectTheme;
