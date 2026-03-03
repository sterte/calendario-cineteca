import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';
import { logoutUser } from './auth';

const STORAGE_KEY = 'userPrefs';
const defaultPrefs = { imdbEnabled: true, letterboxdEnabled: true, letterboxdUsername: '', email: '' };

const loadFromStorage = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
};

export const fetchUserPrefs = createAsyncThunk(
    'userPrefs/fetch',
    async (_, { dispatch }) => {
        const bearer = 'Bearer ' + localStorage.getItem('token');
        const response = await fetch(fetchUrl + '/users/preferences', {
            headers: { 'Authorization': bearer }
        });
        if (response.status === 401) { dispatch(logoutUser()); throw new Error('Session expired'); }
        if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
        const data = await response.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
    },
    { condition: () => !localStorage.getItem(STORAGE_KEY) }
);

export const updateUserPrefs = createAsyncThunk('userPrefs/update', async (prefs, { getState, dispatch }) => {
    const bearer = 'Bearer ' + localStorage.getItem('token');
    const response = await fetch(fetchUrl + '/users/preferences', {
        method: 'PUT',
        body: JSON.stringify(prefs),
        headers: { 'Content-Type': 'application/json', 'Authorization': bearer }
    });
    if (response.status === 401) { dispatch(logoutUser()); throw new Error('Session expired'); }
    if (!response.ok) throw new Error('Error ' + response.status + ': ' + response.statusText);
    const updated = { ...getState().userPrefs.prefs, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
});

const cached = loadFromStorage();

const userPrefsSlice = createSlice({
    name: 'userPrefs',
    initialState: {
        isLoading: !cached,
        prefs: cached || defaultPrefs,
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
            .addCase(updateUserPrefs.fulfilled, (state, action) => {
                state.prefs = action.payload;
            })
            .addCase(updateUserPrefs.rejected, (state, action) => {
                state.errMess = action.error.message;
            })
            .addCase(logoutUser, (state) => {
                state.prefs = defaultPrefs;
                state.isLoading = true;
                state.errMess = null;
            });
    }
});

export const UserPrefsReducer = userPrefsSlice.reducer;
