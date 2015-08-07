export default function logger({dispatch, getState}) {
    return next => action => {
        console.log(action);
        next(action);
    }
}
