import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image"; // <--- Using the modern library
import jsPDF from "jspdf";
import api from "../api/api";

export default function TripResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef(); 
  
  const [isSaving, setIsSaving] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  
  const { itinerary, destination } = location.state || {};

  useEffect(() => {
    if (!itinerary) {
      navigate("/dashboard");
    }
  }, [itinerary, navigate]);

  if (!itinerary) return null;

  // --- SAVE TO DB ---
  const handleSaveTrip = async () => {
    setIsSaving(true);
    try {
      await api.post("/trips/save", {
        destination: destination,
        itinerary: itinerary
      });
      alert("✅ Trip saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save trip. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- DOWNLOAD PDF (Smart Page Breaks) ---
  const handleDownloadPDF = async () => {
    setIsPdfLoading(true);
    
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pageWidth - (margin * 2);
      
      let currentY = margin;

      // 1. Add Header Text to PDF (Clean & Simple)
      pdf.setFontSize(24);
      pdf.setTextColor(40, 40, 40);
      pdf.text(destination.toUpperCase(), pageWidth / 2, currentY + 10, { align: "center" });
      
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text("Personal Itinerary", pageWidth / 2, currentY + 20, { align: "center" });
      
      currentY += 30; 

      // 2. Capture Each Card Individually
      const cards = document.querySelectorAll(".itinerary-card");

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];

        // Convert card to image
        const imgData = await toPng(card, { 
          cacheBust: true, 
          pixelRatio: 2, 
          backgroundColor: "#ffffff" 
        });

        const imgProps = pdf.getImageProperties(imgData);
        const cardHeight = (imgProps.height * contentWidth) / imgProps.width;

        // Check if card fits on page
        if (currentY + cardHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
        }

        pdf.addImage(imgData, "PNG", margin, currentY, contentWidth, cardHeight);
        currentY += cardHeight + 5;
      }

      pdf.save(`${destination}_Itinerary.pdf`);
    
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Could not generate PDF. Please try again.");
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 font-sans text-slate-800 pb-20">
      
      {/* HEADER */}
      <div className="p-6 flex justify-between items-center">
        <button 
          onClick={() => navigate("/dashboard")}
          className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2.5 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition flex items-center gap-2"
        >
          ← Plan Another Trip
        </button>

        <div className="flex gap-4">
          <button 
            onClick={handleSaveTrip}
            disabled={isSaving}
            className={`px-6 py-2.5 rounded-xl font-bold shadow-lg transition flex items-center gap-2 ${
                isSaving 
                ? "bg-emerald-800 text-white cursor-not-allowed" 
                : "bg-emerald-500 text-white hover:bg-emerald-400"
            }`}
          >
            {isSaving ? "Saving..." : "💾 Save Trip"}
          </button>

          <button 
            onClick={handleDownloadPDF}
            disabled={isPdfLoading}
            className="bg-white text-blue-600 px-6 py-2.5 rounded-xl font-bold shadow-lg hover:bg-blue-50 transition flex items-center gap-2"
          >
            {isPdfLoading ? "Generating..." : "📄 Download PDF"}
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        
        {/* Title */}
        <div className="text-center mb-12">
          <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
            Your Personal Itinerary
          </span>
          <h1 className="text-6xl font-black text-white mt-6 tracking-tight lowercase drop-shadow-md">
            {destination}
          </h1>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-10 pb-10">
          {itinerary.map((day, index) => (
            <div 
              key={index} 
              // --- HOVER EFFECT ADDED HERE ---
              className="itinerary-card bg-white rounded-[2rem] shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              <div className="p-8 border-b border-slate-50 flex items-start gap-6 bg-slate-50/50">
                <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 font-black text-3xl shadow-lg shrink-0">
                  {day.day}
                </div>
                <div className="pt-1">
                  <h3 className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-1">Day {day.day}</h3>
                  <p className="text-slate-900 font-extrabold text-2xl leading-tight">{day.theme}</p>
                </div>
              </div>

              <div className="p-8 relative bg-white">
                <div className="absolute left-[54px] top-8 bottom-8 w-0.5 bg-blue-100"></div>
                <div className="space-y-12 pl-4">
                  <TimelineItem time="09:00" label="Morning" description={day.morning} tag="EXPLORE" />
                  <TimelineItem time="14:00" label="Afternoon" description={day.afternoon} tag="ACTIVITY" />
                  <TimelineItem time="19:00" label="Evening" description={day.evening} tag="RELAX" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* (Watermark Removed) */}

      </div>
    </div>
  );
}

// Helper Component
function TimelineItem({ time, label, description, tag }) {
  return (
    <div className="flex gap-6 relative">
      <div className="flex flex-col items-center w-12 shrink-0">
        <span className="text-blue-600 font-bold text-sm mb-2">{time}</span>
        <div className="h-4 w-4 rounded-full bg-blue-500 border-4 border-white shadow-sm z-10"></div>
      </div>
      <div className="flex-grow pt-0">
        <h4 className="text-slate-900 font-bold text-lg flex items-center gap-3">{label}</h4>
        <p className="text-slate-600 text-base leading-relaxed mt-2 mb-4">{description}</p>
        <span className="inline-block px-4 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wide border border-blue-100">
          {tag}
        </span>
      </div>
    </div>
  );
}