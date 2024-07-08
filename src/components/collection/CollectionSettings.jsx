import clsx from 'clsx';
import Button from 'components/common/Button';
import { collections, quizzes } from 'data';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const CollectionSettings = () => {
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
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

    const handleOpenQuizModal = () => setIsQuizModalOpen(true);
    const handleCloseQuizModal = () => setIsQuizModalOpen(false);

    return (
        <>
            <div className="flex-1 border border-solid border-black p-4 overflow-y-auto">
                <div className="flex items-center justify-between">
                    <h2>{collectionId ? 'Do whatever you want to this collection' : 'Delivery'}</h2>
                    <div className="flex items-center gap-2">
                        <Button className="bg-amber-300">Heck yes</Button>
                        <Link to="/collections">
                            <Button className="bg-indigo-300">Deny</Button>
                        </Link>
                        {collectionId && (
                            <Button className="bg-red-100">Let&apos;s say goodbye</Button>
                        )}
                    </div>
                </div>
                <form onSubmit={event => event.preventDefault()} className="mt-4">
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Infomation</legend>
                        <label className="flex flex-col gap-2">
                            Title:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this collection, please"
                                value={title}
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Description:
                            <textarea
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="Give it some descriptive words"
                                value={description}
                            />
                        </label>
                    </fieldset>
                </form>
                <form onSubmit={event => event.preventDefault()} className="mt-4">
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Quizzes</legend>
                        <div className="flex flex-col gap-4">
                            {quizzes
                                .filter(quiz => quizIds.includes(quiz.id))
                                .map(quizz => {
                                    const { title, description, id, questions, createdAt } = quizz;

                                    return (
                                        <div
                                            key={id}
                                            className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between"
                                        >
                                            <div>
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
                                            </div>
                                            <div className="flex items-center gap-2">
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
                            <Button className="bg-orange-300" onClick={handleOpenQuizModal}>
                                Can i have another one, please? please, one more
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </div>
            <div
                className={clsx(
                    'fixed inset-0 bg-[rgba(0,0,0,0.2)] w-full h-screen flex justify-center items-center',
                    isQuizModalOpen ? '' : 'hidden'
                )}
            >
                <div className="flex flex-col items-center gap-4 p-4 w-full max-w-md max-h-96 border border-solid border-black bg-indigo-50">
                    <div className="flex justify-end w-full">
                        <Button onClick={handleCloseQuizModal}>Close</Button>
                    </div>
                    <input
                        className="border border-solid border-black outline-none px-4 py-2 w-full"
                        name="keyword"
                        placeholder="Your grandma is going to check your search history"
                    />
                    <div className="flex flex-col gap-2 w-full overflow-auto">
                        {quizzes.map(quiz => {
                            const { title, description, id, questions, createdAt } = quiz;

                            return (
                                <div
                                    key={id}
                                    className="text-left w-full px-4 py-2 border border-solid border-black cursor-pointer flex items-center justify-between bg-rose-50"
                                >
                                    <div>
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
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button className="bg-green-100">Choose this</Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CollectionSettings;
