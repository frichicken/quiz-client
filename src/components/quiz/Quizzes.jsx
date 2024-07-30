import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FetchStatuses, FilterTexts, FilterTypes, QuizStatuses, url } from 'utils/constants';
import Quiz from './Quiz';

function Quizzes() {
    const { accountId } = useParams();
    const [quizzes, setQuizzes] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [isFilterDropdownOpen, setIsFilterDropdown] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(FilterTypes.Recent);
    const [keyword, setKeyword] = useState('');

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`${url}/api/accounts/${accountId}/quizzes`)
            .then(response => response.json())
            .then(data => setQuizzes(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId]);

    const handleRemoveQuiz = id => {
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

    const handleSaveQuiz = id => {
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

    const handleKeywordChange = event => {
        setKeyword(event.target.value);
    };

    const handleSelectFilter = value => {
        toggleFilterDropdown();
        setCurrentFilter(value);
    };

    const toggleFilterDropdown = () => setIsFilterDropdown(isFilterDropdownOpen ? false : true);

    const draftQuizzes = quizzes.filter(
        it =>
            it.status == QuizStatuses.Draft &&
            it.title.toLowerCase().trim().includes(keyword.toLowerCase().trim())
    );

    let publishedQuizzes = quizzes.filter(
        it =>
            it.status == QuizStatuses.Published &&
            it.title.toLowerCase().trim().includes(keyword.toLowerCase().trim())
    );

    if (currentFilter == FilterTypes.Saved) publishedQuizzes = quizzes.filter(it => it.isSaved);

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-between">
                <div className="relative h-full flex items-center">
                    <Button onClick={toggleFilterDropdown}>{FilterTexts[currentFilter]}</Button>
                    {isFilterDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-[0] bg-white min-w-40 shadow-sm py-2 border border-solid border-black flex flex-col">
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    handleSelectFilter(FilterTypes.Recent);
                                }}
                            >
                                Recent
                            </Button>
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    handleSelectFilter(FilterTypes.Draft);
                                }}
                            >
                                Draft
                            </Button>
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    handleSelectFilter(FilterTypes.Published);
                                }}
                            >
                                Published
                            </Button>
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    handleSelectFilter(FilterTypes.Saved);
                                }}
                            >
                                Saved
                            </Button>
                        </div>
                    )}
                </div>
                <input
                    className="border border-solid border-black outline-none px-4 py-2 min-w-[28rem]"
                    name="keyword"
                    placeholder="Your grandma is going to check your search history"
                    onChange={handleKeywordChange}
                />
            </div>
            {fetchStatus == FetchStatuses.Loading ? (
                <div className="w-full flex-1 flex justify-center items-center p-2">Spining...</div>
            ) : (
                <div className="flex flex-col flex-1 gap-2 w-full overflow-y-auto">
                    {draftQuizzes.length > 0 &&
                        (currentFilter == FilterTypes.Recent ||
                            currentFilter == FilterTypes.Draft) && (
                            <>
                                <p>In progress</p>
                                <div className="w-full flex flex-col gap-4 p-2">
                                    {draftQuizzes.map(quiz => {
                                        const { id } = quiz;

                                        return (
                                            <Quiz key={id} onRemove={handleRemoveQuiz} {...quiz} />
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    {publishedQuizzes.length > 0 &&
                        (currentFilter == FilterTypes.Recent ||
                            currentFilter == FilterTypes.Published ||
                            currentFilter == FilterTypes.Saved) && (
                            <>
                                <p>Published</p>
                                <div className="w-full flex flex-col gap-4 p-2">
                                    {publishedQuizzes.map(quiz => {
                                        const { id } = quiz;

                                        return (
                                            <Quiz
                                                key={id}
                                                onSave={handleSaveQuiz}
                                                onRemove={handleRemoveQuiz}
                                                {...quiz}
                                            />
                                        );
                                    })}
                                </div>
                            </>
                        )}
                </div>
            )}
        </div>
    );
}

export default Quizzes;
