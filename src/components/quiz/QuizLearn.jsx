import clsx from 'clsx';
import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

function QuizLearn() {
    const { accountId, quizId } = useParams();
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        status: null,
        questions: []
    });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const { setQuizTitle } = useOutletContext();
    const [chosenAnswerIds, setChosenAnswerIds] = useState([]);
    const [isSubmited, setIsSubmited] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}/details`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                return Promise.reject(response);
            })
            .then(data => {
                setQuiz(data);
                setQuizTitle(data.title);
            })
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [quizId, accountId]);

    const handleNext = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setChosenAnswerIds([]);
        setIsSubmited(false);
    };

    const handleSubmit = () => {
        setIsSubmited(true);

        const question = quiz.questions[currentQuestionIndex];
        const correctAnswersIds = question.answers.filter(it => it.isCorrect).map(it => it.id);

        if (correctAnswersIds.every(it => chosenAnswerIds.indexOf(it) != -1))
            setCorrectAnswers(correctAnswers + 1);
    };

    const handleChooseAnswer = id => {
        let newChosenAnswerIds = [...chosenAnswerIds];
        if (chosenAnswerIds.indexOf(id) != -1)
            newChosenAnswerIds = chosenAnswerIds.filter(it => it != id);
        else newChosenAnswerIds.push(id);
        setChosenAnswerIds(newChosenAnswerIds);
    };

    const handleTryAgain = () => {
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
    };

    if (fetchStatus == FetchStatuses.Loading)
        return <div className="w-full flex justify-center items-center p-4 flex-1">Spining...</div>;

    const question = quiz.questions[currentQuestionIndex];

    return (
        <div className="flex gap-4 flex-col justify-center items-center flex-1 p-4 pb-0">
            {currentQuestionIndex >= quiz.questions.length ? (
                <div className="flex-1 w-full flex-col items-center flex gap-4">
                    <div className="max-w-5xl w-full gap-2 flex items-center">
                        <p className="px-4 py-2 border border-solid border-black">
                            {correctAnswers} out of {quiz.questions.length}
                        </p>
                    </div>
                    <div className="max-w-5xl w-full gap-4 flex flex-col ">
                        <p>Questions in this quiz</p>
                        {quiz.questions.map((question, index) => {
                            const { text, answers, id } = question;

                            return (
                                <div key={id} className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <p className="flex items-center gap-2">
                                            {index + 1}/<p>{text}</p>
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center gap-4 flex-wrap">
                                        {answers.map(answer => {
                                            const { text, id } = answer;

                                            return (
                                                <Button
                                                    key={id}
                                                    className={clsx('w-full text-left')}
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
                </div>
            ) : (
                <div className="flex-1 w-full flex-col items-center flex gap-4">
                    <div className="max-w-5xl w-full gap-2 flex items-center">
                        <p className="px-4 py-2 border border-solid border-black">{1}</p>
                        <div className="flex-1 h-2 w-full border border-solid border-black">
                            <div
                                className="h-full bg-black"
                                style={{
                                    width:
                                        ((currentQuestionIndex + 1) / quiz.questions.length) * 100 +
                                        '%'
                                }}
                            ></div>
                        </div>
                        <p className="px-4 py-2 border border-solid border-black">
                            {quiz.questions.length}
                        </p>
                    </div>
                    <div className="max-w-5xl min-h-96 w-full p-4 gap-4 flex flex-col border border-solid border-black">
                        {quiz.questions.length > 0 && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <p>Question</p>
                                    <p className="flex-1 text-lg">
                                        {currentQuestionIndex + 1}/ {question.text}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 mt-auto">
                                    <p>Choose correct answer</p>
                                    {question.answers.map(it => {
                                        const { text, isCorrect, id } = it;

                                        return (
                                            <Button
                                                onClick={() => handleChooseAnswer(id)}
                                                className={clsx(
                                                    'text-left',
                                                    chosenAnswerIds.indexOf(id) != -1
                                                        ? 'bg-black text-white'
                                                        : '',
                                                    isSubmited &&
                                                        chosenAnswerIds.indexOf(id) != -1 &&
                                                        isCorrect
                                                        ? 'bg-green-200 text-black'
                                                        : '',
                                                    isSubmited &&
                                                        ((chosenAnswerIds.indexOf(id) != -1 &&
                                                            !isCorrect) ||
                                                            (chosenAnswerIds.indexOf(id) == -1 &&
                                                                isCorrect))
                                                        ? 'bg-red-300 text-black'
                                                        : ''
                                                )}
                                                key={id}
                                                disabled={isSubmited}
                                            >
                                                {text}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className="max-w-5xl w-full p-4 flex justify-end mt-auto border border-solid border-black border-b-none">
                <Button
                    onClick={() => {
                        if (currentQuestionIndex < quiz.questions.length)
                            isSubmited ? handleNext() : handleSubmit();
                        else handleTryAgain();
                    }}
                >
                    {currentQuestionIndex < quiz.questions.length
                        ? isSubmited
                            ? 'Continue'
                            : 'Submit'
                        : 'Try again'}
                </Button>
            </div>
        </div>
    );
}

export default QuizLearn;
