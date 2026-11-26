
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./Components/CommanComponent/Header";
import Register from "./Components/AuthComponent/Register";
import Login from "./Components/AuthComponent/Login";

function App() {
    return (
        <BrowserRouter>

            <Header />

            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/register" element={<Register />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/transformers"
                    element={
                        <div className="p-10 text-center text-2xl font-bold">
                            Transformer Dashboard Coming Soon
                        </div>
                    }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>

        </BrowserRouter>
    );
}

export default App;
