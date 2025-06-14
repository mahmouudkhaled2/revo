import { Routes, Route } from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../Pages/Home";
import ForRestaurants from "../Pages/ForRestaurants";
import ContactPage from "../Pages/Contact";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import NotFound from "../Pages/NotFound";
// import ForgetPassword from "../Pages/ForgetPassword";
import ProtectedRoute from "./ProtectedRoute";
import RestaurantPage from "../Pages/Restaurant";
import AccountTypeSelection from "../Pages/AccountTypeSelection";
import OwnerRedirect from "../Pages/OwnerRedirect";
import PostsPage from "../Pages/PostsPage";
import FavoriteDishes from "../Pages/FavoriteDishes";
import OrdersHistory from "../Pages/OrdersHistory";
import AuthProtector from "./AuthRoutesProtector";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route
          path="posts"
          element={
            <ProtectedRoute>
              <PostsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="for-restaurants"
          element={
            <ProtectedRoute>
              <ForRestaurants />
            </ProtectedRoute>
          }
        />
        <Route
          path="for-restaurants/:restaurant"
          element={
            <ProtectedRoute>
              <RestaurantPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="contact"
          element={
            <ProtectedRoute>
              <ContactPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="favorites"
          element={
            <ProtectedRoute>
              <FavoriteDishes />
            </ProtectedRoute>
          }
        />
        <Route
          path="orders"
          element={
            <ProtectedRoute>
              <OrdersHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="login"
          element={
            <AuthProtector>
              <Login />
            </AuthProtector>
          }
        />
        <Route
          path="account-type"
          element={
            <AuthProtector>
              <AccountTypeSelection />
            </AuthProtector>
          }
        />
        <Route
          path="owner-redirect"
          element={
            <AuthProtector>
              <OwnerRedirect />
            </AuthProtector>
          }
        />
        <Route
          path="register"
          element={
            <AuthProtector>
              <Register />
            </AuthProtector>
          }
        />
        {/* <Route
          path="forgot-password"
          element={
            <AuthProtector>
              <ForgetPassword />
            </AuthProtector>
          }
        /> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
