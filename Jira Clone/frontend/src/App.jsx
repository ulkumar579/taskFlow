import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoutes from "./routes/PublicRotes";
import Signup from "./pageComponent/signupComponent/Signup";
import Login from "./pageComponent/LoginComponent/Login";
import { isAuthenticated } from "./utils/auth";
import ProfileSettings from "./pageComponent/profileSetting";
import Dashboard from "./pageComponent/Home/Dashboard";
import Project from "./pageComponent/Home/project";
import Tasks from "./pageComponent/Home/tasks";
import ProjectDetailPage from "./pageComponent/Home/project/ProjectDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoutes />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/setting" element={<ProfileSettings />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          {/* ← dynamic route */}
          <Route path="/tasks" element={<Tasks />} />
        </Route>

        <Route
          path="*"
          element={
            isAuthenticated() ? (
              <Navigate to="/" replace element={<Navigate to="/dashboard" />} />
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
