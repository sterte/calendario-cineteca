import * as ActionTypes from './ActionTypes';


export const Movies = (state = {isLoading: true, errMess: null, movies: []}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_MOVIE:
			return {...state, isLoading: false, errMess: null, movies: action.payload};

		case ActionTypes.MOVIE_LOADING:
			return {...state, isLoading: true, errMess: null, movies: []};

		case ActionTypes.MOVIE_FAILED:
			return {...state, isLoading: false, errMess: action.payload, movies: []}; 

		default:
			return state;
	}
}