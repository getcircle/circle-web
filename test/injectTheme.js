import stubContext from 'react-stub-context';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import DefaultRawTheme from 'material-ui/lib/styles/raw-themes/light-raw-theme';

function injectTheme(Component, theme) {
  let injectedTheme = theme || ThemeManager.getMuiTheme(DefaultRawTheme);
  return stubContext(Component, {muiTheme: injectedTheme});
}

module.exports = injectTheme;
