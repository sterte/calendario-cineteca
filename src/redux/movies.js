import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const getMovieDetail = createAsyncThunk('movies/getMovieDetail', async ({ categoryId, movieId, repeatId, provider: providerParam }, { getState }) => {
	const provider = providerParam || getState().provider.activeProvider;
	const endpoint = provider === 'popup'
		? fetchUrl + '/popup-movies/' + movieId
		: provider === 'ccb'
		? fetchUrl + '/ccb-movies/' + movieId
		: fetchUrl + '/movies/' + categoryId + '/' + movieId + '/' + repeatId;
	const response = await fetch(endpoint);
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

export const fetchImdb = createAsyncThunk('movies/fetchImdb', async ({ title, year }) => {
	const res = await fetch(fetchUrl + '/imdb?title=' + encodeURIComponent(title) + '&year=' + year, {
		headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
	});
	if (!res.ok) throw new Error('IMDB API error ' + res.status);
	return res.json();
});

const moviesSlice = createSlice({
	name: 'movies',
	initialState: { isLoading: true, errMess: null, movies: [], isLoadingImdb: true, imdbId: null, imdbRating: null, imdbRatingCount: null, errMessImdb: null },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getMovieDetail.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
				state.movies = [];
				state.isLoadingImdb = false;
				state.imdbId = null;
				state.imdbRating = null;
				state.imdbRatingCount = null;
				state.errMessImdb = null;
			})
			.addCase(getMovieDetail.fulfilled, (state, action) => {
				state.isLoading = false;
				state.movies = action.payload;
			})
			.addCase(getMovieDetail.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
				state.movies = [];
			})
			.addCase(fetchImdb.pending, (state) => {
				state.isLoadingImdb = true;
				state.errMessImdb = null;
				state.imdbId = null;
				state.imdbRating = null;
				state.imdbRatingCount = null;
			})
			.addCase(fetchImdb.fulfilled, (state, action) => {
				state.isLoadingImdb = false;
				state.imdbId = action.payload.imdbId;
				state.imdbRating = action.payload.imdbRating;
				state.imdbRatingCount = action.payload.imdbRatingCount;
			})
			.addCase(fetchImdb.rejected, (state, action) => {
				state.isLoadingImdb = false;
				state.errMessImdb = action.error.message;
				state.imdbId = null;
				state.imdbRating = 0;
				state.imdbRatingCount = -1;
			});
	}
});

export const Movies = moviesSlice.reducer;
