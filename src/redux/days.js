import * as ActionTypes from './ActionTypes';


export const Days = (state = {isLoading: true, errMess: null, days: []}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_DAY:
			return {...state, isLoading: false, errMess: null, days: action.payload}; //in ADD_DAYS payload carries the days

		case ActionTypes.DAY_LOADING:
			return {...state, isLoading: true, errMess: null, days: []}; //in DAYS_LOADING no payload is defined

		case ActionTypes.DAY_FAILED:
			return {...state, isLoading: false, errMess: action.payload, days: []}; //in DAYS_FAILED payload carries the error message

		default:
			return state;
	}
}