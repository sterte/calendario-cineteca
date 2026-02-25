import { createSlice } from '@reduxjs/toolkit';

const trackDetailSlice = createSlice({
	name: 'trackDetail',
	initialState: { isLoading: true, errMess: null, trackDetail: {} },
	reducers: {
		trackDetailLoading(state) {
			state.isLoading = true;
			state.errMess = null;
			state.trackDetail = {};
		},
		addTrackDetail(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.trackDetail = action.payload;
		},
		trackDetailFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
			state.trackDetail = {};
		}
	}
});

export const { trackDetailLoading, addTrackDetail, trackDetailFailed } = trackDetailSlice.actions;
export const TrackDetail = trackDetailSlice.reducer;
