import Login from 'components/authentication/Login';
import Signup from 'components/authentication/Signup';
import CollectionDetails from 'components/collection/CollectionDetails';
import CollectionLayout from 'components/collection/CollectionLayout';
import Collections from 'components/collection/Collections';
import CollectionSettings from 'components/collection/CollectionSettings';
import Layout from 'components/common/Layout';
import QuizDetails from 'components/quiz/QuizDetails';
import QuizPlayground from 'components/quiz/QuizPlayground';
import QuizSettings from 'components/quiz/QuizSettings';
import Quizzes from 'components/quiz/Quizzes';
import QuizzLayout from 'components/quiz/QuizzLayout';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';
import Setttings from 'components/common/Setttings';

const AuthenticationWrapper = ({ children, isAuthenticationPage = false }) => {
    const account = JSON.parse(localStorage.getItem('account'));

    if (isAuthenticationPage) {
        if (account) return <Navigate to="/quizzes" />;

        return children;
    } else {
        if (account) return children;

        return <Navigate to="/log-in" />;
    }
};

function App() {
    const router = createBrowserRouter([
        {
            path: '/log-in',
            element: (
                <AuthenticationWrapper isAuthenticationPage>
                    <Login />
                </AuthenticationWrapper>
            )
        },
        {
            path: '/sign-up',
            element: (
                <AuthenticationWrapper isAuthenticationPage>
                    <Signup />
                </AuthenticationWrapper>
            )
        },
        {
            path: '/',
            element: (
                <AuthenticationWrapper>
                    <Layout />
                </AuthenticationWrapper>
            ),
            children: [
                {
                    path: '/quizzes',
                    element: <QuizzLayout />,
                    children: [
                        { index: true, element: <Quizzes /> },
                        { path: ':quizId', element: <QuizDetails /> },
                        { path: ':quizId/play', element: <QuizPlayground /> },
                        { path: ':quizId/edit', element: <QuizSettings /> },
                        { path: 'create', element: <QuizSettings /> }
                    ]
                },
                {
                    path: '/collections',
                    element: <CollectionLayout />,
                    children: [
                        { index: true, element: <Collections /> },
                        { path: ':collectionId', element: <CollectionDetails /> },
                        { path: ':collectionId/edit', element: <CollectionSettings /> },
                        { path: 'create', element: <CollectionSettings /> }
                    ]
                },
                {
                    path: '/settings',
                    element: <Setttings />
                }
            ]
        }
    ]);
    return <RouterProvider router={router} />;
}

export default App;
