import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const fetchCharachters = createAsyncThunk('charachters/fetchCharachters', async () => {
	const bearer = 'Bearer ' + localStorage.getItem('token');
	const response = await fetch(fetchUrl + '/chat/charachters', {
		method: 'GET',
		headers: { 'Authorization': bearer, 'Content-Type': 'application/json' }
	});
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

const charachtersSlice = createSlice({
	name: 'charachters',
	initialState: { isLoading: false, errMess: null, charachters: [] },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchCharachters.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
				state.charachters = [];
			})
			.addCase(fetchCharachters.fulfilled, (state, action) => {
				state.isLoading = false;
				state.charachters = action.payload;
			})
			.addCase(fetchCharachters.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			});
	}
});

export const Charachters = charachtersSlice.reducer;
