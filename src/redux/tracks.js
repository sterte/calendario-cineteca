import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const getTracks = createAsyncThunk('tracks/getTracks', async () => {
	const response = await fetch(fetchUrl + '/tracks');
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

const tracksSlice = createSlice({
	name: 'tracks',
	initialState: { isLoading: true, errMess: null, tracks: [] },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getTracks.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
				state.tracks = [];
			})
			.addCase(getTracks.fulfilled, (state, action) => {
				state.isLoading = false;
				state.tracks = action.payload;
			})
			.addCase(getTracks.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			});
	}
});

export const Tracks = tracksSlice.reducer;
