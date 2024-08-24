import Button from 'components/common/Button';
import {
    Dropdown,
    DropdownContent,
    DropdownItem,
    DropdownTrigger
} from 'components/common/Dropdown';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FetchStatuses, QuestionTypes } from 'utils/constants';
import QuizRunSettingsModal from './QuizRunSettingsModal';

function QuizRunLayout() {
    const location = useLocation();
    const { accountId, quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        status: null,
        questions: []
    });
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(true);
    const [settings, setSettings] = useState({
        max: 0,
        include: Object.values(QuestionTypes)
    });
    const [fetchStatus, setFetchStatus] = useState(FetchStatuses.None);
    const [max, setMax] = useState(0);

    useEffect(() => {
        setFetchStatus(FetchStatuses.Loading);
        fetch(`http://localhost:5184/api/accounts/${accountId}/quizzes/${quizId}`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                return Promise.reject(response);
            })
            .then(data => {
                setQuiz(data);
                setMax(data.questions.length);
            })
            .catch(error => console.error(error))
            .finally(() => setFetchStatus(FetchStatuses.None));
    }, [quizId, accountId, location]);

    useEffect(() => {
        setIsSettingsModalOpen(true);
        setSettings({
            max: 0,
            include: Object.values(QuestionTypes)
        });
    }, [location]);

    const handleSave = settings => {
        setSettings(settings);
        setIsSettingsModalOpen(false);
    };

    const questions = useMemo(
        () =>
            quiz.questions
                .filter(it => settings.include.indexOf(it.type) != -1)
                .slice(0, settings.max || max),
        [settings, max, quiz.questions]
    );

    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="flex justify-between border-b border-b-black gap-6 h-[67px] px-4 flex-shrink-0 self-start top-0 sticky w-full bg-white z-10">
                <Dropdown>
                    <DropdownTrigger>
                        <Button>Mode</Button>
                        <DropdownContent>
                            <DropdownItem
                                onSelect={() => {
                                    navigate(`/accounts/${accountId}/quizzes/${quizId}/learn`);
                                }}
                            >
                                Learn
                            </DropdownItem>
                            <DropdownItem
                                onSelect={() => {
                                    navigate(`/accounts/${accountId}/quizzes/${quizId}/test`);
                                }}
                            >
                                Test
                            </DropdownItem>
                        </DropdownContent>
                    </DropdownTrigger>
                </Dropdown>
                <p className="mx-auto flex items-center justify-center">{quiz.title}</p>
                <div className="flex items-center justify-center gap-4">
                    <Button
                        onClick={event => {
                            event.stopPropagation();
                            setIsSettingsModalOpen(true);
                        }}
                    >
                        Settings
                    </Button>
                    <Button
                        onClick={event => {
                            event.stopPropagation();
                            navigate(`/accounts/${accountId}/quizzes/${quizId}`);
                        }}
                    >
                        Close
                    </Button>
                </div>
            </nav>
            <Outlet context={{ questions, fetchStatus }} />
            {isSettingsModalOpen && (
                <QuizRunSettingsModal defaultSettings={settings} max={max} onSave={handleSave} />
            )}
        </div>
    );
}

export default QuizRunLayout;
