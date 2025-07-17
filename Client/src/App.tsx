import "./App.css";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import loader from "./assets/speedometer-loader-unscreen.gif";

import Home from "./pages/home/home";
import AdminLogin from "./components/auth/login";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-black">
        <img
          src={loader}
          alt="Loading..."
          className="w-80 h-80 object-contain"
        />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AdminLogin />} />
    </Routes>
  );
}

export default App;
