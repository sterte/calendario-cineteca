import { createSlice } from '@reduxjs/toolkit';

const daysSlice = createSlice({
	name: 'days',
	initialState: { isLoading: 0, errMess: null, days: [], loadingState: {} },
	reducers: {
		dayLoading(state, action) {
			const day = action.payload;
			state.loadingState[day] = 0;
			state.isLoading += 1;
			state.errMess = null;
		},
		addDay(state, action) {
			state.days.push(action.payload[0]);
			const day = action.payload[0].day;
			state.loadingState[day] = 1;
			state.isLoading -= 1;
			state.errMess = null;
		},
		dayFailed(state, action) {
			const day = action.payload;
			state.loadingState[day] = -1;
			state.isLoading -= 1;
			state.errMess = 'Failed to load ' + day;
		}
	}
});

export const { dayLoading, addDay, dayFailed } = daysSlice.actions;
export const Days = daysSlice.reducer;
