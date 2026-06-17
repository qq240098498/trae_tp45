import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import Inventory from "@/pages/Inventory";
import Risk from "@/pages/Risk";
import Procurement from "@/pages/Procurement";
import Scheduling from "@/pages/Scheduling";
import Balance from "@/pages/Balance";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/risk" element={<Risk />} />
          <Route path="/procurement" element={<Procurement />} />
          <Route path="/scheduling" element={<Scheduling />} />
          <Route path="/balance" element={<Balance />} />
        </Route>
      </Routes>
    </Router>
  );
}
