'use strict';

import mui from 'material-ui';
import colors from '../styles/colors';

const ThemeManager = new mui.Styles.ThemeManager();

// Custom Theme
ThemeManager.contentFontFamily = 'Lato,"Helvetica Neue",Roboto,Helvetica,Arial,sans-serif';
ThemeManager.setPalette({
    accent1Color: colors.tintColor,
});

export default ThemeManager;
