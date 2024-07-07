import Button from 'components/common/Button';
import { Link } from 'react-router-dom';

function Login() {
    return (
        <div className="w-full h-screen p-4 flex justify-center items-center">
            <div className="w-full max-w-lg p-4 flex flex-col gap-2 border border-solid border-black">
                <Button className="bg-indigo-300">Abracadabra</Button>
                <form onSubmit={event => event.preventDefault()}>
                    <fieldset className="flex flex-col gap-4 border border-solid border-black p-4">
                        <legend>Log in</legend>
                        <label className="flex flex-col gap-2">
                            Email:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="title"
                                placeholder="Type type your email"
                            />
                        </label>
                        <label className="flex flex-col gap-2">
                            Password:
                            <input
                                className="border border-solid border-black outline-none px-4 py-2"
                                name="description"
                                placeholder="Let me know, i will give an ice cream"
                                type="password"
                            />
                            <button className="px-4 py-2 border border-solid border-black bg-red-200">
                                Abracadabra
                            </button>
                        </label>
                        <div className="flex justify-between">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" />
                                Remember who you are
                            </label>
                            <a className="text-blue-300 underline cursor-pointer">You forgot?</a>
                        </div>
                        <Link to="/quizzes">
                            <Button className="bg-orange-200 w-full">Buzz</Button>
                        </Link>
                        <Link
                            to="/sign-up"
                            className="text-blue-300 underline cursor-pointer w-full text-center"
                        >
                            Give me a sign
                        </Link>
                    </fieldset>
                </form>
            </div>
        </div>
    );
}

export default Login;
