import Cookies from "universal-cookie";

import axios from "axios";
let cookie = new Cookies();
export const checkAuth = async () => {
  if (cookie.get("session_id")) {
    let res = await axios.post(
      "http://192.168.1.36:9000/auth",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    return res.data.sessionExist;
  } else {
    return false;
  }
};


export const logout = async () => {
  let flag = false;
  await axios
    .post(
      "http://192.168.1.36:9000/logout",
      { session_id: cookie.get("session_id") },
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    .then((response) => response.data)
    .then((data) => {
      cookie.set("session_id", "", { path: "/", expires: new Date() });
      flag = data;
    });
  return flag;
};
