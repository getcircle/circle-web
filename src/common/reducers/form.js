import Immutable from 'immutable';

import { RESET_FORM } from '../constants/actionTypes';

const initialState = Immutable.fromJS({
    formSubmitting: false,
    id: undefined,
    modalVisible: false,
});

export default function form(types) {
    const {
        form,
        save,
        saveFailure,
        saveSuccess,
        showModal,
        hideModal,
    } = types;

    return function reducer(state = initialState, action) {
        switch(action.type) {
        case RESET_FORM:
            if (action.form === form) {
                return state.merge({
                    formSubmitting: false,
                    id: undefined,
                });
            }

        case save:
            return state.merge({formSubmitting: true});

        case saveSuccess:
            return state.merge({
                id: action.payload.result,
                formSubmitting: false,
                modalVisible: false,
            });

        case saveFailure:
            return state.merge({formSubmitting: false});

        case showModal:
            return state.merge({modalVisible: true});

        case hideModal:
            return state.merge({modalVisible: false});

        default:
            return state;
        }
    };
};
