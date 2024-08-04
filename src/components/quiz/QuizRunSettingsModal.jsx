import clsx from 'clsx';
import Button from 'components/common/Button';
import { useState } from 'react';
import { QuestionTypes, QuestionTypeTexts } from 'utils/constants';

function QuizRunSettingsModal({ defaultSettings, onSave = () => {}, max }) {
    const [settings, setSettings] = useState(defaultSettings);

    const handleSet = (which, value) => {
        setSettings({ ...settings, [which]: value });
    };

    return (
        <div className="fixed inset-0 z-20 bg-[rgba(0,0,0,0.2)] w-full h-screen flex justify-center items-center p-4">
            <div className="flex flex-col items-center gap-6 p-4 w-full max-w-xl h-fit border border-solid border-black bg-white">
                <div className="flex items-center justify-between w-full">
                    <p>Maximum questions</p>
                    <input
                        className="border border-solid border-black outline-none px-4 py-2"
                        type="number"
                        onChange={event => handleSet('max', event.target.value)}
                        value={settings.max || max}
                        max={max}
                        min={1}
                    />
                </div>
                {Object.values(QuestionTypes).map(value => {
                    const isIncluded = settings.include.indexOf(value) != -1;

                    return (
                        <div key={value} className="flex items-center justify-between w-full">
                            <p>{QuestionTypeTexts[value]}</p>
                            <Button
                                onClick={() => {
                                    let newInclude = [...settings.include];
                                    if (isIncluded) {
                                        newInclude = settings.include.filter(it => it != value);
                                    } else {
                                        newInclude.push(value);
                                    }
                                    handleSet('include', newInclude);
                                }}
                                className={clsx(isIncluded ? 'bg-black text-white' : '')}
                            >
                                {isIncluded ? 'Exclude' : 'Include'}
                            </Button>
                        </div>
                    );
                })}
                <div className="flex items-center gap-4">
                    <Button onClick={() => onSave(settings)}>Done</Button>
                </div>
            </div>
        </div>
    );
}

export default QuizRunSettingsModal;
