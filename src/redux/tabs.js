import { createSlice } from '@reduxjs/toolkit';

const tabsSlice = createSlice({
    name: 'tabs',
    initialState: { tabs: [] },
    reducers: {
        openTab: (state, action) => {
            const { id, title, url, provider, categoryId, movieId, repeatId } = action.payload;
            if (!state.tabs.find(t => t.id === id)) {
                state.tabs.push({ id, title, url, provider, categoryId, movieId, repeatId });
            }
        },
        closeTab: (state, action) => {
            state.tabs = state.tabs.filter(t => t.id !== action.payload);
        },
        clearTabs: (state) => {
            state.tabs = [];
        },
    },
});

export const { openTab, closeTab, clearTabs } = tabsSlice.actions;
export default tabsSlice.reducer;
