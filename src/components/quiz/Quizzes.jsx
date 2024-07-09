import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FetchStatuses } from 'utils/constants';

function Quizzes() {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch('http://localhost:5184/api/quizzes')
            .then(response => response.json())
            .then(data => setQuizzes(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, []);

    if (fetchStatus == FetchStatuses.Loading)
        return (
            <div className="w-full h-full flex justify-center items-center border border-solid border-black p-2">
                Spining...
            </div>
        );

    return (
        <div className="w-full h-full flex flex-col gap-2 border border-solid border-black p-2 overflow-y-auto">
            {quizzes.map(quiz => {
                const { title, description, id, questions, createdAt } = quiz;

                return (
                    <div
                        key={id}
                        className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                        onClick={() => {
                            navigate('/quizzes/' + id);
                        }}
                    >
                        <div>
                            <p>{title}</p>
                            <p className="text-sm">{description}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <div className="px-2 py-1 border border-solid border-black text-sm">
                                    {questions.length} Terms
                                </div>
                                <div className="px-2 py-1 border border-solid border-black text-sm">
                                    {createdAt.toDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={event => {
                                    event.stopPropagation();
                                    navigate('/quizzes/' + id + '/play');
                                }}
                            >
                                Play
                            </Button>
                            <Button
                                onClick={event => {
                                    event.stopPropagation();
                                    navigate('/quizzes/' + id + '/edit');
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={event => {
                                    event.stopPropagation();
                                }}
                            >
                                Please forgive me
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default Quizzes;
