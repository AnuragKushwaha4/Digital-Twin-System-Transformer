
import { Link } from "react-router-dom";

function Header() {
    return (
        <header className="w-full bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-5">
                <Link to="/login">
                    <h1 className="text-2xl font-bold text-blue-700">
                        Digital Twin System
                    </h1>
                </Link>
            </div>
        </header>
    );
}

export default Header;
