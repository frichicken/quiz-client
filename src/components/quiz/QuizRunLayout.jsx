import Button from 'components/common/Button';
import { useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

function QuizRunLayout() {
    const { accountId, quizId } = useParams();
    const navigate = useNavigate();
    const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
    const [quizTitle, setQuizTitle] = useState('');
    const toggleCreateDropdown = () => setIsModeDropdownOpen(isModeDropdownOpen ? false : true);

    return (
        <div className="w-full h-screen flex flex-col">
            <nav className="flex justify-between border-b border-b-black gap-6 h-[67px] px-4 flex-shrink-0 self-start top-0 sticky w-full bg-white z-10">
                <div className="relative h-full flex items-center">
                    <Button onClick={toggleCreateDropdown}>Mode</Button>
                    {isModeDropdownOpen && (
                        <div className="absolute top-[calc(100%+8px)] left-0 bg-white min-w-40 shadow-sm py-2 border border-solid border-black flex flex-col">
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    navigate(`/accounts/${accountId}/quizzes/${quizId}/learn`);
                                    toggleCreateDropdown();
                                }}
                            >
                                Learn
                            </Button>
                            <Button
                                className="w-full border-none text-left"
                                onClick={() => {
                                    navigate(`/accounts/${accountId}/quizzes/${quizId}/test`);
                                    toggleCreateDropdown();
                                }}
                            >
                                Test
                            </Button>
                        </div>
                    )}
                </div>
                <p className="mx-auto flex items-center justify-center">{quizTitle}</p>
                <div className="flex items-center justify-center">
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
            <Outlet context={{ setQuizTitle }} />
        </div>
    );
}

export default QuizRunLayout;
