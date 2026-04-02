import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';
import { logoutUser } from './auth';

export const getMovieDetail = createAsyncThunk('movies/getMovieDetail', async ({ categoryId, movieId, repeatId, provider: providerParam }, { getState }) => {
	const provider = providerParam || getState().provider.activeProvider;
	const endpoint = provider === 'popup'
		? fetchUrl + '/popup-movies/' + movieId
		: provider === 'ccb'
		? fetchUrl + '/ccb-movies/' + movieId
		: provider === 'galliera'
		? fetchUrl + '/galliera-movies/' + movieId
		: fetchUrl + '/movies/' + categoryId + '/' + movieId + '/' + repeatId;
	const response = await fetch(endpoint);
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

export const fetchImdb = createAsyncThunk('movies/fetchImdb', async ({ title, year, repeatId }, { dispatch }) => {
	const res = await fetch(fetchUrl + '/imdb?title=' + encodeURIComponent(title) + '&year=' + year, {
		headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
	});
	if (res.status === 401) { dispatch(logoutUser()); throw new Error('Session expired'); }
	if (!res.ok) throw new Error('IMDB API error ' + res.status);
	return res.json();
});

const moviesSlice = createSlice({
	name: 'movies',
	initialState: { movieCache: {} },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getMovieDetail.pending, (state, action) => {
				const { repeatId } = action.meta.arg;
				state.movieCache[repeatId] = { isLoading: true, errMess: null, movies: null, isLoadingImdb: false, imdbId: null, imdbRating: null, imdbRatingCount: null, errMessImdb: null };
			})
			.addCase(getMovieDetail.fulfilled, (state, action) => {
				const { repeatId } = action.meta.arg;
				const prev = state.movieCache[repeatId] || {};
				state.movieCache[repeatId] = { ...prev, isLoading: false, movies: action.payload };
			})
			.addCase(getMovieDetail.rejected, (state, action) => {
				const { repeatId } = action.meta.arg;
				const prev = state.movieCache[repeatId] || {};
				state.movieCache[repeatId] = { ...prev, isLoading: false, errMess: action.error.message, movies: null };
			})
			.addCase(fetchImdb.pending, (state, action) => {
				const { repeatId } = action.meta.arg;
				const prev = state.movieCache[repeatId] || {};
				state.movieCache[repeatId] = { ...prev, isLoadingImdb: true, errMessImdb: null, imdbId: null, imdbRating: null, imdbRatingCount: null };
			})
			.addCase(fetchImdb.fulfilled, (state, action) => {
				const { repeatId } = action.meta.arg;
				const prev = state.movieCache[repeatId] || {};
				state.movieCache[repeatId] = { ...prev, isLoadingImdb: false, imdbId: action.payload.imdbId, imdbRating: action.payload.imdbRating, imdbRatingCount: action.payload.imdbRatingCount };
			})
			.addCase(fetchImdb.rejected, (state, action) => {
				const { repeatId } = action.meta.arg;
				const prev = state.movieCache[repeatId] || {};
				state.movieCache[repeatId] = { ...prev, isLoadingImdb: false, errMessImdb: action.error.message, imdbId: null, imdbRating: 0, imdbRatingCount: -1 };
			});
	}
});

export const Movies = moviesSlice.reducer;
