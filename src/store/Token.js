import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    TokenName: 'bsc',
    Network: [],
    minSidebar: false,
    noneSidebar: false,
    isDark: false,
    isTokenSearchBar: false,
    balanceOfTranshumanToken: 0,
    isConnect: false,
};

const TokenReducer = createSlice({
    name: 'Token',
    initialState,
    reducers: {
        SetTokenName: (state, action) => {
            state.TokenName = action.payload;
        },
        SetNetwork: (state, action) => {
            state.Network = action.payload;
        },
        SetMinSiderBar: (state, action) => {
            state.minSidebar = action.payload;
        },
        SetIsDark: (state, action) => {
            state.isDark = action.payload;
        },
        SetIsTokenSearchBar: (state, action) => {
            state.isTokenSearchBar = action.payload;
        },
        SetBalanceOfTranshumanToken: (state, action) => {
            state.balanceOfTranshumanToken = action.payload;
        },
        SetNoneSidebar: (state, action) => {
            state.noneSidebar = action.payload;
        },
        SetIsConnect: (state, action) => {
            state.isConnect = action.payload;
        },
    }
});

const { reducer, actions } = TokenReducer;

export const { SetTokenName, SetNetwork, SetMinSiderBar, SetIsDark, SetIsTokenSearchBar, SetBalanceOfTranshumanToken, SetNoneSidebar, SetIsConnect } = actions;

export default reducer;
