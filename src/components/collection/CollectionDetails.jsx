import Button from 'components/common/Button';
import { collections, quizzes } from 'data';
import { Link, useParams } from 'react-router-dom';

const CollectionDetails = () => {
    const { collectionId } = useParams();
    let collection = {
        title: '',
        description: '',
        quizIds: []
    };

    if (collectionId) {
        collection = collections.find(collection => collection.id == collectionId);
    }

    const { title, description, quizIds } = collection;

    return (
        <div className="flex-1 border border-solid border-black p-4 flex flex-col gap-4">
            <Link to="/collections" className="text-blue-300 underline cursor-pointer">
                Back?
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <p>{title}</p>
                    <p className="text-sm">{description}</p>
                </div>
                <Button>Please forgive me</Button>
            </div>
            <form>
                <fieldset className="flex flex-col gap-2 h-full border border-solid border-black p-4 overflow-y-auto">
                    <legend>Quizzes</legend>
                    {quizzes
                        .filter(quiz => quizIds.includes(quiz.id))
                        .map(quiz => {
                            const { title, description, id, questions, createdAt } = quiz;

                            return (
                                <Link
                                    key={id}
                                    to={'/quizzes/' + id}
                                    className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer"
                                >
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
                                </Link>
                            );
                        })}
                </fieldset>
            </form>
        </div>
    );
};

export default CollectionDetails;
