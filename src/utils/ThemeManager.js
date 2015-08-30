import mui from 'material-ui';
import { canvasColor, tintColor } from '../constants/styles';

const ThemeManager = new mui.Styles.ThemeManager();

// Custom Theme
ThemeManager.contentFontFamily = '"Open Sans", Arial, sans-serif';
ThemeManager.setPalette({
    accent1Color: tintColor,
    canvasColor: canvasColor,
});
ThemeManager.setComponentThemes({
    appBar: {
        color: '#F7F9FA',
    },
    tab: {
        textColor: 'rgba(0, 0, 0, 0.3)',
        selectedTextColor: tintColor,
    },
    tabs: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
});

export default ThemeManager;
