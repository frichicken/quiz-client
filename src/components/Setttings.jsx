import { useState } from 'react';
import Button from './common/Button';

const Tabs = {
    Information: 1,
    AccountAndPrivacy: 2
};

const Setttings = () => {
    const [currentTab, setCurrentTab] = useState(Tabs.Information);

    return (
        <div className="flex-1 p-4 flex flex-col gap-4">
            <h1 className="text-lg tracking-wider border border-solid border-black px-4 py-2 w-fit">
                SETTINGS
            </h1>
            <div className="flex items-center gap-4">
                <Button onClick={() => setCurrentTab(Tabs.Information)}>Infomation</Button>
                <Button onClick={() => setCurrentTab(Tabs.AccountAndPrivacy)}>
                    Account and privacy
                </Button>
            </div>
            <div className="flex-1 border border-solid border-black p-4">
                {currentTab == Tabs.Information && (
                    <form
                        onSubmit={event => event.preventDefault()}
                        className="flex flex-col gap-4 border border-solid border-black p-4"
                    >
                        <label className="flex flex-col gap-2">
                            Email:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this email, please"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Username:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Your username, please"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            First name:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this first name, please"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Last name:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this last name, please"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Description:
                            <textarea
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="Give it some descriptive words"
                            />
                        </label>
                        <Button>Save</Button>
                    </form>
                )}
                {currentTab == Tabs.AccountAndPrivacy && (
                    <form
                        onSubmit={event => event.preventDefault()}
                        className="flex flex-col gap-4 border border-solid border-black p-4"
                    >
                        <label className="flex flex-col gap-2">
                            Current password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this email, please"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            New password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Your username, please"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Confirm password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Titled this first name, please"
                            />
                        </label>
                        <Button>Change password</Button>
                        <Button>Delete account</Button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Setttings;
