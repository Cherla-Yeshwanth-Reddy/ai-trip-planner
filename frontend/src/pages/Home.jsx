import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">

      <div className="bg-white text-gray-800 p-10 rounded-xl shadow-xl text-center w-[400px]">

        <h1 className="text-3xl font-bold mb-4">Trip Planner AI ✈️</h1>
        <p className="mb-6 text-gray-600">
          Plan your perfect trip using AI
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/login")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50"
          >
            Register
          </button>
        </div>

      </div>
    </div>
  );
}
