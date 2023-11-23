import * as ActionTypes from './ActionTypes';


export const Days = (state = {isLoading: 0, errMess: null, days: [], loadingState: {}, durate: []}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_DAY:
			var tmpDays = [...state.days];
			tmpDays.push(action.payload[0])
			var day = action.payload[0].day;
			var tmpLoadingState = {...state.loadingState};
			tmpLoadingState[day] = 1;
			var tmpIsLoading = state.isLoading - 1;
			//var tmpDurate = action.payload[0].movies.map(el => {return {title: el.title, durata: el.durata}})
			//tmpDurate = [...state.durate, ...tmpDurate];
			return {...state, isLoading: tmpIsLoading, errMess: null, days: tmpDays, loadingState: tmpLoadingState/*, durate: tmpDurate*/}; //in ADD_DAYS payload carries the days

		case ActionTypes.DAY_LOADING:
			day = action.payload;
			tmpLoadingState = {...state.loadingState};
			tmpLoadingState[day] = 0;
			tmpIsLoading = state.isLoading + 1;
			return {...state, isLoading: tmpIsLoading, errMess: null, loadingState: tmpLoadingState}; //in DAYS_LOADING no payload is defined

		case ActionTypes.DAY_FAILED:
			day = action.payload[0].day;
			tmpLoadingState = {...state.loadingState};
			tmpLoadingState[day] = -1;
			tmpIsLoading = state.isLoading - 1;
			return {...state, isLoading: tmpIsLoading, errMess: action.payload, loadingState: tmpLoadingState}; //in DAYS_FAILED payload carries the error message

		default:
			return state;
	}
}