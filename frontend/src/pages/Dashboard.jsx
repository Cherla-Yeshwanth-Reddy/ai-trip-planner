import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [days, setDays] = useState("");
  const [selectedInterests, setSelectedInterests] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // AVAILABLE INTERESTS
  const interestsList = [
    { id: "food", label: "🍜 Food & Dining" },
    { id: "shopping", label: "🛍️ Shopping" },
    { id: "history", label: "🏛️ History" },
    { id: "nature", label: "🌲 Nature" },
    { id: "adventure", label: "🪂 Adventure" },
    { id: "nightlife", label: "🎉 Nightlife" },
    { id: "art", label: "🎨 Art & Museums" },
    { id: "relaxation", label: "💆 Relaxation" },
  ];

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") setIsAdmin(true);
  }, []);

  const toggleInterest = (label) => {
    if (selectedInterests.includes(label)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== label));
    } else {
      setSelectedInterests([...selectedInterests, label]);
    }
  };

  const generateTrip = async () => {
    // Removed Budget Check
    if (!source || !destination || !startDate || !days) {
        alert("Please fill in all required fields!");
        return;
    }

    setLoading(true);
    try {
      const res = await api.post("/trips/generate", {
        source,
        destination,
        startDate,
        days,
        interests: selectedInterests
        // No budget sent here
      });

      navigate("/trip-result", { 
        state: { 
          itinerary: res.data.trip_plan, 
          destination: destination 
        } 
      });

    } catch (error) {
      console.error(error);
      alert("Failed to generate trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans text-slate-800 pb-12">
      
      {/* HEADER */}
      <div className="pt-10 pb-20 px-6">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-2">
              TripPlanner <span className="text-blue-200">AI</span> ✈️
            </h1>
            <p className="text-blue-100 mt-2 opacity-90 font-medium">
              Design your perfect getaway in seconds
            </p>
          </div>

          <div className="flex gap-4">
            {isAdmin && (
              <button onClick={() => navigate("/admin")} className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-purple-600 px-5 py-2.5 rounded-xl transition text-sm font-bold shadow-lg">
                Admin Portal 🛡️
              </button>
            )}
            <button onClick={() => { localStorage.clear(); navigate("/login"); }} className="bg-white text-slate-700 hover:bg-red-50 hover:text-red-600 px-5 py-2.5 rounded-xl transition text-sm font-bold shadow-lg">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* INPUT FORM CARD */}
      <div className="max-w-5xl mx-auto px-6 relative z-10 -mt-20">
        
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 mb-16">
          
          {/* ROW 1: Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <InputGroup label="Current Region (From)" placeholder="e.g. New York, USA" onChange={setSource} icon="🛫" />
            <InputGroup label="Destination (To)" placeholder="e.g. Tokyo, Japan" onChange={setDestination} icon="📍" />
          </div>

          {/* ROW 2: Dates (Budget Removed) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <InputGroup label="Start Date" type="date" onChange={setStartDate} icon="📅" />
            <InputGroup label="Duration (Days)" placeholder="e.g. 5" type="number" onChange={setDays} icon="🌙" />
          </div>

          {/* ROW 3: Preferences (MCQs) */}
          <div className="mb-10">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-3 ml-1 tracking-wide">
              Travel Preferences (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-3">
              {interestsList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.label)}
                  className={`px-4 py-2 rounded-full text-sm font-bold border transition-all transform hover:scale-105 ${
                    selectedInterests.includes(item.label)
                      ? "bg-blue-600 text-white border-blue-600 shadow-md"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-blue-400"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={generateTrip}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all transform hover:-translate-y-1 ${
              loading 
                ? "bg-slate-200 cursor-not-allowed text-slate-400" 
                : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-purple-500/30"
            }`}
          >
            {loading ? "Designing Your Perfect Trip..." : "Generate My Dream Trip ✨"}
          </button>
        </div>

      </div>
    </div>
  );
}

// --- Helper Component ---
function InputGroup({ label, placeholder, type = "text", onChange, icon }) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-2 ml-1 tracking-wide">{label}</label>
      <div className="relative group">
        <span className="absolute left-4 top-4 text-slate-400 group-focus-within:text-blue-500 transition">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-4 py-4 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition font-medium text-lg placeholder-slate-400"
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}