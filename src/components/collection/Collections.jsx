import Button from 'components/common/Button';
import { collections } from 'data';
import { useNavigate } from 'react-router-dom';

function Collections() {
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col gap-2 border border-solid border-black p-2 overflow-y-auto">
            {collections.map(collection => {
                const { title, description, id, quizIds, createdAt } = collection;

                return (
                    <div
                        key={id}
                        className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                        onClick={() => {
                            navigate('/collections/' + id);
                        }}
                    >
                        <div>
                            <p>{title}</p>
                            <p className="text-sm">{description}</p>
                            <div className="flex items-center gap-1 mt-2">
                                <div className="px-2 py-1 border border-solid border-black text-sm">
                                    {quizIds.length} Items
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
                                    navigate('/collections/' + id + '/edit');
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

export default Collections;
