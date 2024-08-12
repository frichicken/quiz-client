import Button from 'components/common/Button';
import {
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownTrigger
} from 'components/common/Dropdown';
import Input from 'components/common/Input';
import { toast } from 'components/common/toaster';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { debounce } from 'utils';
import { FetchStatuses, FilterTexts, FilterTypes, QuizStatuses } from 'utils/constants';
import Quiz from './Quiz';

function QuizList() {
    const { accountId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState(searchParams.get('filter') || FilterTypes.Recent);
    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');

    useEffect(() => {
        const url = new URL(`http://localhost:5184/api/accounts/${accountId}/quizzes`);
        url.search = searchParams;

        setQuizzes([]);
        setFetchStatus(FetchStatuses.Loading);
        fetch(url.toString())
            .then(response => {
                if (response.ok) return response.json();
                else return Promise.reject(response);
            })
            .then(data => setQuizzes(data))
            .catch(() => toast('Something went wrong'))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId, searchParams]);

    const handleRemove = id => {
        const quiz = quizzes.find(it => it.id == id);
        quiz.fetchStatus = FetchStatuses.Loading;
        setQuizzes(quizzes.map(it => (it.id == id ? quiz : it)));

        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${id}`, {
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

        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${id}`, {
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

    const handleSearch = debounce(event => {
        searchParams.set('keyword', event.target.value);
        setSearchParams(new URLSearchParams(searchParams));

        setKeyword(event.target.value);
    }, 200);

    const handleFilter = debounce(value => {
        searchParams.set('filter', value);
        setSearchParams(new URLSearchParams(searchParams));

        setFilter(value);
    }, 200);

    const draft = quizzes.filter(it => it.status == QuizStatuses.Draft);

    let published = quizzes.filter(it => it.status == QuizStatuses.Published);

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
                <Input
                    className="min-w-[28rem]"
                    name="keyword"
                    placeholder="Search for quizzes"
                    onChange={handleSearch}
                    defaultValue={keyword}
                />
            </div>
            <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto">{content}</div>
        </div>
    );
}

export default QuizList;
