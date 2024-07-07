import Button from 'components/Button';

const Signup = () => {
    return (
        <div className="w-full h-screen p-4 flex justify-center items-center">
            <div className="w-full max-w-lg p-4 flex flex-col gap-2 border border-solid border-black">
                <Button className="bg-indigo-300">An evening person?</Button>
                <form onSubmit={event => event.preventDefault()}>
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Sign up</legend>
                        <label className="flex flex-col gap-2">
                            Email:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="We need your email, please"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="It's our secret"
                                type="password"
                            />
                            <Button className="bg-red-200">Abracadabra</Button>
                        </label>
                        <label className="flex flex-col gap-2">
                            Confirm password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="Wait we need to check"
                                type="password"
                            />
                            <Button className="bg-red-200">Voilà</Button>
                        </label>
                        <Button className="bg-orange-200">Woody</Button>
                        <a className="text-blue-300 underline cursor-pointer w-full text-center">
                            Can&apos;t believe that you already have it?
                        </a>
                    </fieldset>
                </form>
            </div>
        </div>
    );
};

export default Signup;
