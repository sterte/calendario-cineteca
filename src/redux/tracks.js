import * as ActionTypes from './ActionTypes';


export const Tracks = (state = {isLoading: true, errMess: null, tracks: []}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_TRACKS:			
			return {...state, isLoading: false, errMess: null, tracks: state.tracks.concat(action.payload) };

		case ActionTypes.TRACKS_LOADING:
			return {...state, isLoading: true, errMess: null, tracks: []};

		case ActionTypes.TRACKS_FAILED:
			return {...state, isLoading: false, errMess: action.payload, tracks: []};

		default:
			return state;
	}
}