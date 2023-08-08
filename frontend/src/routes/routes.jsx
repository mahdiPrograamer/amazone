import Product from "../pages/product";
import Home from "../pages/home";
import Cart from "../pages/cart";
import Login from "../pages/login";
import ShippingAddress from "../pages/shippingAddress";
import Register from "../pages/register";
import PlaceOrder from "../pages/placeOrder";
import PaymentMethod from "../pages/paymentMethod";
import History from "../pages/history";
import Profile from "../pages/profile";
import Order from "../pages/order";
import Search from "../pages/search";
import ProtectedRoute from "../components/protectedRoutes/protectRoute";
import AdminRoutes from "../components/adminRoute/adminRoutes";
import Dashbord from "../pages/dashbord";
import ProductList from "../pages/productList";
import ProductEdit from "../pages/productEdit";
import OrderList from "../pages/orderList";
import UserEdit from "../pages/userEdit";
import UserList from "../pages/userList";
import Map from "../pages/map";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/product/:product", element: <Product /> },
  {
    path: "/order/:id",
    element: (
      <ProtectedRoute>
        <Order />
      </ProtectedRoute>
    ),
  },
  { path: "/cart", element: <Cart /> },
  { path: "/search", element: <Search /> },
  { path: "/signin", element: <Login /> },
  { path: "/shipping", element: <ShippingAddress /> },
  { path: "/signup", element: <Register /> },
  { path: "/payment", element: <PaymentMethod /> },
  { path: "/placeorder", element: <PlaceOrder /> },
  {
    path: "/orderhistory",
    element: (
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  // {
  //   path: "/map",
  //   element: (
  //     <ProtectedRoute>
  //       <Map />
  //     </ProtectedRoute>
  //   ),
  // },

  // admin routes

  {
    path: "/admin/dashboard",
    element: (
      <AdminRoutes>
        <Dashbord />
      </AdminRoutes>
    ),
  },

  {
    path: "/admin/products",
    element: (
      <AdminRoutes>
        <ProductList />
      </AdminRoutes>
    ),
  },
  {
    path: "/admin/product/:id",
    element: (
      <AdminRoutes>
        <ProductEdit />
      </AdminRoutes>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <AdminRoutes>
        <OrderList />
      </AdminRoutes>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <AdminRoutes>
        <UserList />
      </AdminRoutes>
    ),
  },
  {
    path: "/admin/user/:id",
    element: (
      <AdminRoutes>
        <UserEdit />
      </AdminRoutes>
    ),
  },
];

export default routes;
