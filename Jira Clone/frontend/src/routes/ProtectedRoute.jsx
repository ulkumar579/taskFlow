import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";
import Navbar from "@/pageComponent/Navbar";

const ProtectedRoute = () => {
  return isAuthenticated() ? (
    <>
      {" "}
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="mx-auto px-4 sm:px-6 lg:px-30 py-8 pt-24 pb-8">
          <Outlet /> {/* ← whichever route matches renders here */}
        </main>
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoute;
