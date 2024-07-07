import Button from 'components/common/Button';
import { quizzes } from 'data';
import { Link, useParams } from 'react-router-dom';

const QuizPlayground = () => {
    const { quizId } = useParams();
    const quiz = quizzes.find(quiz => quiz.id == quizId);
    const { title, description, questions } = quiz;

    return (
        <div className="flex-1 flex flex-col gap-6 border border-solid border-black p-4 overflow-y-auto">
            <div className="flex items-center justify-between">
                <div>
                    <p>{title}</p>
                    <p className="text-sm">{description}</p>
                </div>
                <div className="flex gap-4 items-center">
                    <Button>Your parents proud</Button>
                    <Link to={'/quizzes'}>
                        <Button>Cancel</Button>
                    </Link>
                </div>
            </div>
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

export default QuizPlayground;
