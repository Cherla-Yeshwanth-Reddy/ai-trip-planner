import express from "express";
import { health } from "./health-endpoints.js";

const app = express();

app.get("/health",health);

app.listen(5000,()=>{
  console.log("Dev server running on 5000");
});
