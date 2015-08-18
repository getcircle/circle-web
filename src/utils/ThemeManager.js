import mui from 'material-ui';
import constants from '../styles/constants';

const ThemeManager = new mui.Styles.ThemeManager();

// Custom Theme
ThemeManager.contentFontFamily = '"Open Sans", Arial, sans-serif';
ThemeManager.setPalette({
    accent1Color: constants.colors.tintColor,
});

export default ThemeManager;
