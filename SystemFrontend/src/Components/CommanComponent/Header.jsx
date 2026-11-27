
import { useLocation, useNavigate } from "react-router-dom";
import { logoutUser } from "../../Http/http";

function Header() {

    const navigate = useNavigate();
    const location = useLocation();

    const isDashboard = location.pathname === "/transformers";

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm">

            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

                <h1
                    onClick={() => navigate(isDashboard ? "/transformers" : "/login")}
                    className="text-2xl font-bold text-blue-700 cursor-pointer"
                >
                    Digital Twin System
                </h1>

                {isDashboard && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5 rounded-lg font-medium transition"
                    >
                        Logout
                    </button>
                )}

            </div>

        </header>
    );
}

export default Header;
