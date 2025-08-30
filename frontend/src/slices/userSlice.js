// FOR AUTHENTICATION PURPOSES - frontend user slice

// This file is for managing user state in a Redux store.

import { createSlice } from "@reduxjs/toolkit";

const initialState = { // check for user info in local storage
    userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
}

const userSlice = createSlice({
    name: "user",  
    initialState,  
    reducers: {
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;  // Update user information
        },
        clearUserInfo: (state) => {
            state.userInfo = null;  // Clear user information
        }
    }
});     

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;   