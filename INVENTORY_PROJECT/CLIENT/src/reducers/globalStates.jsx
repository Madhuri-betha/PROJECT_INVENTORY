import { createSlice } from "@reduxjs/toolkit";
export const globalStates = createSlice({
  name: "globalStates",
  initialState: {

    loggedIn: false,
    sessionID: null,
    userID: null,
    admin: false,
    id: "",
    category: "",
    userid: "",
    model: "",
    serial: "",
    date: "",
    flagredux: false
  },
  reducers: {

    setLogins: (state, action) => {
      state.loggedIn = action.payload[0];
      state.userID = action.payload[1];
    },
    setAdmin: (state, action) => {
      state.admin = action.payload
    },
    setGlobalId: (state, action) => {
      console.log(action.payload);
      state.id = action.payload
    },
    setGlobalCategory: (state, action) => {
      state.category = action.payload
    },
    setGlobalUserId: (state, action) => {
      state.userid = action.payload

    },
    setGlobalModel: (state, action) => {
      state.model = action.payload
    },
    setGlobalSerial: (state, action) => {
      state.serial = action.payload
    },
    setGlobalDate: (state, action) => {
      state.date = action.payload

    },
    setGlobalFlagRedux: (state, action) => {
      state.flagredux = action.payload
    }

  },
});
export const { setLogins, setAdmin, setGlobalId, setGlobalCategory, setGlobalUserId, setGlobalModel, setGlobalSerial, setGlobalDate, setGlobalFlagRedux } = globalStates.actions;
export default globalStates.reducer;
// searchData.category = localStorage.getItem("category")
// searchData.userid = localStorage.getItem("userid")
// searchData.model= localStorage.getItem("model")
// searchData.serial= localStorage.getItem("serial")
// searchData.date = localStorage.getItem("date")

