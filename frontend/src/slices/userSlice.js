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
        setUserInfo: (state, action) => { // dispatch(res) sets the payload
            state.userInfo = action.payload;  // Update user information
        },
        clearUserInfo: (state) => {
            state.userInfo = null;  // Clear user information
        }
    }
});     

export const { setUserInfo, clearUserInfo } = userSlice.actions; // this sets dispatch() to handle payloads only

export default userSlice.reducer; // for Store