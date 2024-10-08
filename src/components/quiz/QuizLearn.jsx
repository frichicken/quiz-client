import clsx from 'clsx';
import Button from 'components/common/Button';
import Input from 'components/common/Input';
import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FetchStatuses, QuestionTypes } from 'utils/constants';

function QuizLearn() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [chosenAnswerIds, setChosenAnswerIds] = useState([]);
    const [isSubmited, setIsSubmited] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [answerValue, setAnswerValue] = useState('');
    const { questions, fetchStatus } = useOutletContext();

    useEffect(() => {
        handleTryAgain();
    }, [questions]);

    const handleNext = () => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setChosenAnswerIds([]);
        setIsSubmited(false);
        setAnswerValue('');
    };

    const handleSubmit = () => {
        setIsSubmited(true);
        const question = questions[currentQuestionIndex];

        if (question.type == QuestionTypes.Short) {
            if (question.answers.some(it => it.text == answerValue))
                setCorrectAnswers(correctAnswers + 1);
        } else {
            const correctAnswersIds = question.answers.filter(it => it.isCorrect).map(it => it.id);

            if (chosenAnswerIds.length != correctAnswersIds.length) return;

            if (chosenAnswerIds.every(it => correctAnswersIds.indexOf(it) != -1))
                setCorrectAnswers(correctAnswers + 1);
        }
    };

    const handleChooseAnswer = id => {
        let newChosenAnswerIds = [...chosenAnswerIds];
        const question = questions[currentQuestionIndex];

        if (question.type == QuestionTypes.Single) newChosenAnswerIds = [];

        if (newChosenAnswerIds.indexOf(id) != -1)
            newChosenAnswerIds = newChosenAnswerIds.filter(it => it != id);
        else newChosenAnswerIds.push(id);

        setChosenAnswerIds(newChosenAnswerIds);
    };

    const handleWriteAnswer = event => setAnswerValue(event.target.value);

    const handleTryAgain = () => {
        setCurrentQuestionIndex(0);
        setCorrectAnswers(0);
        setChosenAnswerIds([]);
        setIsSubmited(false);
        setAnswerValue('');
    };

    if (fetchStatus == FetchStatuses.Loading)
        return <div className="w-full flex justify-center items-center p-4 flex-1">Spining...</div>;

    const question = questions[currentQuestionIndex];

    return (
        <div className="flex gap-4 flex-col justify-center items-center flex-1 p-4 pb-0">
            {currentQuestionIndex >= questions.length ? (
                <div className="flex-1 w-full flex-col items-center flex gap-4">
                    <div className="max-w-5xl w-full gap-2 flex items-center">
                        <p className="px-4 py-2 border border-solid border-black">
                            {correctAnswers} out of {questions.length}
                        </p>
                    </div>
                    <div className="max-w-5xl w-full gap-4 flex flex-col ">
                        <p>Questions in this quiz</p>
                        {questions.map((question, index) => {
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
                                        ((currentQuestionIndex + 1) / questions.length) * 100 + '%'
                                }}
                            ></div>
                        </div>
                        <p className="px-4 py-2 border border-solid border-black">
                            {questions.length}
                        </p>
                    </div>
                    <div className="max-w-5xl min-h-96 w-full p-4 gap-4 flex flex-col border border-solid border-black">
                        {questions.length > 0 && (
                            <>
                                <div className="flex flex-col gap-2">
                                    <p>Question</p>
                                    <p className="flex-1 text-lg">
                                        {currentQuestionIndex + 1}/ {question.text}
                                    </p>
                                </div>
                                {question.type == QuestionTypes.Short && isSubmited && (
                                    <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                                        <p>Correct answers</p>
                                        <div className="flex flex-col gap-4">
                                            {question.answers.map(it => (
                                                <p key={it.id}>{it.text}</p>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {question.type == QuestionTypes.Short ? (
                                    <div className="flex flex-col gap-2 mt-auto">
                                        {isSubmited ? (
                                            <Button
                                                className={clsx(
                                                    'text-left',
                                                    question.answers.some(
                                                        it => it.text == answerValue
                                                    )
                                                        ? 'bg-green-200 !text-black'
                                                        : '',
                                                    question.answers.every(
                                                        it => it.text != answerValue
                                                    )
                                                        ? 'bg-red-300 !text-black'
                                                        : ''
                                                )}
                                                disabled={isSubmited}
                                            >
                                                {answerValue}
                                            </Button>
                                        ) : (
                                            <Input
                                                className="flex-1"
                                                placeholder="Type the answer"
                                                value={answerValue}
                                                onChange={handleWriteAnswer}
                                            />
                                        )}
                                    </div>
                                ) : (
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
                                                            ? 'bg-green-200 !text-black'
                                                            : '',
                                                        isSubmited &&
                                                            chosenAnswerIds.indexOf(id) != -1 &&
                                                            !isCorrect
                                                            ? 'bg-red-300 !text-black'
                                                            : '',
                                                        isSubmited &&
                                                            chosenAnswerIds.indexOf(id) == -1 &&
                                                            isCorrect
                                                            ? 'bg-gray-300 !text-black'
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
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
            <div className="max-w-5xl w-full p-4 flex justify-end mt-auto border border-solid border-black border-b-none">
                <Button
                    onClick={() => {
                        if (currentQuestionIndex < questions.length)
                            isSubmited ? handleNext() : handleSubmit();
                        else handleTryAgain();
                    }}
                >
                    {currentQuestionIndex < questions.length
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
