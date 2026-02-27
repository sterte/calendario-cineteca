import { createSlice } from '@reduxjs/toolkit';

const stored = localStorage.getItem('activeProvider');

const providerSlice = createSlice({
    name: 'provider',
    initialState: { activeProvider: stored === 'ccb' ? 'ccb' : stored === 'popup' ? 'popup' : 'cineteca' },
    reducers: {
        setProvider: (state, action) => {
            state.activeProvider = action.payload;
            localStorage.setItem('activeProvider', action.payload);
        }
    }
});

export const { setProvider } = providerSlice.actions;
export const ProviderReducer = providerSlice.reducer;
