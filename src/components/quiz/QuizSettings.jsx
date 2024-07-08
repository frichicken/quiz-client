import Button from 'components/common/Button';
import { quizzes } from 'data';
import { Link, useParams } from 'react-router-dom';

const QuizSettings = () => {
    const { quizId } = useParams();
    let quiz = { title: '', description: '', questions: [] };

    if (quizId) quiz = quizzes.find(quiz => quiz.id == quizId);

    const { title, description, questions } = quiz;

    return (
        <div className="flex-1 border border-solid border-black p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
                <h2>{quizId ? 'Do whatever you want to this quiz' : 'Yes, another quiz'}</h2>
                <div className="flex items-center gap-2">
                    <Button className="bg-amber-300">Heck yes</Button>
                    <Link
                        to="/quizzes"
                        onClick={event => {
                            event.preventDefault();
                            history.back();
                        }}
                    >
                        <Button className="bg-indigo-300">Deny</Button>
                    </Link>
                    {quizId && <Button className="bg-red-100">Let&apos;s say goodbye</Button>}
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
                            value={title}
                        />
                    </label>
                    <label className="flex flex-col gap-2">
                        Description:
                        <textarea
                            className="border border-solid border-black outline-none px-4 py-2"
                            name="description"
                            placeholder="Give it some descriptive words"
                            value={description}
                        />
                    </label>
                </fieldset>
            </form>
            <form onSubmit={event => event.preventDefault()} className="mt-4">
                <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                    <legend>Questions</legend>
                    <div className="flex flex-col gap-4">
                        {questions.map((question, index) => {
                            const { answers, text } = question;

                            return (
                                <div key={index} className="flex flex-col gap-2">
                                    <div className="cursor-pointer px-4 py-2 border border-solid border-black bg-orange-100 text-left flex items-center justify-between">
                                        <p>Banana {index + 1}</p>
                                        <button
                                            onClick={event => {
                                                event.stopPropagation();
                                            }}
                                            className="px-4 py-2 border border-solid border-black bg-red-300"
                                        >
                                            Please forgive me
                                        </button>
                                    </div>
                                    <div className="flex-col flex gap-4 px-2 overflow-hidden">
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
                                                        <Button className="flex-shrink-0 bg-red-300">
                                                            I&apos;m sorry{' '}
                                                        </Button>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        <Button className="bg-blue-100 w-full">Meow</Button>
                                    </div>
                                </div>
                            );
                        })}
                        <Button className="bg-orange-300">
                            Can i have another one, please? please, one more
                        </Button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default QuizSettings;
