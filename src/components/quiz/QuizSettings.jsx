import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses, QuizStatuses } from 'utils/constants';

const QuizSettings = () => {
    const account = JSON.parse(localStorage.getItem('account'));
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        status: null
    });
    const [quizFetchStatuses, setQuizFetchStatuses] = useState({
        get: FetchStatuses.None,
        publish: FetchStatuses.None,
        save: FetchStatuses.None,
        delete: FetchStatuses.None
    });
    const [questionFetchStatuses, setQuestionFetchStatuses] = useState({
        create: FetchStatuses.None
    });

    useEffect(() => {
        setQuizFetchStatuses({
            ...quizFetchStatuses,
            get: FetchStatuses.Loading
        });
        fetch(`http://localhost:5184/api/accounts/${account.id}/quizzes/${quizId}/details`, {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                Promise.reject(response);
            })
            .then(data => {
                setQuiz(data);
            })
            .catch(error => console.error(error))
            .finally(() =>
                setQuizFetchStatuses({
                    ...quizFetchStatuses,
                    get: FetchStatuses.None
                })
            );
    }, [account.id, quizId]);

    const handleInputQuiz = event => {
        const { name, value } = event.target;

        setQuiz({
            ...quiz,
            [name]: value
        });
    };

    const handleSaveQuiz = () => {
        setQuizFetchStatuses({
            ...quizFetchStatuses,
            save: FetchStatuses.Loading
        });

        fetch(`http://localhost:5184/api/accounts/${account.id}/quizzes/${quizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: quizId,
                title: quiz.title,
                description: quiz.description,
                status: quiz.status
            })
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() =>
                setQuizFetchStatuses({
                    ...quizFetchStatuses,
                    save: FetchStatuses.None
                })
            );
    };

    const handlePublishQuiz = () => {
        setQuizFetchStatuses({
            ...quizFetchStatuses,
            publish: FetchStatuses.Loading
        });
        fetch(`http://localhost:5184/api/accounts/${account.id}/quizzes/${quizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: quizId,
                title: quiz.title,
                description: quiz.description,
                status: QuizStatuses.Published
            })
        })
            .then(response => {
                if (response.ok) {
                    setQuiz({
                        ...quiz,
                        status: QuizStatuses.Published
                    });
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() =>
                setQuizFetchStatuses({
                    ...quizFetchStatuses,
                    publish: FetchStatuses.None
                })
            );
    };

    const handleDeleteQuiz = () => {
        setQuizFetchStatuses({
            ...quizFetchStatuses,
            delete: FetchStatuses.Loading
        });
        fetch(`http://localhost:5184/api/accounts/${account.id}/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return navigate(`/accounts/${account.id}/quizzes`);
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() =>
                setQuizFetchStatuses({
                    ...quizFetchStatuses,
                    delete: FetchStatuses.None
                })
            );
    };

    const handleCreateQuestion = () => {
        setQuestionFetchStatuses({
            ...questionFetchStatuses,
            create: FetchStatuses.Loading
        });
        fetch(`http://localhost:5184/api/quizzes/${quizId}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                text: ''
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                Promise.reject(response);
            })
            .then(data => {
                setQuiz({
                    ...quiz,
                    questions: [...quiz.questions, data]
                });
            })
            .catch(error => console.error(error))
            .finally(() =>
                setQuestionFetchStatuses({
                    ...questionFetchStatuses,
                    create: FetchStatuses.None
                })
            );
    };

    const handleDeleteQuestion = id => {
        setQuestionFetchStatuses({
            ...questionFetchStatuses,
            delete: FetchStatuses.Loading
        });
        fetch(`http://localhost:5184/api/quizzes/${quizId}/questions/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    return setQuiz({
                        ...quiz,
                        questions: questions.filter(question => question.id != id)
                    });
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() =>
                setQuestionFetchStatuses({
                    ...questionFetchStatuses,
                    delete: FetchStatuses.None
                })
            );
    };

    const handleInputQuestion = (event, id) => {
        const { name, value } = event.target;
        const { questions = [] } = quiz;

        const targetQuestion = questions.find(it => it.id == id);

        if (targetQuestion) {
            targetQuestion[name] = value;
        }

        const newQuestions = questions.map(it =>
            it.id == id
                ? {
                      ...targetQuestion
                  }
                : it
        );

        setQuiz({
            ...quiz,
            questions: newQuestions
        });
    };

    const handleSaveQuestion = id => {
        const { questions = [] } = quiz;
        const targetQuestion = questions.find(it => it.id == id);

        setQuestionFetchStatuses({
            ...quizFetchStatuses,
            save: FetchStatuses.Loading
        });

        fetch(`http://localhost:5184/api/quizzes/${quizId}/questions/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id,
                text: targetQuestion.text
            })
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() =>
                setQuestionFetchStatuses({
                    ...quizFetchStatuses,
                    save: FetchStatuses.None
                })
            );
    };

    const handleCreateAnswer = questionId => {
        fetch(`http://localhost:5184/api/questions/${questionId}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                text: ''
            })
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                Promise.reject(response);
            })
            .then(data => {
                const question = quiz.questions.find(it => it.id == questionId);
                question.answers = [...question.answers, data];

                const questions = quiz.questions.map(it => {
                    if (it.id == questionId) return question;

                    return it;
                });

                setQuiz({
                    ...quiz,
                    questions
                });
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const handleInputAnswer = (event, questionId, answerId) => {
        const { name, value } = event.target;
        const question = quiz.questions.find(it => it.id == questionId);
        const answer = question.answers.find(it => it.id == answerId);

        answer[name] = value;
        const newAnswers = question.answers.map(it => {
            if (it.id == answerId) return answer;

            return it;
        });

        const newQuestion = {
            ...question,
            answers: newAnswers
        };

        const newQuestions = quiz.questions.map(it => {
            if (it.id == questionId) return newQuestion;

            return it;
        });

        setQuiz({
            ...quiz,
            questions: newQuestions
        });
    };

    const handleChooseCorrectAnswer = (questionId, answerId) => {
        const question = quiz.questions.find(it => it.id == questionId);
        const answer = question.answers.find(it => it.id == answerId);

        answer['isCorrect'] = answer['isCorrect'] ? false : true;
        const newAnswers = question.answers.map(it => {
            if (it.id == answerId) return answer;

            return it;
        });

        const newQuestion = {
            ...question,
            answers: newAnswers
        };

        const newQuestions = quiz.questions.map(it => {
            if (it.id == questionId) return newQuestion;

            return it;
        });

        setQuiz({
            ...quiz,
            questions: newQuestions
        });
    };

    const hanldeSaveAnswer = (questionId, answerId) => {
        const question = quiz.questions.find(it => it.id == questionId);
        const answer = question.answers.find(it => it.id == answerId);

        fetch(`http://localhost:5184/api/questions/${questionId}/answers/${answerId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(answer)
        })
            .then(response => {
                if (response.ok) {
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const hanldeDeleteAnswer = (questionId, answerId) => {
        const question = quiz.questions.find(it => it.id == questionId);

        fetch(`http://localhost:5184/api/questions/${questionId}/answers/${answerId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    const newAnswers = question.answers.filter(it => it.id != answerId);

                    const newQuestion = {
                        ...question,
                        answers: newAnswers
                    };

                    const newQuestions = quiz.questions.map(it => {
                        if (it.id == questionId) return newQuestion;

                        return it;
                    });

                    return setQuiz({
                        ...quiz,
                        questions: newQuestions
                    });
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error))
            .finally(() => {});
    };

    const { questions = [] } = quiz;

    if (quizFetchStatuses.get == FetchStatuses.Loading)
        return (
            <div className="w-full h-full flex justify-center items-center border border-solid border-black p-2">
                Spining...
            </div>
        );

    return (
        <div className="flex-1 border border-solid border-black p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2>{quizId ? 'Do whatever you want to this quiz' : 'Yes, another quiz'}</h2>
                <div className="flex items-center gap-2">
                    {quiz.status == QuizStatuses.Draft && (
                        <Button className="bg-amber-300" onClick={handlePublishQuiz}>
                            {quizFetchStatuses.publish == FetchStatuses.Loading
                                ? 'Spining...'
                                : 'Publish'}
                        </Button>
                    )}
                    <Button className="bg-lime-50" onClick={handleSaveQuiz}>
                        {quizFetchStatuses.save == FetchStatuses.Loading ? 'Spining...' : 'Save'}
                    </Button>
                    <Button className="bg-red-100" onClick={handleDeleteQuiz}>
                        {quizFetchStatuses.delete == FetchStatuses.Loading
                            ? 'Spining...'
                            : 'Delete'}
                    </Button>
                    <Link
                        to="/quizzes"
                        onClick={event => {
                            event.preventDefault();
                            history.back();
                        }}
                    >
                        <Button className="bg-indigo-300">Back</Button>
                    </Link>
                </div>
            </div>
            <form onSubmit={event => event.preventDefault()} className="mt-4">
                <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                    <div className="px-2 py-1 border border-solid border-black text-sm w-fit">
                        {quiz.status == QuizStatuses.Draft ? 'Draft' : 'Published'}
                    </div>
                    <legend>Infomation</legend>
                    <label className="flex flex-col gap-2">
                        Title:
                        <input
                            className="border border-solid border-black outline-none px-4 py-2"
                            name="title"
                            placeholder="Titled this quiz, please"
                            value={quiz.title}
                            onChange={handleInputQuiz}
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        Description:
                        <textarea
                            className="border border-solid border-black outline-none px-4 py-2"
                            name="description"
                            placeholder="Give it some descriptive words"
                            value={quiz.description}
                            onChange={handleInputQuiz}
                        />
                    </label>
                </fieldset>
            </form>
            <form onSubmit={event => event.preventDefault()} className="mt-4">
                <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                    <legend>Questions</legend>
                    <div className="flex flex-col gap-4">
                        {questions.map(question => {
                            const { answers = [], text, id: questionId } = question;

                            return (
                                <div key={questionId} className="flex flex-col gap-2">
                                    <div className="cursor-pointer px-4 py-2 border border-solid border-black bg-orange-100 text-left flex items-center justify-between">
                                        <p>Banana {questionId}</p>
                                        <Button
                                            onClick={event => {
                                                event.stopPropagation();
                                                handleDeleteQuestion(questionId);
                                            }}
                                            className="bg-red-300"
                                        >
                                            Please forgive me
                                        </Button>
                                    </div>
                                    <div className="flex-col flex gap-4 px-2 overflow-hidden">
                                        <label className="flex flex-col gap-2">
                                            Question:
                                            <div className="flex items-center gap-2">
                                                <textarea
                                                    className="w-full border border-solid border-black outline-none px-4 py-2"
                                                    value={text}
                                                    placeholder="Please type the text of this question"
                                                    name="text"
                                                    onChange={event =>
                                                        handleInputQuestion(event, questionId)
                                                    }
                                                />
                                                <Button
                                                    onClick={() => handleSaveQuestion(questionId)}
                                                >
                                                    Save
                                                </Button>
                                            </div>
                                        </label>
                                        <div className="flex flex-col gap-2">
                                            <p>Answers:</p>
                                            {answers.map(answer => {
                                                const { isCorrect, text, id: answerId } = answer;

                                                return (
                                                    <label
                                                        key={answerId}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isCorrect}
                                                            name="isCorrect"
                                                            onChange={() =>
                                                                handleChooseCorrectAnswer(
                                                                    questionId,
                                                                    answerId
                                                                )
                                                            }
                                                        />
                                                        <textarea
                                                            className="w-full border border-solid border-black outline-none px-4 py-2"
                                                            value={text}
                                                            placeholder="Please type the text of this answer, don't forget to choose at least one correct answer"
                                                            name="text"
                                                            onChange={event =>
                                                                handleInputAnswer(
                                                                    event,
                                                                    questionId,
                                                                    answerId
                                                                )
                                                            }
                                                        />
                                                        <Button
                                                            className="flex-shrink-0"
                                                            onClick={() =>
                                                                hanldeSaveAnswer(
                                                                    questionId,
                                                                    answerId
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </Button>
                                                        <Button
                                                            className="flex-shrink-0"
                                                            onClick={() =>
                                                                hanldeDeleteAnswer(
                                                                    questionId,
                                                                    answerId
                                                                )
                                                            }
                                                        >
                                                            I&apos;m sorry{' '}
                                                        </Button>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <Button
                                            className="bg-blue-100 w-full"
                                            onClick={() => handleCreateAnswer(questionId)}
                                        >
                                            Meow
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                        <Button
                            disabled={questionFetchStatuses.create == FetchStatuses.Loading}
                            onClick={handleCreateQuestion}
                            className="bg-orange-300"
                        >
                            {questionFetchStatuses.create == FetchStatuses.Loading
                                ? 'Spining...'
                                : 'Can i have another one, please? please, one more'}
                        </Button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default QuizSettings;
