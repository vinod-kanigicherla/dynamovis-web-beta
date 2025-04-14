import React from 'react';
import { Link } from "react-router-dom";
import styled from 'styled-components';
import dstyles from "../../design/css/style.css";
import smallLogo from "./small-move.png";


const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  color: black;
  padding: 10px;
  height: 80px;
  
  border-bottom: 1px solid #e5e5e5;
`;

const NavItem = styled.div`
  margin: 0 20px;
  cursor: pointer;
  color: black;
  &:hover {
    color: #0000b3;
  }
`;

const NavItemRight = styled.div`
  margin: 0 70px 0 10px;
  cursor: pointer;
  color: black;
  &:hover {
    color: #0000b3;
  }
`;

const Header = () => {
  return (
    // Make NavBar Still
    <Nav className="sticky top-0 z-50">
      <div class="col-1">
      <div id= "logo">
          <img src={smallLogo} id= "bannerlogo" class="mt-7 ml-5 scale-150" alt="Landing Page"/>
      </div>
      </div>
    
      <Link to={"/"}><NavItem>Home</NavItem></Link>
      <Link to={"/Tutorial"}><NavItem>Tutorial</NavItem></Link>
      <Link to={"/Sponsor"}><NavItem> Sponsor</NavItem></Link>
      <Link to={"/Team"}><NavItem>Team</NavItem></Link>
      <Link to={"/Contact"}><NavItemRight>Contact</NavItemRight></Link>
    </Nav>


  )
};

export default Header;
