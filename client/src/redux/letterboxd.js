import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';
import { getMovieDetail } from './movies';
import { logoutUser } from './auth';

const DEFAULT_LB_STATE = {
    isLoadingFilm: false, lbSlug: null, lbRating: null, lbUrl: null, errMess: null,
    isLoadingWatchlist: false, watchlistChecked: false, inWatchlist: false, errMessWatchlist: null
};

export const fetchLetterboxdFilm = createAsyncThunk('letterboxd/fetchFilm', async ({ title, year, repeatId }, { dispatch }) => {
    const res = await fetch(fetchUrl + '/letterboxd/film?title=' + encodeURIComponent(title) + '&year=' + year, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if (res.status === 401) { dispatch(logoutUser()); throw new Error('Session expired'); }
    if (!res.ok) throw new Error('Letterboxd API error ' + res.status);
    return res.json();
});

export const fetchLetterboxdWatchlist = createAsyncThunk('letterboxd/fetchWatchlist', async ({ filmSlug, username, repeatId }, { dispatch }) => {
    const res = await fetch(
        fetchUrl + '/letterboxd/watchlist?username=' + encodeURIComponent(username) + '&filmSlug=' + encodeURIComponent(filmSlug),
        { headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') } }
    );
    if (res.status === 401) { dispatch(logoutUser()); throw new Error('Session expired'); }
    if (!res.ok) throw new Error('Letterboxd watchlist error ' + res.status);
    const data = await res.json();
    return data.inWatchlist;
});

const letterboxdSlice = createSlice({
    name: 'letterboxd',
    initialState: { filmCache: {} },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMovieDetail.pending, (state, action) => {
                const { repeatId } = action.meta.arg;
                state.filmCache[repeatId] = { ...DEFAULT_LB_STATE };
            })
            .addCase(fetchLetterboxdFilm.pending, (state, action) => {
                const { repeatId } = action.meta.arg;
                const prev = state.filmCache[repeatId] || {};
                state.filmCache[repeatId] = { ...prev, isLoadingFilm: true, lbSlug: null, lbRating: null, lbUrl: null, errMess: null };
            })
            .addCase(fetchLetterboxdFilm.fulfilled, (state, action) => {
                const { repeatId } = action.meta.arg;
                const prev = state.filmCache[repeatId] || {};
                state.filmCache[repeatId] = { ...prev, isLoadingFilm: false, lbSlug: action.payload.lbSlug, lbRating: action.payload.lbRating, lbUrl: action.payload.lbUrl };
            })
            .addCase(fetchLetterboxdFilm.rejected, (state, action) => {
                const { repeatId } = action.meta.arg;
                const prev = state.filmCache[repeatId] || {};
                state.filmCache[repeatId] = { ...prev, isLoadingFilm: false, errMess: action.error.message };
            })
            .addCase(fetchLetterboxdWatchlist.pending, (state, action) => {
                const { repeatId } = action.meta.arg;
                const prev = state.filmCache[repeatId] || {};
                state.filmCache[repeatId] = { ...prev, isLoadingWatchlist: true, watchlistChecked: true, inWatchlist: false, errMessWatchlist: null };
            })
            .addCase(fetchLetterboxdWatchlist.fulfilled, (state, action) => {
                const { repeatId } = action.meta.arg;
                const prev = state.filmCache[repeatId] || {};
                state.filmCache[repeatId] = { ...prev, isLoadingWatchlist: false, inWatchlist: action.payload };
            })
            .addCase(fetchLetterboxdWatchlist.rejected, (state, action) => {
                const { repeatId } = action.meta.arg;
                const prev = state.filmCache[repeatId] || {};
                state.filmCache[repeatId] = { ...prev, isLoadingWatchlist: false, errMessWatchlist: action.error.message };
            });
    }
});

export const LetterboxdReducer = letterboxdSlice.reducer;
