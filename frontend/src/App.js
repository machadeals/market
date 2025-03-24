import React from "react";
import "./App.css"; // Ensure this line is present at the top
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import HomePage from "./components/HomePage/HomePage";
import ProductDetails from "./components/ProductDetails/ProductDetails.jsx";
import LoginPage from "./components/LoginPage/LoginPage.jsx";
import ForgetPassword from "./components/ForgetPassword/ForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";
import AffiliateRedirect from "./components/AffiliateRedirect/AffiliateRedirect.jsx";
import Products from "./components/Products/Products.jsx";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard.jsx";
import ProductForm from "./components/ProductForm/ProductForm.jsx";
import AddAdmin from "./components/AddAdmin/AddAdmin.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import DisplaySettings from "./components/DisplaySettings/DisplaySettings.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy/PrivacyPolicy.jsx";
import About from "./components/About/About.jsx";
import TermsOfUse from "./components/TermsOfUse/TermsOfUse.jsx";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#f50057" },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(
    !!localStorage.getItem("token")
  );
  const [role, setRole] = React.useState(localStorage.getItem("role"));

  const onLogin = (userRole) => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const onLogout = () => {
    setIsLoggedIn(false);
    setRole(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="app-container">
          <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/login" element={<LoginPage onLogin={onLogin} />} />
              <Route path="/forgot-password" element={<ForgetPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/affiliate/:id" element={<AffiliateRedirect />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role={role} requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute role={role} requiredRole="admin">
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/display-settings"
                element={
                  <ProtectedRoute role={role} requiredRole="admin">
                    <DisplaySettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/add-product"
                element={
                  <ProtectedRoute role={role} requiredRole="admin">
                    <ProductForm isEdit={false} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/edit-product/:id"
                element={
                  <ProtectedRoute role={role} requiredRole="admin">
                    <ProductForm isEdit={true} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/add-admin"
                element={
                  <ProtectedRoute role={role} requiredRole="admin">
                    <AddAdmin />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<About />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
