import { Navigate, Outlet } from "react-router-dom";

function AuthenticationLayout() {
    const account = JSON.parse(localStorage.getItem('account'));

    if (account) return <Navigate to={`/accounts/${account.id}/quizzes`} />;

    return (
        <div className="w-full h-screen p-4 flex justify-center items-center">
            <div className="w-full max-w-lg p-4 flex flex-col gap-2 border border-solid border-black">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthenticationLayout;
