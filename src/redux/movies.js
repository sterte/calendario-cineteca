import { createSlice } from '@reduxjs/toolkit';

const moviesSlice = createSlice({
	name: 'movies',
	initialState: { isLoading: true, errMess: null, movies: [], isLoadingImdb: true, imdbId: null, imdbRating: null, imdbRatingCount: null, errMessImdb: null },
	reducers: {
		movieLoading(state) {
			state.isLoading = true;
			state.errMess = null;
			state.movies = [];
		},
		addMovie(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.movies = action.payload;
		},
		movieFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
			state.movies = [];
		},
		imdbLoading(state) {
			state.isLoadingImdb = true;
			state.errMessImdb = null;
			state.imdbId = null;
			state.imdbRating = null;
			state.imdbRatingCount = null;
		},
		addImdb(state, action) {
			state.isLoadingImdb = false;
			state.errMessImdb = null;
			state.imdbId = action.payload.imdbId;
			state.imdbRating = action.payload.imdbRating;
			state.imdbRatingCount = action.payload.imdbRatingCount;
		},
		imdbFailed(state, action) {
			state.isLoadingImdb = false;
			state.errMessImdb = action.payload;
			state.imdbId = null;
			state.imdbRating = 0;
			state.imdbRatingCount = -1;
		}
	}
});

export const { movieLoading, addMovie, movieFailed, imdbLoading, addImdb, imdbFailed } = moviesSlice.actions;
export const Movies = moviesSlice.reducer;
