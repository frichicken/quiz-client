import clsx from 'clsx';
import Button from 'components/common/Button';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { FetchStatuses, QuestionTypes } from 'utils/constants';

function QuizTest() {
    const { accountId, quizId } = useParams();
    const [quizFetchStatus, setQuizFetchStatus] = useState(FetchStatuses.None);
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        status: null,
        questions: []
    });
    const [questionsWithChosenAnswers, setQuestionsWithChosenAnswers] = useState([]);
    const [isCorrectAnswersShowed, setIsCorrectAnswerShowed] = useState(false);
    const { setQuizTitle } = useOutletContext();
    const questionRefs = useRef([]);

    useEffect(() => {
        setQuizFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}/details`, {
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
                setQuizTitle(data.title);
                const { questions } = data;

                const questionsWithChosenAnswers = questions.map(question => {
                    return {
                        id: question.id,
                        text: question.text,
                        type: question.type,
                        answers: question.answers.map(it => ({
                            id: it.id,
                            isCorrect: it.isCorrect,
                            text: it.text,
                            isChosen: false,
                            value: ''
                        }))
                    };
                });
                setQuestionsWithChosenAnswers(questionsWithChosenAnswers);
            })
            .catch(error => console.error(error))
            .finally(() => setQuizFetchStatus(FetchStatuses.None));
    }, [accountId, quizId]);

    const handleSelectAnswer = (questionId, answerId) => {
        const question = questionsWithChosenAnswers.find(it => it.id == questionId);
        const answer = question.answers.find(it => it.id == answerId);

        answer.isChosen = answer.isChosen ? false : true;

        question.answers = question.answers.map(it => {
            if (it.id == answerId) return { ...answer };

            return it;
        });

        setQuestionsWithChosenAnswers(
            questionsWithChosenAnswers.map(it => {
                if (it.id == questionId) return { ...question };
                return it;
            })
        );
    };

    const handleWriteAnswer = (questionId, answerId, value) => {
        const question = questionsWithChosenAnswers.find(it => it.id == questionId);
        const answer = question.answers.find(it => it.id == answerId);

        answer.value = value;

        question.answers = question.answers.map(it => {
            if (it.id == answerId) return { ...answer };

            return it;
        });

        setQuestionsWithChosenAnswers(
            questionsWithChosenAnswers.map(it => {
                if (it.id == questionId) return { ...question };
                return it;
            })
        );
    };

    const handleCheckCorrectAnswers = () => {
        setIsCorrectAnswerShowed(true);
    };

    const handleTryAgain = () => {
        setIsCorrectAnswerShowed(false);
        const questionsWithChosenAnswers = quiz.questions.map(question => {
            return {
                id: question.id,
                text: question.text,
                type: question.type,
                answers: question.answers.map(it => ({
                    id: it.id,
                    isCorrect: it.isCorrect,
                    text: it.text,
                    isChosen: false,
                    value: ''
                }))
            };
        });
        setQuestionsWithChosenAnswers(questionsWithChosenAnswers);
    };

    const hanldeJumpToQuestion = index => {
        questionRefs.current[index].scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    };

    if (quizFetchStatus == FetchStatuses.Loading)
        return <div className="w-full flex-1 flex justify-center items-center p-2">Spining...</div>;

    return (
        <div className="flex gap-4 justify-between relative">
            <div className="sticky pl-4 pt-6 top-20 self-start overflow-y-auto">
                <p>Question list</p>
                <div className="flex flex-col">
                    {questionsWithChosenAnswers.map((_, index) => {
                        return (
                            <p
                                key={index}
                                onClick={() => hanldeJumpToQuestion(index)}
                                className="p-1 cursor-pointer"
                            >
                                {index + 1}
                            </p>
                        );
                    })}
                </div>
            </div>
            <div className='flex flex-col flex-1 items-center'>
                <div className="flex-1 max-w-5xl w-full flex flex-col gap-8 p-4 overflow-y-auto">
                    {questionsWithChosenAnswers.map((question, index) => {
                        const { text, answers, id: questionId, type } = question;

                        return (
                            <div
                                key={questionId}
                                className="max-w-5xl min-h-96 w-full p-4 gap-4 flex flex-col border border-solid border-black"
                                ref={element => (questionRefs.current[index] = element)}
                            >
                                <p className="flex items-center gap-4 justify-between">
                                    <span>Question</span> {index + 1} of{' '}
                                    {questionsWithChosenAnswers.length}
                                </p>
                                <p className="text-lg">{text}</p>
                                <div className="flex flex-col gap-2 mt-auto">
                                    {type == QuestionTypes.Short ? (
                                        <>
                                            {isCorrectAnswersShowed ? (
                                                <Button
                                                    className={clsx(
                                                        'text-left',
                                                        answers.at(0).text == answers.at(0).value
                                                            ? 'bg-green-200 !text-black'
                                                            : '',
                                                        answers.at(0).text != answers.at(0).value
                                                            ? 'bg-red-300 !text-black'
                                                            : ''
                                                    )}
                                                    disabled={isCorrectAnswersShowed}
                                                >
                                                    {answers.at(0).text}
                                                </Button>
                                            ) : (
                                                <input
                                                    className="flex-1 border border-solid border-black outline-none px-4 py-2"
                                                    placeholder="Type the answer"
                                                    value={answers.at(0).value}
                                                    onChange={event =>
                                                        handleWriteAnswer(
                                                            questionId,
                                                            answers.at(0).id,
                                                            event.target.value
                                                        )
                                                    }
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <p>Choose correct answer</p>
                                            {answers.map(answer => {
                                                const {
                                                    text,
                                                    id: answerId,
                                                    isChosen,
                                                    isCorrect
                                                } = answer;
                                                return (
                                                    <Button
                                                        onClick={() =>
                                                            !isCorrectAnswersShowed &&
                                                            handleSelectAnswer(questionId, answerId)
                                                        }
                                                        key={answerId}
                                                        className={clsx(
                                                            'min-w-40 bg-white w-full text-left',
                                                            !isCorrectAnswersShowed && isChosen
                                                                ? '!bg-black text-white'
                                                                : '',
                                                            isCorrectAnswersShowed &&
                                                                isChosen == true &&
                                                                isCorrect == false
                                                                ? '!bg-red-200'
                                                                : '',
                                                            isCorrectAnswersShowed &&
                                                                isCorrect == true &&
                                                                isChosen == true
                                                                ? '!bg-green-200'
                                                                : '',
                                                            isCorrectAnswersShowed &&
                                                                isCorrect == true &&
                                                                isChosen == false
                                                                ? '!bg-gray-300'
                                                                : ''
                                                        )}
                                                        style={{}}
                                                    >
                                                        {text}
                                                    </Button>
                                                );
                                            })}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="max-w-5xl w-full p-4 flex justify-end mt-auto border border-solid border-black border-b-none">
                    <Button
                        onClick={() => {
                            isCorrectAnswersShowed ? handleTryAgain() : handleCheckCorrectAnswers();
                        }}
                    >
                        {isCorrectAnswersShowed ? 'Try again' : 'Submit'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default QuizTest;
