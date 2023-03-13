import React from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom"; //used in parentroute elements to render childroute elements
export default function Home() {

     return (
    <div>
      <button className="ui blue button" > <Link to="/admin" style={{color:"white"}}>Admin</Link></button>
      <button className="ui blue button" ><Link to="/user" style={{color:"white"}}>User</Link></button>
      <Outlet />
    </div>

  )
}
