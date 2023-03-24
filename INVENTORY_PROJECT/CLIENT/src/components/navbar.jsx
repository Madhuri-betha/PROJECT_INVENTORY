import React, { useState,useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { logout } from '../functions/auth';
import { Dropdown,Icon } from 'semantic-ui-react';
import { setAdmin, setLogins } from '../reducers/globalStates';
import Cookies from "universal-cookie";
export default function Navbar() {

    const dispatcher = useDispatch();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("")
    const cookie = new Cookies();
    const uname=cookie.get("username")
    const [isAdmin, setIsAdmin] = useState(true);
    useEffect(() => {
      setIsAdmin(cookie.get("admin") === "true");
    }, []);

    const destroySession = async () => {
        let flag = await logout();
        if (flag === true) {
            dispatcher(setLogins(false, null), setAdmin(false));
            navigate("/inventory/authenticate");
        } else {
            return false;
        }
    };
    const State = useSelector((state) => state.globalStates);
    const handleItemClick = (e, { name }) => setActiveItem(name)

   
    return (
        <div>
            <Menu fixed='top'>
                {State.loggedIn ? (
                    <>
                        <Menu.Item
                            name='home'
                            active={activeItem === 'home'}
                            as={NavLink}
                            to=""
                            onClick={handleItemClick}
                        />
                        {(cookie.get("admin") === "true") && <Menu.Item
                        name='Add Inventory'
                        as={NavLink}
                        to="/admin"
                        active={activeItem === 'Add Inventory'}
                        onClick={handleItemClick}
                    />}
                        <Menu.Menu position="right">
                            <Dropdown
                                item
                                trigger={
                                    <>
                                        <Icon name="user circle" />
                                        {uname}
                                    </>
                                }
                            >
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={destroySession}>
                                        <Icon name="sign-out" />
                                        Logout
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Menu.Menu>
                    </>
                ) : (<>
                    <Menu.Item
                        name='Login'
                        position='right'
                        active={activeItem === 'Login'}
                        as={NavLink}
                        to="/login"
                        onClick={handleItemClick}
                    />
                </>)}
            </Menu>
        </div>
    )


}