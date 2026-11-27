
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Header from "./Components/CommanComponent/Header";

import Register from "./Components/AuthComponent/Register";
import Login from "./Components/AuthComponent/Login";
import Health from "./Components/CommanComponent/Health";

import TransformerDashboard from "./Components/TransformerComponent/TransformerDashboard";

function App() {

    return (
        <BrowserRouter>
            <Health />
            <Header />

            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/transformers"
                    element={<TransformerDashboard />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;
