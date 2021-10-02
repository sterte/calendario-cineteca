import * as ActionTypes from './ActionTypes';


export const TrackDetail = (state = {isLoading: true, errMess: null, trackDetail: {}}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_TRACK_DETAIL:			
			return {...state, isLoading: false, errMess: null, trackDetail: action.payload };

		case ActionTypes.TRACK_DETAIL_LOADING:
			return {...state, isLoading: true, errMess: null, trackDetail: {}};

		case ActionTypes.TRACK_DETAIL_FAILED:
			return {...state, isLoading: false, errMess: action.payload, trackDetail: {}};

		default:
			return state;
	}
}