import * as ActionTypes from './ActionTypes';


export const Charachters = (state = {isLoading: false, errMess: null, charachters: []}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_CHARACHTERS:
			return {...state, isLoading: false, errMess: null, charachters: action.payload}; 

		case ActionTypes.CHARACHTERS_LOADING:
			return {...state, isLoading: true, errMess: null, charachters: []}; 

		case ActionTypes.CHARACHTERS_FAILED:
			return {...state, isLoading: false, errMess: action.payload, charachters: []}; 

		default:
			return state;
	}
}