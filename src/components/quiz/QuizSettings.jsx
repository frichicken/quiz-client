import clsx from 'clsx';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { debounce } from 'utils';
import { FetchStatuses, QuizStatuses } from 'utils/constants';

const QuizSettings = () => {
    const account = JSON.parse(localStorage.getItem('account'));
    const { quizId } = useParams();
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

    // Handle quizzes
    const handleInputQuizDebounce = debounce(event => {
        const { value, name } = event.target;

        const newQuiz = {
            ...quiz,
            [name]: value
        };

        setQuiz({
            ...quiz,
            [name]: value
        });

        handleUpdateQuiz(newQuiz);
    }, 800);

    const handleUpdateQuiz = quiz => {
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
                text: 'Question'
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

    // Handle questions
    const handleInputQuestion = debounce((event, id) => {
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

        handleUpdateQuestion(targetQuestion);
    }, 800);

    const handleUpdateQuestion = question => {
        setQuestionFetchStatuses({
            ...quizFetchStatuses,
            save: FetchStatuses.Loading
        });

        fetch(`http://localhost:5184/api/quizzes/${quizId}/questions/${question.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: question.id,
                text: question.text
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

    // Handle answers
    const handleCreateAnswer = questionId => {
        fetch(`http://localhost:5184/api/questions/${questionId}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                text: 'Answer'
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

    const handleInputAnswer = debounce((event, questionId, answerId) => {
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

        hanldeUpdateAnswer(questionId, answer);
    }, 800);

    const handleChooseCorrectAnswer = debounce((questionId, answerId) => {
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

        hanldeUpdateAnswer(questionId, answer);
    });

    const hanldeUpdateAnswer = (questionId, answer) => {
        fetch(`http://localhost:5184/api/questions/${questionId}/answers/${answer.id}`, {
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

    const handleToggleChooseCorrectAnswer = id => {
        const question = questions.find(it => it.id == id);

        question.isChooseCorrectAnswerOpen = question.isChooseCorrectAnswerOpen ? false : true;

        const newQuestions = questions.map(it => (it.id == id ? question : it));

        setQuiz({
            ...quiz,
            questions: newQuestions
        });

        hanldeUpdateAnswer();
    };

    if (quizFetchStatuses.get == FetchStatuses.Loading)
        return <div className="w-full h-full flex justify-center items-center p-4">Spining...</div>;

    return (
        <div className="flex-1 overflow-y-auto">
            <div className="max-w-7xl w-full mx-auto p-4">
                <div className="flex items-center justify-between">
                    <h2>{quizId ? 'Do whatever you want to this quiz' : 'Yes, another quiz'}</h2>
                    <div className="flex items-center gap-2">
                        {quiz.status == QuizStatuses.Draft && (
                            <Button onClick={handlePublishQuiz}>
                                {quizFetchStatuses.publish == FetchStatuses.Loading
                                    ? 'Spining...'
                                    : 'Publish'}
                            </Button>
                        )}
                    </div>
                </div>
                <form onSubmit={event => event.preventDefault()} className="mt-4">
                    <p>Infomation</p>
                    <div className="flex flex-col gap-4 p-4">
                        <label className="flex flex-col gap-2">
                            Title:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this quiz, please"
                                defaultValue={quiz.title}
                                onChange={handleInputQuizDebounce}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Description:
                            <textarea
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="Give it some descriptive words"
                                defaultValue={quiz.description}
                                onChange={handleInputQuizDebounce}
                            />
                        </label>
                    </div>
                </form>
                <form onSubmit={event => event.preventDefault()} className="mt-4">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            Questions
                            <Button
                                disabled={questionFetchStatuses.create == FetchStatuses.Loading}
                                onClick={handleCreateQuestion}
                            >
                                {questionFetchStatuses.create == FetchStatuses.Loading
                                    ? 'Spining...'
                                    : 'Add question'}
                            </Button>
                        </div>
                        <div className="flex flex-col gap-4">
                            {questions.map((question, index) => {
                                const {
                                    answers = [],
                                    text,
                                    id: questionId,
                                    isChooseCorrectAnswerOpen
                                } = question;

                                return (
                                    <div
                                        key={questionId}
                                        className="flex flex-col gap-2 border border-solid border-black py-4"
                                    >
                                        <div className="cursor-pointer px-4 py-2 text-left flex items-center justify-between gap-6">
                                            <p className="flex items-center gap-3 flex-1">
                                                {index + 1}/
                                                {isChooseCorrectAnswerOpen ? (
                                                    <p className="px-4 py-2 border border-solid border-transparent">
                                                        {text}
                                                    </p>
                                                ) : (
                                                    <textarea
                                                        className="flex-1 border border-solid border-black outline-none px-4 py-2"
                                                        defaultValue={text}
                                                        placeholder="Please type the text of this question"
                                                        name="text"
                                                        onChange={event =>
                                                            handleInputQuestion(event, questionId)
                                                        }
                                                        rows={1}
                                                    />
                                                )}
                                                {isChooseCorrectAnswerOpen || (
                                                    <>
                                                        <Button
                                                            onClick={() =>
                                                                handleCreateAnswer(questionId)
                                                            }
                                                        >
                                                            Add answer
                                                        </Button>
                                                        <Button
                                                            onClick={event => {
                                                                event.stopPropagation();
                                                                handleDeleteQuestion(questionId);
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex-col flex gap-4 px-4 overflow-hidden">
                                            {isChooseCorrectAnswerOpen ? (
                                                <>
                                                    <div className="flex flex-col gap-2">
                                                        {answers.map(answer => {
                                                            const {
                                                                text,
                                                                id: answerId,
                                                                isCorrect
                                                            } = answer;

                                                            return (
                                                                <Button
                                                                    key={answerId}
                                                                    className={clsx(
                                                                        'text-left',
                                                                        isCorrect
                                                                            ? 'bg-green-200'
                                                                            : ''
                                                                    )}
                                                                    onClick={() =>
                                                                        handleChooseCorrectAnswer(
                                                                            questionId,
                                                                            answerId
                                                                        )
                                                                    }
                                                                >
                                                                    {text}
                                                                </Button>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex flex-col gap-2">
                                                        {answers.map(answer => {
                                                            const {
                                                                isCorrect,
                                                                text,
                                                                id: answerId
                                                            } = answer;

                                                            return (
                                                                <label
                                                                    key={answerId}
                                                                    className="flex items-center gap-2"
                                                                >
                                                                    <textarea
                                                                        className="w-full border border-solid border-black outline-none px-4 py-2"
                                                                        defaultValue={text}
                                                                        placeholder="Please type the text of this answer, don't forget to choose at least one correct answer"
                                                                        name="text"
                                                                        onChange={event =>
                                                                            handleInputAnswer(
                                                                                event,
                                                                                questionId,
                                                                                answerId
                                                                            )
                                                                        }
                                                                        rows={1}
                                                                    />
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isCorrect}
                                                                        name="isCorrect"
                                                                    />
                                                                    <Button
                                                                        className="flex-shrink-0"
                                                                        onClick={() =>
                                                                            hanldeDeleteAnswer(
                                                                                questionId,
                                                                                answerId
                                                                            )
                                                                        }
                                                                    >
                                                                        Remove
                                                                    </Button>
                                                                </label>
                                                            );
                                                        })}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <div className="cursor-pointer px-4 py-2 gap-2 text-left flex items-center justify-between">
                                            <Button
                                                className="flex-1"
                                                onClick={event => {
                                                    event.stopPropagation();
                                                    handleToggleChooseCorrectAnswer(questionId);
                                                }}
                                            >
                                                {isChooseCorrectAnswerOpen
                                                    ? 'Done'
                                                    : 'Choose correct answers'}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizSettings;
