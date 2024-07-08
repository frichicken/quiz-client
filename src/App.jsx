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
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Setttings from 'components/Setttings';

function App() {
    const router = createBrowserRouter([
        {
            path: '/log-in',
            element: <Login />
        },
        {
            path: '/sign-up',
            element: <Signup />
        },
        {
            path: '/',
            element: <Layout />,
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
