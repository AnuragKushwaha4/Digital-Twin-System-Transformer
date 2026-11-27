
export const getStatusColor = (status) => {
    switch (String(status || "").toLowerCase()) {
        case "healthy":
        case "normal":
            return "bg-green-100 text-green-700";

        case "warning":
            return "bg-yellow-100 text-yellow-700";

        case "critical":
            return "bg-red-100 text-red-700";

        default:
            return "bg-gray-100 text-gray-700";
    }
};
