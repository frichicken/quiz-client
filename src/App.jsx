import AuthenticationLayout from 'components/authentication/AuthenticationLayout';
import Login from 'components/authentication/Login';
import Signup from 'components/authentication/Signup';
import CollectionDetails from 'components/collection/CollectionDetails';
import Collections from 'components/collection/Collections';
import ProtectedRoute from 'components/common/ProtectedRoute';
import RootLayout from 'components/common/RootLayout';
import Setttings from 'components/common/Setttings';
import YourLibraryLayout from 'components/common/YourLibraryLayout';
import QuizDetails from 'components/quiz/QuizDetails';
import QuizLearn from 'components/quiz/QuizLearn';
import QuizRunLayout from 'components/quiz/QuizRunLayout';
import QuizSettings from 'components/quiz/QuizSettings';
import QuizTest from 'components/quiz/QuizTest';
import QuizList from 'components/quiz/QuizList';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

function App() {
    const router = createBrowserRouter([
        {
            element: <AuthenticationLayout />,
            children: [
                {
                    path: '/log-in',
                    element: <Login />
                },
                {
                    path: '/sign-up',
                    element: <Signup />
                }
            ]
        },
        {
            element: (
                <ProtectedRoute>
                    <RootLayout />
                </ProtectedRoute>
            ),
            children: [
                {
                    element: <YourLibraryLayout />,
                    children: [
                        {
                            path: 'accounts/:accountId/quizzes',
                            element: <QuizList />
                        },
                        {
                            path: 'accounts/:accountId/collections',
                            element: <Collections />
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
                <ProtectedRoute>
                    <QuizRunLayout />
                </ProtectedRoute>
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
