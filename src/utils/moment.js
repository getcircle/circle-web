import moment from 'moment-timezone';

moment.locale('en', {
    calendar: {
        lastDay: 'LT[, Yesterday]',
        sameDay: 'LT[, Today]',
        nextDay: 'LT[, Tomorrow]',
    },
});

export default moment;

