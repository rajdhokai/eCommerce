import React, { useContext, useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SignInScreen from './screens/SignInScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen'
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './component/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './component/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './component/AdminRoute';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import MapScreen from './screens/MapScreen';




function App() {

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  }

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [catagories, setCatagories] = useState([]);

  useEffect(() => {
    const fetchCatagories = async () => {
      try {
        const { data } = await axios.get(`/api/products/catagories`);
        setCatagories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCatagories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
              ? 'site-container d-flex flex-column full-box'
              : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position='bottom-center' limit={1}></ToastContainer>
        <header>

          <Navbar variant="dark" expand="lg" id="bhare">
            <Container id="brand">
              <Button className='bt'
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>
              <LinkContainer to="/" id="sor">
                <Navbar.Brand>TRA Electronics</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox className="src" />
                <Nav className="me-auto w-100  justify-content-end" >
                  <Link to="/cart" className="nev" >
                    Cart {
                      cart.cartItems.length > 0 && (
                        <Badge pill bg="danger">
                          {cart.cartItems.length}
                        </Badge>
                      )
                    }
                  </Link>
                  {userInfo ? (
                    <div className='nuv'>
                      <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                        <LinkContainer to="/profile">
                          <NavDropdown.Item>User Profile</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/orderhistory">
                          <NavDropdown.Item>Order History</NavDropdown.Item>
                        </LinkContainer>
                        <NavDropdown.Divider />
                        <Link
                          className='dropdown-item'
                          to='#signout'
                          onClick={signoutHandler}
                        > SignOut
                        </Link>
                      </NavDropdown>
                    </div>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In

                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && (
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
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Catagories</strong>
            </Nav.Item>
            {catagories.map((catagory) => (
              <Nav.Item key={catagory}>
                <LinkContainer
                  to={`/search?catagory=${catagory}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{catagory}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>

          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />}></Route>
              <Route path="/cart" element={<CartScreen />}></Route>
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SignInScreen />}></Route>
              <Route path="/" element={<HomeScreen />}></Route>
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>

              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>

        </main>
        <footer>
          <div className="text-center "> All Rights Reserved </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}
export default App;
