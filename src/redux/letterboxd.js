import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUrl } from '../shared/baseUrl';
import { getMovieDetail } from './movies';
import { logoutUser } from './auth';

export const fetchLetterboxdFilm = createAsyncThunk('letterboxd/fetchFilm', async ({ title, year }, { dispatch }) => {
    const res = await fetch(fetchUrl + '/letterboxd/film?title=' + encodeURIComponent(title) + '&year=' + year, {
        headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
    });
    if (res.status === 401) { dispatch(logoutUser()); throw new Error('Session expired'); }
    if (!res.ok) throw new Error('Letterboxd API error ' + res.status);
    return res.json();
});

export const fetchLetterboxdWatchlist = createAsyncThunk('letterboxd/fetchWatchlist', async ({ filmSlug, username }, { dispatch }) => {
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
    initialState: {
        isLoadingFilm: false,
        lbSlug: null,
        lbRating: null,
        lbUrl: null,
        errMess: null,
        isLoadingWatchlist: false,
        watchlistChecked: false,
        inWatchlist: false,
        errMessWatchlist: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMovieDetail.pending, (state) => {
                state.isLoadingFilm = false;
                state.lbSlug = null;
                state.lbRating = null;
                state.lbUrl = null;
                state.errMess = null;
                state.isLoadingWatchlist = false;
                state.watchlistChecked = false;
                state.inWatchlist = false;
                state.errMessWatchlist = null;
            })
            .addCase(fetchLetterboxdFilm.pending, (state) => {
                state.isLoadingFilm = true;
                state.lbSlug = null;
                state.lbRating = null;
                state.lbUrl = null;
                state.errMess = null;
            })
            .addCase(fetchLetterboxdFilm.fulfilled, (state, action) => {
                state.isLoadingFilm = false;
                state.lbSlug = action.payload.lbSlug;
                state.lbRating = action.payload.lbRating;
                state.lbUrl = action.payload.lbUrl;
            })
            .addCase(fetchLetterboxdFilm.rejected, (state, action) => {
                state.isLoadingFilm = false;
                state.errMess = action.error.message;
            })
            .addCase(fetchLetterboxdWatchlist.pending, (state) => {
                state.isLoadingWatchlist = true;
                state.watchlistChecked = true;
                state.inWatchlist = false;
                state.errMessWatchlist = null;
            })
            .addCase(fetchLetterboxdWatchlist.fulfilled, (state, action) => {
                state.isLoadingWatchlist = false;
                state.inWatchlist = action.payload;
            })
            .addCase(fetchLetterboxdWatchlist.rejected, (state, action) => {
                state.isLoadingWatchlist = false;
                state.errMessWatchlist = action.error.message;
            });
    }
});

export const LetterboxdReducer = letterboxdSlice.reducer;
