import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import Cookies from 'universal-cookie';
import { checkAuth } from '../functions/auth';
import { setAdmin, setLogins } from '../reducers/globalStates';
import Navbar from './navbar'

export default function Root() {
    const dispatcher = useDispatch();
    const cookie = new Cookies();
    const navigate = useNavigate();
    useEffect(() => {
        checkAuth().then((res) => {
            if (res) {
                dispatcher(
                    setLogins([res, cookie.get("username")]),
                    setAdmin(cookie.get("role") === "true")
                );
            } else {
                cookie.set("session_id", "", { path: "/", expires: new Date() });
                dispatcher(setLogins([false, null]), setAdmin(false));
                navigate("/login")
            }
        });
    }, []);
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
}