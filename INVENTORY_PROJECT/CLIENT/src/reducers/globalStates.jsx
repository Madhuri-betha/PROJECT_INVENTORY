import { createSlice } from "@reduxjs/toolkit";
export const globalStates = createSlice({
  name: "globalStates",
  initialState: {
   
    loggedIn: false,
    sessionID: null,
    userID: null,
    admin: false,
  },
  reducers: {
   
    setLogins: (state, action) => {
      state.loggedIn = action.payload[0];
      state.userID = action.payload[1];
    },
    setAdmin:(state, action) => {
      state.admin = action.payload
    }
  },
});
export const {  setLogins,setAdmin } = globalStates.actions;
export default globalStates.reducer;