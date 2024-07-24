import Button from 'components/common/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizStatuses } from 'utils/constants';

export default function Quiz({
    title,
    description,
    id,
    totalQuestions,
    createdAt,
    status,
    isSaved,
    onRemove,
    onSave
}) {
    const navigate = useNavigate();
    const { accountId } = useParams();

    return (
        <div
            className="gap-4 text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between flex-col"
            onClick={() => {
                status == QuizStatuses.Draft
                    ? navigate(`/accounts/${accountId}/quizzes/${id}/edit`)
                    : navigate(`/accounts/${accountId}/quizzes/${id}`);
            }}
        >
            <div className="flex-1 w-full">
                <p>{title}</p>
                <p className="text-sm line-clamp-2">{description}</p>
                <div className="flex items-center gap-1 mt-2">
                    <div className="px-2 py-1 border border-solid border-black text-sm flex-shrink-0">
                        {totalQuestions} Questions
                    </div>
                    <div className="px-2 py-1 border border-solid border-black text-sm flex-shrink-0">
                        {new Date(createdAt).toDateString()}
                    </div>
                    <div className="px-2 py-1 border border-solid border-black text-sm w-fit flex-shrink-0">
                        {status == QuizStatuses.Draft ? 'Draft' : 'Published'}
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center gap-2 flex-shrink-0">
                {status == QuizStatuses.Published && (
                    <>
                        <Button
                            onClick={event => {
                                event.stopPropagation();
                                navigate(`/accounts/${accountId}/quizzes/${id}/learn`);
                            }}
                            className="flex-1"
                        >
                            Learn
                        </Button>
                        <Button
                            onClick={event => {
                                event.stopPropagation();
                                navigate(`/accounts/${accountId}/quizzes/${id}/test`);
                            }}
                            className="flex-1"
                        >
                            Test
                        </Button>
                    </>
                )}
                <Button
                    onClick={event => {
                        event.stopPropagation();
                        navigate(`/accounts/${accountId}/quizzes/${id}/edit`);
                    }}
                    className="flex-1"
                >
                    Edit
                </Button>
                <Button
                    onClick={event => {
                        event.stopPropagation();
                        onRemove(id);
                    }}
                    className="flex-1"
                >
                    Remove
                </Button>
                {status == QuizStatuses.Published && (
                    <Button
                        onClick={event => {
                            event.stopPropagation();
                            onSave(id);
                        }}
                        className="flex-1"
                    >
                        {isSaved ? 'Remove from saved' : 'Add to saved'}
                    </Button>
                )}
            </div>
        </div>
    );
}