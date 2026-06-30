import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoutes from "./routes/PublicRotes";
import Signup from "./pageComponent/signupComponent/Signup";
import Login from "./pageComponent/LoginComponent/Login";
import { isAuthenticated } from "./utils/auth";
import Home from "./pageComponent/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>

        <Route
          path="*"
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace element={<Home />} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
