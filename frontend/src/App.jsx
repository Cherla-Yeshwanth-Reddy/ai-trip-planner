import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

// Lazy Load Components (Code Splitting)
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./components/login")); 
const Register = lazy(() => import("./components/Register"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));

// 1. IMPORT THE NEW RESULTS PAGE
const TripResults = lazy(() => import("./pages/TripResults"));

// Loading Spinner Component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<AdminPanel />} />
        
        {/* 2. ADD THE NEW ROUTE */}
        <Route path="/trip-result" element={<TripResults />} />
        
      </Routes>
    </Suspense>
  );
}

export default App;