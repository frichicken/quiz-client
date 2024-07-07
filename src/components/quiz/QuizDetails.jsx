import Button from 'components/common/Button';
import { quizzes } from 'data';
import { Link, useParams } from 'react-router-dom';

const QuizDetails = () => {
    const { quizId } = useParams();
    const quiz = quizzes.find(quiz => quiz.id == quizId);
    const { title, description, questions } = quiz;

    return (
        <div className="w-full h-full flex flex-col gap-4 border border-solid border-black p-2 overflow-y-auto">
            <Link to="/quizzes" className="text-blue-300 underline cursor-pointer">
                Back?
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <p>{title}</p>
                    <p className="text-sm">{description}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to={'/quizzes/' + quizId + '/play'}>
                        <Button>Play</Button>
                    </Link>
                    <Button>Please forgive me</Button>
                </div>
            </div>
            <Button className="w-fit">Show correct answers</Button>
            {questions.map((question, index) => {
                const { text, answers, id } = question;

                return (
                    <div key={id} className="flex flex-col gap-2">
                        <p>{index + 1}/</p>
                        <p>{text}</p>
                        <div className="flex items-center gap-4 flex-wrap">
                            {answers.map(answer => {
                                const { text, id } = answer;

                                return (
                                    <Button key={id} className="min-w-40">
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

export default QuizDetails;
