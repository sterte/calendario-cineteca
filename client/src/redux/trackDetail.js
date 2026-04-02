import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const getTrackDetail = createAsyncThunk('trackDetail/getTrackDetail', async (trackId, { getState }) => {
	const provider = getState().provider.activeProvider;
	const endpoint = provider === 'ccb'
		? fetchUrl + '/ccb-tracks/' + trackId
		: fetchUrl + '/tracks/' + trackId;
	const response = await fetch(endpoint);
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

const trackDetailSlice = createSlice({
	name: 'trackDetail',
	initialState: { isLoading: true, errMess: null, trackDetail: {} },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getTrackDetail.pending, (state) => {
				state.isLoading = true;
				state.errMess = null;
				state.trackDetail = {};
			})
			.addCase(getTrackDetail.fulfilled, (state, action) => {
				state.isLoading = false;
				state.trackDetail = action.payload;
			})
			.addCase(getTrackDetail.rejected, (state, action) => {
				state.isLoading = false;
				state.errMess = action.error.message;
			});
	}
});

export const TrackDetail = trackDetailSlice.reducer;
