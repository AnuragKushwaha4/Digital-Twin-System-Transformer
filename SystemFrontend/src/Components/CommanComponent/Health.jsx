import { useEffect, useRef } from "react";
import api from "../../Http/http";

function Health() {

    const requestInProgress = useRef(false);

    useEffect(() => {

        const checkServerHealth = async () => {

            // Prevent overlapping requests
            if (requestInProgress.current) return;

            requestInProgress.current = true;

            try {
                const response = await api.get("/api/health");

                if (response.status === 200) {
                    console.log("Backend is awake:", response.data);
                }

            } catch (error) {
                console.error("Backend health check failed:", error.message);
            } finally {
                requestInProgress.current = false;
            }
        };

        // First request immediately
        checkServerHealth();

        // Send request every 10 minutes
        const interval = setInterval(
            checkServerHealth,
            10 * 60 * 1000
        );

        return () => clearInterval(interval);

    }, []);

    return null;
}

export default Health;