import Button from 'components/common/Button';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FetchStatuses, FilterTexts, FilterTypes, QuizStatuses } from 'utils/constants';
import Quiz from './Quiz';

function Quizzes() {
    const [quizzes, setQuizzes] = useState([]);
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [isFilterDropdownOpen, setIsFilterDropdown] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(FilterTypes.Recent);
    const [keyword, setKeyword] = useState('');
    const { accountId } = useParams();

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes`)
            .then(response => response.json())
            .then(data => setQuizzes(data))
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [accountId]);

    const handleRemoveQuiz = quizId => {
        const quiz = quizzes.find(it => it.id == quizId);
        quiz.fetchStatus = FetchStatuses.Loading;
        setQuizzes(quizzes.map(it => (it.id == quizId ? quiz : it)));
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        })
            .then(response => {
                if (response.ok) {
                    setQuizzes(quizzes.filter(quiz => quiz.id != quizId));
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const toggleSaveQuiz = quizId => {
        const quiz = quizzes.find(it => it.id == quizId);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                id: quizId,
                title: quiz.title,
                description: quiz.description,
                status: quiz.status,
                isSaved: quiz.isSaved ? false : true
            })
        })
            .then(response => {
                if (response.ok) {
                    quiz.isSaved = quiz.isSaved ? false : true;
                    setQuizzes(quizzes.map(it => (it.id == quizId ? quiz : it)));
                    return response;
                }

                Promise.reject(response);
            })
            .catch(error => console.error(error));
    };

    const toggleFilterDropdown = () => setIsFilterDropdown(isFilterDropdownOpen ? false : true);

    const handleKeywordChange = event => {
        setKeyword(event.target.value);
    };

    const drafts = quizzes.filter(
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

    const handleSelectFilter = value => {
        setCurrentFilter(value);
    };

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
                                    toggleFilterDropdown();
                                    handleSelectFilter(FilterTypes.Recent);
                                }}
                            >
                                Recent
                            </Button>
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    toggleFilterDropdown();
                                    handleSelectFilter(FilterTypes.Draft);
                                }}
                            >
                                Draft
                            </Button>
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    toggleFilterDropdown();
                                    handleSelectFilter(FilterTypes.Published);
                                }}
                            >
                                Published
                            </Button>
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    toggleFilterDropdown();
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
                    {drafts.length > 0 && (currentFilter == FilterTypes.Recent ||
                        currentFilter == FilterTypes.Draft) && (
                        <>
                            <p>In progress</p>
                            <div className="w-full flex flex-col gap-4 p-2">
                                {drafts.map(quiz => {
                                    const { id } = quiz;

                                    return <Quiz onRemove={handleRemoveQuiz} key={id} {...quiz} />;
                                })}
                            </div>
                        </>
                    )}
                    {publishedQuizzes.length > 0 && (currentFilter == FilterTypes.Recent ||
                        currentFilter == FilterTypes.Published ||
                        currentFilter == FilterTypes.Saved) && (
                        <>
                            <p>Published</p>
                            <div className="w-full flex flex-col gap-4 p-2">
                                {publishedQuizzes.map(quiz => {
                                    const { id } = quiz;

                                    return (
                                        <Quiz
                                            onSave={toggleSaveQuiz}
                                            onRemove={handleRemoveQuiz}
                                            key={id}
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
