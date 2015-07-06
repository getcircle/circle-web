'use strict';

import mui from 'material-ui';
import constants from '../styles/constants';

const ThemeManager = new mui.Styles.ThemeManager();

// Custom Theme
ThemeManager.contentFontFamily = 'Lato,"Helvetica Neue",Roboto,Helvetica,Arial,sans-serif';
ThemeManager.setPalette({
    accent1Color: constants.colors.tintColor,
});

export default ThemeManager;
