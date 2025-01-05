import { ChangeEvent, FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import nProgress from "nprogress";
import { useFetchWithAccessToken } from "@/functions/useFetchWithAccessToken";
import validateEmail from "@/functions/ValidateEmail";
import validatePassword from "@/functions/ValidatePassword";
import { BackendApiUrl } from "@/functions/BackendApiUrl";
import { ResponseDetails } from "@/functions/tryFetchJson";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function LoginForm() {
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: "",
        rememberMe: false,
    });

    const [validation, setValidation] = useState({
        email: "",
        password: "",
    });

    const { fetchPOST } = useFetchWithAccessToken();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.currentTarget;
        setLoginInput((prev) => ({ ...prev, [id]: value }));
    };

    const validateInputs = () => {
        const { email, password } = loginInput;
        const isEmailValid = validateInput("email", email, validateEmail);
        const isPasswordValid = validateInput("password", password, (value) => validatePassword(value, true));
        return isEmailValid && isPasswordValid;
    };

    const validateInput = (field: string, value: string, validator: (value: string) => { isValid: boolean; validationMessage: string }) => {
        const { isValid, validationMessage } = validator(value);
        setValidation((prev) => ({ ...prev, [field]: isValid ? "" : validationMessage }));
        return isValid;
    };

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!validateInputs()) return;
        await login();
    };

    const login = async () => {
        const response: ResponseDetails<{ success: boolean; errorMessage: string }> = await fetchPOST(BackendApiUrl.login, loginInput);
        if (response.data?.success) {
            nProgress.start();
            signIn("oidc", { callbackUrl: "/", redirect: false }).then(() => nProgress.done());
        } else {
            setValidation((prev) => ({
                ...prev,
                password: response.data?.errorMessage || "Invalid request",
            }));
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-black relative">
            <img src="/Assets/images/logo-login.png" className="absolute left-8 top-8 w-48" alt="" />
            <div className="bg-white rounded-xl shadow-lg p-8 z-10 w-96">
                <h1 className="text-3xl font-normal mb-12">Login</h1>
                <form onSubmit={handleLogin} noValidate>
                    <div>
                        <label htmlFor="email" className="block mt-4">Email</label>
                        <input
                            id="email"
                            type="email"
                            className="form-control mt-2 w-full p-2 border border-gray-300 rounded mb-3"
                            placeholder="john.smith@mail.com"
                            value={loginInput.email}
                            onChange={handleInput}
                            autoFocus
                        />
                        {validation.email && <span className="text-red-600">{validation.email}</span>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block mt-4">Password</label>
                        <div className="relative">
                            <input
                                id="password"
                                type={isPasswordVisible ? 'text' : 'password'}
                                className="form-control mt-2 w-full p-2 border border-gray-300 rounded mb-6"
                                placeholder="Password"
                                value={loginInput.password}
                                onChange={handleInput}
                            />
                            <FontAwesomeIcon
                                icon={isPasswordVisible ? faEyeSlash : faEye}
                                className="absolute right-3 top-1/3 transform -translate-y-1/4 cursor-pointer"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                            />
                            {validation.password && <span className="text-red-600">{validation.password}</span>}
                        </div>
                    </div>
                    <div className="flex justify-center mt-10">
                        <button
                            type="submit"
                            className="bg-[#380356] text-white w-64 rounded-full py-2 font-normal"
                        >
                            Log in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
