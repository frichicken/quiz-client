import clsx from 'clsx';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

const QuizPlayground = () => {
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
                const { questions } = data;

                const questionsWithChosenAnswers = questions.map(question => {
                    return {
                        id: question.id,
                        text: question.text,
                        answers: question.answers.map(it => ({
                            id: it.id,
                            isCorrect: it.isCorrect,
                            text: it.text,
                            isChosen: false
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

    const handleCheckCorrectAnswers = () => {
        setIsCorrectAnswerShowed(true);
    };

    console.log({ questionsWithChosenAnswers });

    if (quizFetchStatus == FetchStatuses.Loading)
        return (
            <div className="w-full flex justify-center items-center border border-solid border-black p-2">
                Spining...
            </div>
        );

    return (
        <div className="flex-1 flex flex-col gap-6 border border-solid border-black p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <p>{quiz.title}</p>
                    <p className="text-sm">{quiz.description}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <Button onClick={handleCheckCorrectAnswers}>Your parents proud</Button>
                    <Link to={`/accounts/${accountId}/quizzes`}>
                        <Button>Cancel</Button>
                    </Link>
                </div>
            </div>
            {questionsWithChosenAnswers.map((question, index) => {
                const { text, answers, id: questionId } = question;

                return (
                    <div key={questionId} className="flex flex-col gap-2">
                        <p>{index + 1}/</p>
                        <p>{text}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                            {answers.map(answer => {
                                const { text, id: answerId, isChosen, isCorrect } = answer;
                                return (
                                    <Button
                                        onClick={() =>
                                            !isCorrectAnswersShowed &&
                                            handleSelectAnswer(questionId, answerId)
                                        }
                                        key={answerId}
                                        className={clsx(
                                            'min-w-40 bg-white',
                                            !isCorrectAnswersShowed && isChosen
                                                ? '!bg-black text-white'
                                                : '',
                                            isCorrectAnswersShowed &&((isCorrect == true && isChosen == false) || (isChosen == true && isCorrect == false))
                                                ? '!bg-red-200'
                                                : '',
                                            isCorrectAnswersShowed && (isCorrect == true && isChosen == true) 
                                                ? '!bg-green-200'
                                                : '',
                                           
                                        )}
                                        style={{}}
                                    >
                                        {text}
                                    </Button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default QuizPlayground;
