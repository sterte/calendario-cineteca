import { createSlice } from '@reduxjs/toolkit';

const charachtersSlice = createSlice({
	name: 'charachters',
	initialState: { isLoading: false, errMess: null, charachters: [] },
	reducers: {
		charachtersLoading(state) {
			state.isLoading = true;
			state.errMess = null;
			state.charachters = [];
		},
		addCharachters(state, action) {
			state.isLoading = false;
			state.errMess = null;
			state.charachters = action.payload;
		},
		charachtersFailed(state, action) {
			state.isLoading = false;
			state.errMess = action.payload;
			state.charachters = [];
		}
	}
});

export const { charachtersLoading, addCharachters, charachtersFailed } = charachtersSlice.actions;
export const Charachters = charachtersSlice.reducer;
