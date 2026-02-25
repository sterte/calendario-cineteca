import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const getMovieDetail = createAsyncThunk('movies/getMovieDetail', async ({ categoryId, movieId, repeatId }) => {
	const response = await fetch(fetchUrl + '/movies/' + categoryId + '/' + movieId + '/' + repeatId);
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

export const fetchImdb = createAsyncThunk('movies/fetchImdb', async ({ title, year }) => {
	const autocompleteRes = await fetch('https://imdb8.p.rapidapi.com/auto-complete?q=' + title, {
		method: 'GET',
		headers: {
			'x-rapidapi-host': 'imdb8.p.rapidapi.com',
			'x-rapidapi-key': '4eac66e9b5msh32881c1535a40e0p1d8ceajsn8f74f898d71d'
		}
	});
	if (!autocompleteRes.ok) throw new Error('IMDB API error ' + autocompleteRes.status);
	const autocompleteData = await autocompleteRes.json();

	let items = autocompleteData.d.filter(el => el.l === title && (el.y && el.y === year));
	if (items.length === 0) { items = autocompleteData.d.filter(el => el.l === title && (el.y && el.y - 1 === year)); }
	if (items.length === 0) { items = autocompleteData.d.filter(el => el.l === title && (el.y && el.y + 1 === year)); }
	if (items.length === 0) { items = autocompleteData.d.filter(el => el.l === title || (el.y && el.y === year)); }
	if (items.length === 0) { items = autocompleteData.d.filter(el => el.l === title || (el.y && el.y - 1 === year)); }
	if (items.length === 0) { items = autocompleteData.d.filter(el => el.l === title || (el.y && el.y + 1 === year)); }
	const id = items[0].id;

	const detailRes = await fetch('https://imdb8.p.rapidapi.com/title/get-overview-details?tconst=' + id + '&currentCountry=IT', {
		method: 'GET',
		headers: {
			'x-rapidapi-host': 'imdb8.p.rapidapi.com',
			'x-rapidapi-key': '4eac66e9b5msh32881c1535a40e0p1d8ceajsn8f74f898d71d'
		}
	});
	if (!detailRes.ok) throw new Error('IMDB API error ' + detailRes.status);
	const data = await detailRes.json();
	return { imdbId: data.id, imdbRating: data.ratings.rating, imdbRatingCount: data.ratings.ratingCount };
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
