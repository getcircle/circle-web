import Immutable from 'immutable';
import { actionTypes } from 'redux-form';

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
        case actionTypes.RESET:
            if (action.form === form) {
                return state.merge({
                    formSubmitting: false,
                    id: undefined,
                });
            }

        case save:
            return state.merge({formSubmitting: true, id: undefined});

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
