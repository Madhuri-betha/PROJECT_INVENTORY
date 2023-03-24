
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLogins, setAdmin } from "../reducers/globalStates";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

export default function Auth() {
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const cookie = new Cookies();
  const server = "https://backflipt-accounts.onrender.com";
  useEffect(() => {
    if (cookie.get("session_id")) {
      axios
        .post(
          "http://192.168.1.14:9000/auth",
          { session_id: cookie.get("session_id") },
          {
            headers: { "Content-Type": "application/json" },
          }
        )
        .then((res) => {
          if (res.data[0]) {
            dispatcher(
              setLogins([res.data, cookie.get("username")]),
              setAdmin(cookie.get("admin") === "true")
            );
            navigate("/");
          } else {
            cookie.set("session_id", "", { path: "/", expires: new Date() });
        window.location.href =server +"/?host=" + window.location.host +"&protocol=" + window.location.protocol +"&app=inventory";

          }
        });
      return;
    } else {
      let params = new URLSearchParams(window.location.search);
      let session = {};
      for (let p of params) {
        session[p[0]] = p[1];
        if (p[0] === "admin") {
          dispatcher(setAdmin(p[1] === "true"));
        }
        cookie.set(p[0], p[1], { path: "/" });
      }
      if (session["session_id"]) {
        dispatcher(setLogins([true, cookie.get("username")]));
        dispatcher(setAdmin(cookie.get("admin") === "true"));
        navigate("/");
      } else {
        dispatcher(setLogins([false, null]));
        window.location.href =server +"/?host=" + window.location.host +"&protocol=" + window.location.protocol +"&app=inventory";
      }
    }
  });
  return <></>;
}


