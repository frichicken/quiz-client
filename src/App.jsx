import Login from 'components/authentication/Login';
import Signup from 'components/authentication/Signup';
import CollectionDetails from 'components/collection/CollectionDetails';
import Collections from 'components/collection/Collections';
import Layout from 'components/common/Layout';
import Setttings from 'components/common/Setttings';
import YourLibraryLayout from 'components/common/YourLibraryLayout';
import QuizDetails from 'components/quiz/QuizDetails';
import QuizLearn from 'components/quiz/QuizLearn';
import QuizRunLayout from 'components/quiz/QuizRunLayout';
import QuizSettings from 'components/quiz/QuizSettings';
import QuizTest from 'components/quiz/QuizTest';
import Quizzes from 'components/quiz/Quizzes';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import './index.css';

const AuthenticationWrapper = ({ children, isAuthenticationPage = false }) => {
    const account = JSON.parse(localStorage.getItem('account'));

    if (isAuthenticationPage) {
        if (account) return <Navigate to={`/accounts/${account.id}/quizzes`} />;

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
            element: (
                <AuthenticationWrapper>
                    <Layout />
                </AuthenticationWrapper>
            ),
            children: [
                {
                    element: <YourLibraryLayout />,
                    children: [
                        {
                            path: 'accounts/:accountId/quizzes',
                            children: [{ index: true, element: <Quizzes /> }]
                        },
                        {
                            path: 'accounts/:accountId/collections',
                            children: [{ index: true, element: <Collections /> }]
                        }
                    ]
                },
                {
                    path: 'settings',
                    element: <Setttings />
                },
                {
                    path: 'accounts/:accountId/quizzes',
                    children: [
                        { path: ':quizId', element: <QuizDetails /> },
                        { path: ':quizId/edit', element: <QuizSettings /> }
                    ]
                },
                {
                    path: 'accounts/:accountId/collections',
                    children: [{ path: ':collectionId', element: <CollectionDetails /> }]
                }
            ]
        },
        {
            element: (
                <AuthenticationWrapper>
                    <QuizRunLayout />
                </AuthenticationWrapper>
            ),
            children: [
                {
                    path: 'accounts/:accountId/quizzes/:quizId/learn',
                    element: <QuizLearn />
                },
                {
                    path: 'accounts/:accountId/quizzes/:quizId/test',
                    element: <QuizTest />
                }
            ]
        }
    ]);
    return <RouterProvider router={router} />;
}

export default App;
