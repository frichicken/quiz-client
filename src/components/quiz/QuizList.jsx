import {
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownTrigger
} from 'components/common/Dropdown';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FetchStatuses, FilterTexts, FilterTypes, QuizStatuses, url } from 'utils/constants';
import Quiz from './Quiz';
import Button from 'components/common/Button';

function QuizList() {
    const { accountId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [filter, setFilter] = useState(FilterTypes.Recent);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`${url}/api/accounts/${accountId}/quizzes`)
            .then(response => response.json())
            .then(data => setQuizzes(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId]);

    const handleRemove = id => {
        const quiz = quizzes.find(it => it.id == id);
        quiz.fetchStatus = FetchStatuses.Loading;
        setQuizzes(quizzes.map(it => (it.id == id ? quiz : it)));

        fetch(`${url}/api/accounts/${accountId}/quizzes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    setQuizzes(quizzes.filter(quiz => quiz.id != id));
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const handleSave = id => {
        const quiz = quizzes.find(it => it.id == id);
        quiz.isSaved = quiz.isSaved ? false : true;

        fetch(`${url}/api/accounts/${accountId}/quizzes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id,
                title: quiz.title,
                description: quiz.description,
                status: quiz.status,
                isSaved: quiz.isSaved
            })
        })
            .then(response => {
                if (response.ok) {
                    setQuizzes(quizzes.map(it => (it.id == id ? quiz : it)));

                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const handleSearch = event => {
        setKeyword(event.target.value);
    };

    const handleFilter = value => {
        setFilter(value);
    };

    const draft = quizzes.filter(
        it =>
            it.status == QuizStatuses.Draft &&
            it.title.toLowerCase().trim().includes(keyword.toLowerCase().trim())
    );

    let published = quizzes.filter(
        it =>
            it.status == QuizStatuses.Published &&
            it.title.toLowerCase().trim().includes(keyword.toLowerCase().trim())
    );

    if (filter == FilterTypes.Saved) published = quizzes.filter(it => it.isSaved);

    let content = (
        <>
            {draft.length > 0 && (filter == FilterTypes.Recent || filter == FilterTypes.Draft) && (
                <>
                    <p>In progress</p>
                    <div className="w-full flex flex-col gap-4 p-2">
                        {draft.map(quiz => (
                            <Quiz
                                key={quiz.id}
                                onSave={handleSave}
                                onRemove={handleRemove}
                                {...quiz}
                            />
                        ))}
                    </div>
                </>
            )}
            {published.length > 0 &&
                (filter == FilterTypes.Recent ||
                    filter == FilterTypes.Published ||
                    filter == FilterTypes.Saved) && (
                    <>
                        <p>Published</p>
                        <div className="w-full flex flex-col gap-4 p-2">
                            {published.map(quiz => (
                                <Quiz
                                    key={quiz.id}
                                    onSave={handleSave}
                                    onRemove={handleRemove}
                                    {...quiz}
                                />
                            ))}
                        </div>
                    </>
                )}
        </>
    );

    if (fetchStatus == FetchStatuses.Loading)
        content = <div className="w-full h-full flex items-center justify-center">Spining...</div>;

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex items-center justify-between">
                <Dropdown position="bottom-left">
                    <DropdownTrigger>
                        <Button>{FilterTexts[filter]}</Button>
                    </DropdownTrigger>
                    <DropdownContent>
                        {Object.values(FilterTypes).map(value => {
                            return (
                                <DropdownItem
                                    key={value}
                                    onSelect={() => {
                                        handleFilter(value);
                                    }}
                                >
                                    {FilterTexts[value]}
                                </DropdownItem>
                            );
                        })}
                    </DropdownContent>
                </Dropdown>
                <input
                    className="border border-solid border-black outline-none px-4 py-2 min-w-[28rem]"
                    name="keyword"
                    placeholder="Search for quizzes"
                    onChange={handleSearch}
                />
            </div>
            <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto">{content}</div>
        </div>
    );
}

export default QuizList;
