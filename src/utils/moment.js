import moment from 'moment-timezone';

moment.locale('en', {
    calendar: {
        lastDay: '[Yesterday, ]LT',
        sameDay: '[Today, ]LT',
        nextDay: '[Tomorrow, ]LT',
    },
});

export default moment;

