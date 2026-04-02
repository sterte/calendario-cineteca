import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const fetchFavourites = createAsyncThunk('favourites/fetchFavourites', async () => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/favourites', {
		headers: { 'Authorization': bearer }
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

export const addFavourite = createAsyncThunk('favourites/addFavourite', async (fav, { dispatch }) => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/favourites/', {
		method: 'POST',
		body: JSON.stringify(fav),
		headers: { 'Content-Type': 'application/json', 'Authorization': bearer },
		credentials: 'same-origin'
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	await response.json();
	dispatch(fetchFavourites());
});

export const editFavourite = createAsyncThunk('favourites/editFavourite', async (fav, { dispatch }) => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/favourites/' + fav.id, {
		method: 'PUT',
		body: JSON.stringify(fav),
		headers: { 'Content-Type': 'application/json', 'Authorization': bearer },
		credentials: 'same-origin'
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	await response.json();
	dispatch(fetchFavourites());
});

export const deleteFavourite = createAsyncThunk('favourites/deleteFavourite', async (id, { dispatch }) => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/favourites/' + id, {
		method: 'DELETE',
		headers: { 'Authorization': bearer },
		credentials: 'same-origin'
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	await response.json();
	dispatch(fetchFavourites());
});

const favouritesSlice = createSlice({
	name: 'favourites',
	initialState: { isLoading: true, errMess: null, favourites: [] },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFavourites.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
			})
			.addCase(fetchFavourites.fulfilled, (state, action) => {
				state.isLoading = false;
				state.favourites = action.payload;
			})
			.addCase(fetchFavourites.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			})
			.addCase(addFavourite.rejected, (state, action) => {
				state.errMess = action.error.message;
			})
			.addCase(editFavourite.rejected, (state, action) => {
				state.errMess = action.error.message;
			})
			.addCase(deleteFavourite.rejected, (state, action) => {
				state.errMess = action.error.message;
			});
	}
});

export const Favourites = favouritesSlice.reducer;
