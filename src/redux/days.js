import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';
import { setProvider } from './provider';

export const getDayProgram = createAsyncThunk('days/getDayProgram', async (day, { getState }) => {
	const provider = getState().provider.activeProvider;
	const endpoint = provider === 'ccb' ? '/ccb-day/' + day
		: provider === 'popup' ? '/popup-day/' + day
		: '/day/' + day;
	const response = await fetch(fetchUrl + endpoint);
	if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
	return response.json();
});

const daysSlice = createSlice({
	name: 'days',
	initialState: { isLoading: 0, errMess: null, days: [], loadingState: {} },
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getDayProgram.pending, (state, action) => {
				const day = action.meta.arg;
				state.loadingState[day] = 0;
				state.isLoading += 1;
				state.errMess = null;
			})
			.addCase(getDayProgram.fulfilled, (state, action) => {
				state.days.push(action.payload[0]);
				const day = action.payload[0].day;
				state.loadingState[day] = 1;
				state.isLoading -= 1;
				state.errMess = null;
			})
			.addCase(getDayProgram.rejected, (state, action) => {
				const day = action.meta.arg;
				state.loadingState[day] = -1;
				state.isLoading -= 1;
				state.errMess = action.error.message;
			})
			// Clear cache when provider switches so new data is fetched
			.addCase(setProvider, (state) => {
				state.days = [];
				state.loadingState = {};
				state.isLoading = 0;
				state.errMess = null;
			});
	}
});

export const Days = daysSlice.reducer;
