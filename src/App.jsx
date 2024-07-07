import clsx from 'clsx';
import { useState } from 'react';
import './index.css';
import Button from 'components/Button';

function ThisAllAboutQuizzes() {
    const [quizzes] = useState([
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'Friends',
            description: 'A challenge to know your friends better'
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
        <div className="w-full h-screen flex flex-col">
            <nav className="p-4 flex justify-between items-center border-b border-b-black">
                <div className="flex items-center gap-4">
                    <div className="w-[32px] h-[32px] border border-solid border-black rounded-full overflow-hidden">
                        <img className="w-full h-full object-cover" />
                    </div>
                    <button className="border border-solid border-black px-4 py-2">Settings</button>
                    <button className="border border-solid border-black px-4 py-2">Log out</button>
                    <button className="border border-solid border-black px-4 py-2">
                        Terms and policies
                    </button>
                </div>
                <ul className="flex items-center gap-4 list-none">
                    <li className="border border-solid border-black px-4 py-2">Home</li>
                    <li className="border border-solid border-black px-4 py-2">Collections</li>
                </ul>
            </nav>
            <div className="p-4 flex flex-col gap-4 flex-1">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-lg tracking-wider border border-solid border-black px-4 py-2">
                        QUIZZES LADIES and GENTLEMEN
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
                                >
                                    <div>
                                        <p>{title}</p>
                                        <p className="text-sm">{description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button className="bg-red-100">Let&apos;s play</Button>
                                        <Button className="bg-green-100">Fix it</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="hidden flex-1 border border-solid border-black p-4 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2>Do whatever you want to this quiz</h2>
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
                                        placeholder="Titled this quiz, please"
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
                                <legend>Questions</legend>
                                <div className="flex flex-col gap-4">
                                    {questions.map((question, index) => {
                                        const { answers, text, isOpen } = question;

                                        return (
                                            <div key={index} className="flex flex-col gap-2">
                                                <div
                                                    className="cursor-pointer px-4 py-2 border border-solid border-black bg-orange-100 text-left flex items-center justify-between"
                                                    onClick={() => toggleQuestionAccordion(index)}
                                                >
                                                    <p>Banana {index + 1}</p>
                                                    <button
                                                        onClick={event => {
                                                            event.stopPropagation();
                                                            hanldRemoveQuestion(index);
                                                        }}
                                                        className="px-4 py-2 border border-solid border-black bg-red-300"
                                                    >
                                                        Please forgive me
                                                    </button>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        'flex-col gap-4 px-2 overflow-hidden',
                                                        isOpen ? 'flex' : 'hidden'
                                                    )}
                                                >
                                                    <label className="flex flex-col gap-2">
                                                        Question:
                                                        <textarea
                                                            className="w-full border border-solid border-black outline-none px-4 py-2"
                                                            value={text}
                                                            placeholder="Please type the text of this question"
                                                            name="text"
                                                        />
                                                    </label>
                                                    <div className="flex flex-col gap-2">
                                                        <p>Answers:</p>
                                                        {answers.map((answer, index) => {
                                                            const { isCorrect, text } = answer;

                                                            return (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isCorrect}
                                                                        name="isCorrect"
                                                                    />
                                                                    <textarea
                                                                        className="w-full border border-solid border-black outline-none px-4 py-2"
                                                                        value={text}
                                                                        placeholder="Please type the text of this answer, don't forget to choose at least one correct answer"
                                                                        name="text"
                                                                    />
                                                                    <button className="flex-shrink-0 px-4 py-2 border border-solid border-black bg-red-300">
                                                                        I&apos;m sorry{' '}
                                                                    </button>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                    <button
                                                        className="border border-solid border-black px-4 py-2 bg-blue-100"
                                                        onClick={() => handleCreateAnswer(index)}
                                                    >
                                                        Meow
                                                    </button>
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
                    <div className="flex-1 flex flex-col gap-6 border border-solid border-black p-4 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <p>You know what?</p>
                                <p className="text-sm">They are just silly questions</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Button>Your parents proud</Button>
                                <Button>You&apos;re failure</Button>
                            </div>
                        </div>
                        {questions.map((question, index) => {
                            const { text, answers } = question;

                            return (
                                <div key={index} className="flex flex-col gap-2">
                                    <p>{index + 1}/</p>
                                    <p>{text}</p>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {answers.map((answer, index) => {
                                            const { text } = answer;
                                            return (
                                                <button
                                                    key={index}
                                                    className="border border-solid border-black px-4 py-2 flex-1 min-w-40"
                                                >
                                                    {text}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function ThisAllAboutCollections() {
    const [quizzes] = useState([
        {
            title: 'You know what?',
            description: 'They are just silly questions'
        },
        {
            title: 'Friends',
            description: 'A challenge to know your friends better'
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
        <div className="w-full h-screen flex flex-col">
            <nav className="p-4 flex justify-between items-center border-b border-b-black">
                <div className="flex items-center gap-4">
                    <div className="w-[32px] h-[32px] border border-solid border-black rounded-full overflow-hidden">
                        <img className="w-full h-full object-cover" />
                    </div>
                    <button className="border border-solid border-black px-4 py-2">Settings</button>
                    <button className="border border-solid border-black px-4 py-2">Log out</button>
                    <button className="border border-solid border-black px-4 py-2">
                        Terms and policies
                    </button>
                </div>
                <ul className="flex items-center gap-4 list-none">
                    <li className="border border-solid border-black px-4 py-2">Home</li>
                    <li className="border border-solid border-black px-4 py-2">Collections</li>
                </ul>
            </nav>
            <div className="p-4 flex flex-col gap-4 flex-1">
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
                                >
                                    <div>
                                        <p>{title}</p>
                                        <p className="text-sm">{description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button className="bg-red-100">Let&apos;s play</Button>
                                        <Button className="bg-green-100">Fix it</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="hidden flex-1 border border-solid border-black p-4 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <h2>Do whatever you want to this quiz</h2>
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
                                        placeholder="Titled this quiz, please"
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
                                <legend>Questions</legend>
                                <div className="flex flex-col gap-4">
                                    {questions.map((question, index) => {
                                        const { answers, text, isOpen } = question;

                                        return (
                                            <div key={index} className="flex flex-col gap-2">
                                                <div
                                                    className="cursor-pointer px-4 py-2 border border-solid border-black bg-orange-100 text-left flex items-center justify-between"
                                                    onClick={() => toggleQuestionAccordion(index)}
                                                >
                                                    <p>Banana {index + 1}</p>
                                                    <button
                                                        onClick={event => {
                                                            event.stopPropagation();
                                                            hanldRemoveQuestion(index);
                                                        }}
                                                        className="px-4 py-2 border border-solid border-black bg-red-300"
                                                    >
                                                        Please forgive me
                                                    </button>
                                                </div>
                                                <div
                                                    className={clsx(
                                                        'flex-col gap-4 px-2 overflow-hidden',
                                                        isOpen ? 'flex' : 'hidden'
                                                    )}
                                                >
                                                    <label className="flex flex-col gap-2">
                                                        Question:
                                                        <textarea
                                                            className="w-full border border-solid border-black outline-none px-4 py-2"
                                                            value={text}
                                                            placeholder="Please type the text of this question"
                                                            name="text"
                                                        />
                                                    </label>
                                                    <div className="flex flex-col gap-2">
                                                        <p>Answers:</p>
                                                        {answers.map((answer, index) => {
                                                            const { isCorrect, text } = answer;

                                                            return (
                                                                <label
                                                                    key={index}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isCorrect}
                                                                        name="isCorrect"
                                                                    />
                                                                    <textarea
                                                                        className="w-full border border-solid border-black outline-none px-4 py-2"
                                                                        value={text}
                                                                        placeholder="Please type the text of this answer, don't forget to choose at least one correct answer"
                                                                        name="text"
                                                                    />
                                                                    <button className="flex-shrink-0 px-4 py-2 border border-solid border-black bg-red-300">
                                                                        I&apos;m sorry{' '}
                                                                    </button>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                    <button
                                                        className="border border-solid border-black px-4 py-2 bg-blue-100"
                                                        onClick={() => handleCreateAnswer(index)}
                                                    >
                                                        Meow
                                                    </button>
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
                    <div className="flex-1 flex flex-col gap-6 border border-solid border-black p-4 overflow-y-auto">
                        <div className="flex items-center justify-between">
                            <div>
                                <p>You know what?</p>
                                <p className="text-sm">They are just silly questions</p>
                            </div>
                            <div className="flex gap-4 items-center">
                                <Button>Your parents proud</Button>
                                <Button>You&apos;re failure</Button>
                            </div>
                        </div>
                        {questions.map((question, index) => {
                            const { text, answers } = question;

                            return (
                                <div key={index} className="flex flex-col gap-2">
                                    <p>{index + 1}/</p>
                                    <p>{text}</p>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        {answers.map((answer, index) => {
                                            const { text } = answer;
                                            return (
                                                <button
                                                    key={index}
                                                    className="border border-solid border-black px-4 py-2 flex-1 min-w-40"
                                                >
                                                    {text}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    return <ThisAllAboutCollections />;
}

export default App;
