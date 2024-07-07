import clsx from 'clsx';
import Login from 'components/authentication/Login';
import Signup from 'components/authentication/Signup';
import Button from 'components/common/Button';
import Layout from 'components/common/Layout';
import QuizDetails from 'components/quiz/QuizDetails';
import QuizPlayground from 'components/quiz/QuizPlayground';
import Quizzes from 'components/quiz/Quizzes';
import QuizzLayout from 'components/quiz/QuizzLayout';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import QuizSettings from 'components/quiz/QuizSettings';

function ThisAllAboutCollections() {
    const [quizzes] = useState([
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'Friends',
            description: 'A challenge to know your friends better'
        },
        {
            title: 'Friends',
            description: 'A challenge to know your friends better'
        },
        {
            title: 'Friends',
            description: 'A challenge to know your friends better'
        },
        {
            title: 'Friends',
            description: 'A challenge to know your friends better'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        }
    ]);
    const [questions, setQuestions] = useState([
        {
            text: 'How many cats do you have?',
            answers: [
                { isCorrect: true, text: '1' },
                { isCorrect: true, text: '3' }
            ],
            isOpen: true
        },
        {
            text: 'How are you?',
            answers: [
                { isCorrect: true, text: "I'm you" },
                { isCorrect: false, text: "I'm me" },
                { isCorrect: false, text: "I'm good" },
                { isCorrect: false, text: 'And you?' }
            ],
            isOpen: true
        }
    ]);
    const [mode, setMode] = useState(1);

    const handleCreateQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: '',
                answers: [
                    { isCorrect: false, text: '', isOpen: true },
                    { isCorrect: false, text: '', isOpen: true }
                ]
            }
        ]);
    };

    const handleCreateAnswer = which => {
        setQuestions(
            questions.map((question, index) => {
                if (index == which) {
                    question.answers.push({
                        text: '',
                        isCorrect: false
                    });
                }

                return question;
            })
        );
    };

    const toggleQuestionAccordion = which => {
        setQuestions(
            questions.map((question, index) => {
                if (index == which) question.isOpen = question.isOpen ? false : true;

                return question;
            })
        );
    };

    const hanldRemoveQuestion = which => {
        setQuestions(questions.filter((question, index) => index != which));
    };

    return (
        <>
            <div className="w-full h-screen flex flex-col">
                <nav className="p-4 flex justify-between items-center border-b border-b-black">
                    <div className="flex items-center gap-4">
                        <div className="w-[32px] h-[32px] border border-solid border-black rounded-full overflow-hidden">
                            <img className="w-full h-full object-cover" />
                        </div>
                        <button className="border border-solid border-black px-4 py-2">
                            Settings
                        </button>
                        <button className="border border-solid border-black px-4 py-2">
                            Log out
                        </button>
                        <button className="border border-solid border-black px-4 py-2">
                            Terms and policies
                        </button>
                    </div>
                    <ul className="flex items-center gap-4 list-none">
                        <li className="border border-solid border-black px-4 py-2">Home</li>
                        <li className="border border-solid border-black px-4 py-2">Collections</li>
                    </ul>
                </nav>
                <div className="p-4 flex flex-col gap-4 flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-lg tracking-wider border border-solid border-black px-4 py-2">
                            COLLECTIONS DUDES
                        </h1>
                        <div className="flex items-center gap-4">
                            <Button>Just hit a button Morty, give me a beat</Button>
                            <input
                                className="border border-solid border-black outline-none px-4 py-2 min-w-[28rem]"
                                name="keyword"
                                placeholder="Your grandma is going to check your search history"
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 gap-4 overflow-hidden">
                        <div className="w-full h-full max-w-lg flex flex-col gap-2 border border-solid border-black p-2 overflow-y-auto">
                            {quizzes.map((quiz, index) => {
                                const { title, description } = quiz;

                                return (
                                    <div
                                        key={index}
                                        className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                                        onClick={() => setMode(0)}
                                    >
                                        <div>
                                            <p>{title}</p>
                                            <p className="text-sm">{description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    setMode(1);
                                                }}
                                                className="bg-green-100"
                                            >
                                                Mario
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div
                            className={clsx(
                                'flex-1 border border-solid border-black p-4 overflow-y-auto',
                                mode == 1 ? '' : 'hidden'
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <h2>Do whatever you want to this collection</h2>
                                <div className="flex items-center gap-2">
                                    <button className="px-4 py-2 border border-solid border-black bg-amber-300">
                                        Heck yes
                                    </button>
                                    <button className="px-4 py-2 border border-solid border-black bg-indigo-300">
                                        Deny
                                    </button>{' '}
                                    <button className="px-4 py-2 border border-solid border-black bg-red-100">
                                        Let&apos;s say goodbye
                                    </button>
                                </div>
                            </div>
                            <form onSubmit={event => event.preventDefault()} className="mt-4">
                                <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                                    <legend>Infomation</legend>
                                    <label className="flex flex-col gap-2">
                                        Title:
                                        <input
                                            className="border border-solid border-black outline-none px-4 py-2"
                                            name="title"
                                            placeholder="Titled this collection, please"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-2">
                                        Description:
                                        <input
                                            className="border border-solid border-black outline-none px-4 py-2"
                                            name="description"
                                            placeholder="Give it some descriptive words"
                                        />
                                    </label>
                                </fieldset>
                            </form>
                            <form onSubmit={event => event.preventDefault()} className="mt-4">
                                <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                                    <legend>Quizzes</legend>
                                    <div className="flex flex-col gap-4">
                                        {quizzes.map((quizz, index) => {
                                            const { title, description } = quizz;

                                            return (
                                                <div
                                                    key={index}
                                                    className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p>{title}</p>
                                                        <p className="text-sm">{description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Button className="bg-red-200">
                                                            Please forgive me
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <button
                                            className="border border-solid border-black px-4 py-2 bg-orange-300"
                                            onClick={handleCreateQuestion}
                                        >
                                            Can i have another one, please? please, one more
                                        </button>
                                    </div>
                                </fieldset>
                            </form>
                        </div>
                        <form
                            className={clsx(
                                'flex-1 border border-solid border-black p-4',
                                mode == 0 ? '' : 'hidden'
                            )}
                        >
                            <fieldset className="flex flex-col gap-2 h-full border border-solid border-black p-4 overflow-y-auto">
                                <legend>Quizzes</legend>
                                {quizzes.map((quiz, index) => {
                                    const { title, description } = quiz;

                                    return (
                                        <div
                                            key={index}
                                            className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between bg-rose-50"
                                        >
                                            <div>
                                                <p>{title}</p>
                                                <p className="text-sm">{description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <div className="hidden fixed inset-0 bg-[rgba(0,0,0,0.2)] w-full h-screen flex justify-center items-center">
                <div className="flex flex-col items-center gap-4 p-4 w-full max-w-md max-h-96 border border-solid border-black bg-indigo-50">
                    <div className="flex justify-end w-full">
                        <Button>Close</Button>
                    </div>
                    <input
                        className="border border-solid border-black outline-none px-4 py-2 w-full"
                        name="keyword"
                        placeholder="Your grandma is going to check your search history"
                    />
                    <div className="flex flex-col gap-2 w-full overflow-auto">
                        {quizzes.map((quiz, index) => {
                            const { title, description } = quiz;

                            return (
                                <div
                                    key={index}
                                    className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between bg-rose-50"
                                >
                                    <div>
                                        <p>{title}</p>
                                        <p className="text-sm">{description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button className="bg-green-100">I choose this</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

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
                    element: <QuizzLayout />,
                    children: [
                        { index: true, element: <Quizzes /> },
                        { path: ':quizId', element: <QuizDetails /> },
                        { path: ':quizId/play', element: <QuizPlayground /> },
                        { path: ':quizId/edit', element: <QuizSettings /> },
                        { path: 'create', element: <QuizSettings /> }
                    ]
                }
            ]
        }
    ]);
    return <RouterProvider router={router} />;
}

export default App;
