import { useState } from "react";
import { API } from "../api/api";

export default function TripForm() {
  const [destination,setDestination]=useState("");
  const [days,setDays]=useState(3);
  const [budget,setBudget]=useState("");
  const [result,setResult]=useState(null);

  const generate = async () => {
    const res = await API.post("/api/trips/generate",{
      destination,days,budget
    });
    setResult(res.data);
  };

  return (
    <div>
      <h3>Generate Trip</h3>

      <input placeholder="Destination" onChange={e=>setDestination(e.target.value)} />
      <input placeholder="Days" onChange={e=>setDays(e.target.value)} />
      <input placeholder="Budget" onChange={e=>setBudget(e.target.value)} />

      <button onClick={generate}>Generate</button>

      {result && <pre>{JSON.stringify(result,null,2)}</pre>}
    </div>
  );
}
