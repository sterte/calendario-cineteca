import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';

export const fetchUserPrefs = createAsyncThunk('userPrefs/fetch', async () => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const response = await fetch(fetchUrl + '/users/preferences', {
        headers: { 'Authorization': bearer }
    });
    if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
    return response.json();
});

export const updateUserPrefs = createAsyncThunk('userPrefs/update', async (prefs, { dispatch }) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const response = await fetch(fetchUrl + '/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(prefs),
        headers: { 'Content-Type': 'application/json', 'Authorization': bearer }
    });
    if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
    await response.json();
    dispatch(fetchUserPrefs());
});

const userPrefsSlice = createSlice({
    name: 'userPrefs',
    initialState: {
        isLoading: true,
        prefs: { imdbEnabled: true, letterboxdEnabled: true, letterboxdUsername: '', email: '' },
        errMess: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPrefs.pending, (state) => {
                state.isLoading = true;
                state.errMess = null;
            })
            .addCase(fetchUserPrefs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.prefs = action.payload;
            })
            .addCase(fetchUserPrefs.rejected, (state, action) => {
                state.isLoading = false;
                state.errMess = action.error.message;
            })
            .addCase(updateUserPrefs.rejected, (state, action) => {
                state.errMess = action.error.message;
            });
    }
});

export const UserPrefsReducer = userPrefsSlice.reducer;
