import * as ActionTypes from './ActionTypes';


export const Movies = (state = {isLoading: true, errMess: null, movies: [], isLoadingImdb: true, imdbId: null, imdbRating: null, imdbRatingCount: null, errMessImdb: null}, action) => {
	switch(action.type) {
		case ActionTypes.ADD_MOVIE:
			return {...state, isLoading: false, errMess: null, movies: action.payload};

		case ActionTypes.MOVIE_LOADING:
			return {...state, isLoading: true, errMess: null, movies: []};

		case ActionTypes.MOVIE_FAILED:
			return {...state, isLoading: false, errMess: action.payload, movies: []}; 

		case ActionTypes.ADD_IMDB:
			return {...state, isLoadingImdb : false, errMessImdb: null, imdbId: action.payload.imdbId, imdbRating: action.payload.imdbRating, imdbRatingCount: action.payload.imdbRatingCount }

		case ActionTypes.IMDB_LOADING:
			return {...state, isLoadingImdb : true, errMessImdb: null, imdbId: null, imdbRating: null, imdbRatingCount: null }

		case ActionTypes.IMDB_FAILED:
			return {...state, isLoadingImdb : false, errMessImdb: action.payload, imdbId: null, imdbRating: null, imdbRatingCount: null }

		default:
			return state;
	}
}