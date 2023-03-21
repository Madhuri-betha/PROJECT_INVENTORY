import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { logout } from '../functions/auth';
import { Dropdown,Icon } from 'semantic-ui-react';
import { setAdmin, setLogins } from '../reducers/globalStates';
import Cookies from "universal-cookie";
export default function Navbar() {

    const dispatcher = useDispatch();
    const navigate = useNavigate();
    const [activeItem, setActiveItem] = useState("home")
    
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
    const cookie = new Cookies();
    const uname=cookie.get("username");
    const isAdmin = cookie.get("admin") === "true";
    return (
        <div>
            <Menu>
                {State.loggedIn ? (isAdmin ? (<>
                    <Menu.Item
                        name='home'
                        active={activeItem === 'home'}
                        as={Link}
                        to="/"
                        onClick={handleItemClick}
                    />
                    <Menu.Item
                        name='Add Inventory'
                        as={Link}
                        to="/admin"
                        active={activeItem === 'Add Inventory'}
                        onClick={handleItemClick}
                    />
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
                </>) : (
                    <>
                        <Menu.Item
                            name='home'
                            active={activeItem === 'home'}
                            as={Link}
                            to="/"
                            onClick={handleItemClick}
                        />
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
                )) : (<>
                    <Menu.Item
                        name='Login'
                        position='right'
                        active={activeItem === 'Login'}
                        as={Link}
                        to="/login"
                        onClick={handleItemClick}
                    />
                </>)}
            </Menu>
        </div>
    )


}