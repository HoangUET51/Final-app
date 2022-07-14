import React, { useContext, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import logo from "../assets/img/logo192.png";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/useContext";
const Header = (props) => {
  const { logout, user } = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logout success!!");
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            ></img>
            React-Final App
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {((user && user.auth) || window.location.pathname === "/") && (
              <>
                <Nav className="me-auto">
                  <NavLink className="nav-link" to="/" active>
                    Home
                  </NavLink>
                  <NavLink className="nav-link" to="/users">
                    Manage Users
                  </NavLink>
                </Nav>

                <Nav>
                  {user && user.email && (
                    <span className="nav-link">Welcome {user.email}</span>
                  )}
                  <NavDropdown title="Settings">
                    {user && user.auth === true ? (
                      <NavDropdown.Item
                        className="dropdown-item"
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </NavDropdown.Item>
                    ) : (
                      <NavLink className="dropdown-item" to="/login" active>
                        Login
                      </NavLink>
                    )}
                  </NavDropdown>
                </Nav>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
