import { createSlice } from '@reduxjs/toolkit';

const tabsSlice = createSlice({
    name: 'tabs',
    initialState: { tabs: [], selectedTabIndex: 0 },
    reducers: {
        openTab: (state, action) => {
            const { id, title, url, provider, categoryId, movieId, repeatId } = action.payload;
            if (!state.tabs.find(t => t.id === id)) {
                state.tabs.push({ id, title, url, provider, categoryId, movieId, repeatId });
                state.selectedTabIndex =  state.tabs.length;
            }
        },
        closeTab: (state, action) => {
            state.tabs = state.tabs.filter(t => t.id !== action.payload);
        },
        clearTabs: (state) => {
            state.tabs = [];
        },
        setCurrentTab: (state, action) => {
            if(action.payload <= state.tabs.length){
                state.selectedTabIndex = action.payload;
            }
        },
        swipeTabCircular: (state, action) => {
            const currentTabSize = state.tabs.length + 1;
            const newTabIndex = (state.selectedTabIndex + currentTabSize + action.payload) % currentTabSize;
            state.selectedTabIndex = newTabIndex;
        }
    },
});

export const { openTab, closeTab, clearTabs, setCurrentTab, swipeTabCircular } = tabsSlice.actions;
export const TabsReducer = tabsSlice.reducer;
