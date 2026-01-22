import { useEffect,useState } from "react";
import { API } from "../api/api";

export default function MyTrips() {
  const [trips,setTrips]=useState([]);

  useEffect(()=>{
    API.get("/api/trips/my")
      .then(res=>setTrips(res.data));
  },[]);

  return (
    <div>
      <h3>My Trips</h3>
      {trips.map(t=>(
        <pre key={t._id}>{JSON.stringify(t,null,2)}</pre>
      ))}
    </div>
  );
}
