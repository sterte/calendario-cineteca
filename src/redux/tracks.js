import { createSlice } from '@reduxjs/toolkit';

const tracksSlice = createSlice({
	name: 'tracks',
	initialState: { isLoading: true, errMess: null, tracks: [] },
	reducers: {
		tracksLoading(state) {
			state.isLoading = true;
			state.errMess = null;
			state.tracks = [];
		},
		addTracks(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.tracks = action.payload;
		},
		tracksFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
			state.tracks = [];
		}
	}
});

export const { tracksLoading, addTracks, tracksFailed } = tracksSlice.actions;
export const Tracks = tracksSlice.reducer;
