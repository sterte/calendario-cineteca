import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LETTERBOXD_HOST, RAPIDAPI_KEY } from '../shared/letterboxdConstants';
import { getMovieDetail } from './movies';

const LB_HEADERS = {
    'x-rapidapi-host': LETTERBOXD_HOST,
    'x-rapidapi-key': RAPIDAPI_KEY
};

export const fetchLetterboxdFilm = createAsyncThunk('letterboxd/fetchFilm', async ({ title, year }) => {
    const res = await fetch(`https://${LETTERBOXD_HOST}/api/letterboxd/search?input=${encodeURIComponent(title)}`, {
        headers: LB_HEADERS
    });
    if (!res.ok) throw new Error('Letterboxd API error ' + res.status);
    const data = await res.json();
    console.log('[LB search]', JSON.stringify(data).slice(0, 800));

    const searchItems = Array.isArray(data.results) ? data.results
        : Array.isArray(data.items) ? data.items
        : Array.isArray(data) ? data : [];

    const filmItems = searchItems
        .filter(el => el.type === 'FilmSearchResult' || el.film)
        .map(el => el.film || el);

    let match = filmItems.find(el => el.name === title && el.releaseYear === year);
    if (!match) match = filmItems.find(el => el.name === title && Math.abs((el.releaseYear || 0) - year) <= 1);
    if (!match) match = filmItems[0];
    if (!match) throw new Error('Film not found on Letterboxd');

    const slug = match.id || match.slug;
    const rawRating = match.rating;
    const lbRating = typeof rawRating === 'number' ? rawRating
        : rawRating?.value !== undefined ? rawRating.value : null;
    const lbUrl = match.links?.[0]?.url || match.link || match.url || `https://letterboxd.com/film/${slug}/`;
    return { lbSlug: slug, lbRating, lbUrl };
});

export const fetchLetterboxdMemberId = createAsyncThunk('letterboxd/fetchMemberId', async (username) => {
    const res = await fetch(`https://${LETTERBOXD_HOST}/api/letterboxd/search?input=${encodeURIComponent(username)}`, {
        headers: LB_HEADERS
    });
    if (!res.ok) throw new Error('Letterboxd member search error ' + res.status);
    const data = await res.json();
    console.log('[LB member search]', JSON.stringify(data).slice(0, 500));

    const searchItems = Array.isArray(data.results) ? data.results
        : Array.isArray(data.items) ? data.items
        : Array.isArray(data) ? data : [];

    const memberItem = searchItems
        .filter(el => el.type === 'MemberSearchResult' || el.member)
        .map(el => el.member || el)
        .find(el => (el.username || el.userName || '').toLowerCase() === username.toLowerCase());

    if (!memberItem) throw new Error('Letterboxd member not found: ' + username);
    const memberId = memberItem.id || memberItem.memberId;
    if (!memberId) throw new Error('Member ID not found for: ' + username);
    return { memberId, username };
});

export const fetchLetterboxdWatchlist = createAsyncThunk('letterboxd/fetchWatchlist', async ({ filmSlug, memberId }) => {
    const res = await fetch(`https://${LETTERBOXD_HOST}/api/letterboxd/member/${encodeURIComponent(memberId)}/watchlist`, {
        headers: LB_HEADERS
    });
    if (!res.ok) throw new Error('Letterboxd watchlist error ' + res.status);
    const data = await res.json();
    console.log('[LB watchlist]', JSON.stringify(data).slice(0, 300));

    const entries = Array.isArray(data.entries) ? data.entries
        : Array.isArray(data.items) ? data.items
        : Array.isArray(data.films) ? data.films
        : Array.isArray(data) ? data : [];
    const inWatchlist = entries.some(el => {
        const film = el.film || el;
        return (film.id || film.slug) === filmSlug;
    });
    return inWatchlist;
});

const letterboxdSlice = createSlice({
    name: 'letterboxd',
    initialState: {
        isLoadingFilm: false,
        lbSlug: null,
        lbRating: null,
        lbUrl: null,
        errMess: null,
        isLoadingMember: false,
        memberLbId: null,
        memberLbIdFor: null,
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
                // memberLbId is kept across movie navigations — no need to re-fetch per movie
            })
            .addCase(fetchLetterboxdMemberId.pending, (state) => {
                state.isLoadingMember = true;
            })
            .addCase(fetchLetterboxdMemberId.fulfilled, (state, action) => {
                state.isLoadingMember = false;
                state.memberLbId = action.payload.memberId;
                state.memberLbIdFor = action.payload.username;
            })
            .addCase(fetchLetterboxdMemberId.rejected, (state) => {
                state.isLoadingMember = false;
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
