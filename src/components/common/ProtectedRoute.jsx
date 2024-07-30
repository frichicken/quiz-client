import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const account = JSON.parse(localStorage.getItem('account'));

    if (account) return children;

    return <Navigate to="/log-in" />;
};

export default ProtectedRoute