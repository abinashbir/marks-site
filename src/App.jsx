import { Routes, Route } from "react-router-dom";
import Result from "./Result";
import Admin from "./Admin";

export default function App(){
  return(
    <Routes>
      <Route path="/" element={<Result/>}/>
      <Route path="/admin" element={<Admin/>}/>
    </Routes>
  );
}
