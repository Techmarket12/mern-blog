import { createSlice } from "@reduxjs/toolkit"


const initialState = {
  currentUser: null,
  error: null,
  loading: false
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers: {
        signInStart: (state) => {
            state.loading = true;
            state.error = null;

        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFallure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        deleteSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
})

export const {signInFallure, signInStart, signInSuccess, updateStart, updateFailure, updateSuccess, deleteFailure, deleteStart, deleteSuccess} = userSlice.actions;

export default userSlice.reducer