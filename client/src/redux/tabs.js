import { createSlice } from '@reduxjs/toolkit';

const tabsSlice = createSlice({
    name: 'tabs',
    initialState: { tabs: [], selectedTabIndex: 0, navOpen: false },
    reducers: {
        openTab: (state, action) => {
            const { id, title, url, provider, categoryId, movieId, repeatId, autoSwitch = true } = action.payload;
            const existingIdx = state.tabs.findIndex(t => t.id === id);
            if (existingIdx === -1) {
                state.tabs.push({ id, title, url, provider, categoryId, movieId, repeatId });
                if (autoSwitch) state.selectedTabIndex = state.tabs.length;
            } else {
                // Tab already open — bring it to front only if switching
                if (autoSwitch) state.selectedTabIndex = existingIdx + 1;
            }
        },
        closeTab: (state, action) => {
            const closedIdx = state.tabs.findIndex(t => t.id === action.payload);
            state.tabs = state.tabs.filter(t => t.id !== action.payload);
            if (closedIdx !== -1) {
                const closedTabIndex = closedIdx + 1; // +1 because Tab0 is Calendar
                if (closedTabIndex === state.selectedTabIndex) {
                    // Closed the active tab → fall back to Calendar
                    state.selectedTabIndex = 0;
                } else if (closedTabIndex < state.selectedTabIndex) {
                    // Closed a tab before the active one → shift index down
                    state.selectedTabIndex -= 1;
                }
            }
        },
        clearTabs: (state) => {
            state.tabs = [];
            state.selectedTabIndex = 0;
        },
        setCurrentTab: (state, action) => {
            if (action.payload <= state.tabs.length) {
                state.selectedTabIndex = action.payload;
            }
        },
        setNavOpen: (state, action) => {
            state.navOpen = action.payload;
        },
    },
});

export const { openTab, closeTab, clearTabs, setCurrentTab, setNavOpen } = tabsSlice.actions;
export const TabsReducer = tabsSlice.reducer;
