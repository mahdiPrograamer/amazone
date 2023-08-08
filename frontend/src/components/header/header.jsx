import React, { useEffect, useState } from "react";
import "./header.css";
import {
  Badge,
  Button,
  Container,
  Nav,
  NavDropdown,
  Navbar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { signoutHnadler } from "../../stateManagment/reducer/loginReducer";
import SearchBox from "../searchBox/searchBox";
import { toast } from "react-toastify";
import axios from "axios";
import { getError } from "../../utils";

export const Header = (props) => {
  const cartItems = props.addedToLocal;
  const navigate = useNavigate();

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <div
      className={
        sidebarIsOpen
          ? "d-flex flex-column site-container active-cont"
          : "d-flex flex-column site-container"
      }
    >
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Button
              variant="dark"
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
            >
              <i className="fas fa-bars"></i>
            </Button>

            <LinkContainer to="/">
              <Navbar.Brand>amazona</Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <SearchBox />
              <Nav className="me-auto  w-100  justify-content-end">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
                {props.userData ? (
                  <NavDropdown
                    title={props.userData.name}
                    id="basic-nav-dropdown"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Divider />
                    <Link
                      className="dropdown-item"
                      to="#signout"
                      onClick={() => {
                        props.signoutHnadler();
                        // navigate("/");
                      }}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}

                {props.userData && props.userData.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/products">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orders">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/users">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>

      <div
        className={
          sidebarIsOpen
            ? "active-nav side-navbar d-flex justify-content-between flex-wrap flex-column"
            : "side-navbar d-flex justify-content-between flex-wrap flex-column"
        }
      >
        <Nav className="flex-column text-white w-100 p-2">
          <Nav.Item>
            <strong>Categories</strong>
          </Nav.Item>
          {categories.map((category) => (
            <Nav.Item key={category}>
              <LinkContainer
                to={`/search?category=${category}`}
                onClick={() => setSidebarIsOpen(false)}
              >
                <Nav.Link>{category}</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          ))}
        </Nav>
      </div>

      {/* <footer>
        <div className="text-center">All rights reserved</div>
      </footer> */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    addedToLocal: state.addToCartSlice.addedToLocal,
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signoutHnadler: () => dispatch(signoutHnadler()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
