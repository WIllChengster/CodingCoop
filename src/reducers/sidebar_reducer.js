import types from '../actions/types';

const DEFAULT_STATE = {
    toggle: false
}

export default (state= DEFAULT_STATE, action) => {
    switch(action.type){
        case types.SIDEBAR_ON:
            return {...state, toggle: true};

        case types.SIDEBAR_OFF:
            return{...state, toggle: false};
        default:
            return state;
    }

}