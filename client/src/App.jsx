import { useContext, useState, useEffect } from "react";
import { UserContext } from "./Context/UserProvider"; // Adjust the import path
import {
  Route,
  Routes,
  Navigate,
  useNavigate,
  BrowserRouter,
} from "react-router-dom";
import axiosInstance from "./API/axios";
import ProtectedRoute from "./context/ProtectedRoutes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./pages/LandingPage/LandingPage";
import HomePage from "./components/HomePage/HomePage";
import AskQuestion from "./pages/AskQuestion/AskQuestion";
import EditQuestion from "./pages/EditQuestion/EditQuestion";
import QuestionDetail from "./pages/QuestionDetail/QuestionDetail";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import { jwtDecode } from "jwt-decode";
import HowItWorks from "./pages/HowItWorks/HowItWorks";
import ForgetPassword from "./pages/ForgetPassword/ForgetPassword";
import EditAnswer from "./pages/EditAnswer/EditAnswer";

function App() {
  const [user, setUser] = useContext(UserContext); // Correctly using useContext
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function isTokenExpired(token) {
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (e) {
      return true; // If there's an error, assume the token is expired
    }
  }

  async function checkUser() {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token"); // Remove expired token
      setUser(null);
      navigate("/users/login"); // Redirect to login
      return;
    }

    try {
      const { data } = await axiosInstance.get("/users/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser({ user_name: data.user_name, user_id: data.user_id });
    } catch (error) {
      setUser(null);
      setError("Failed to authenticate. Please log in again.");
      navigate("/users/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) {
      checkUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return (
      <div className="loader">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div div className="app-layout">
      <Header />
      <div className="app-content">
        <Routes>
          <Route
            path="/"
            element={token ? <Navigate to="/home" /> : <LandingPage />}
          />
          <Route
            path="/users/login"
            element={token ? <Navigate to="/home" /> : <Login />}
          />
          <Route
            path="/users/register"
            element={token ? <Navigate to="/home" /> : <SignUp />}
          />
          <Route
            path="/forget-password"
            element={token ? <Navigate to="/home" /> : <ForgetPassword />}
          />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="questions/:question_id"
            element={
              <ProtectedRoute>
                <QuestionDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ask"
            element={
              <ProtectedRoute>
                <AskQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/questions/update/:question_id"
            element={
              <ProtectedRoute>
                <EditQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="/answer/update/:answer_id"
            element={
              <ProtectedRoute>
                <EditAnswer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
