import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const getDayProgram = createAsyncThunk('days/getDayProgram', async (day) => {
	const response = await fetch(fetchUrl + '/day/' + day);
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
			});
	}
});

export const Days = daysSlice.reducer;
