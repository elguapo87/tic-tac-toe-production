import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AppContext } from '../context/AppContext';

const Login = () => {

    const appContext = useContext(AppContext);
    if (!appContext) throw new Error("Login must be within AppContextProvider");
    const { login } = appContext;

    const [currentState, setCurrentState] = useState<"Login" | "Sign Up">("Sign Up");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState<File | null>(null);
    const [loginId, setLoginId] = useState("");
    const navigate = useNavigate();

    const onSubmitHandler = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        try {
            if (currentState === "Login") {
                // Login → use identifier + password
                await login("Login", { identifier: loginId, password });

            } else {
                // Sign Up → handle optional image
                if (!image) {
                    await login("Sign Up", { name, email, password });

                } else {
                    const reader = new FileReader();
                    reader.readAsDataURL(image);
                    reader.onload = async () => {
                        const base64Img = typeof reader.result === "string" ? reader.result : undefined;
                        await login("Sign Up", { userImg: base64Img, name, email, password });
                    };
                }
            }

        } catch (error) {
            console.error("Server error", error);
        }
    };

    return (
        <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
            {/* RIGHT */}
            <form onSubmit={onSubmitHandler} className="relative border-2 bg-gray-800 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">

                <div onClick={() => navigate("/")} className="absolute top-3 right-3 text-xl font-semibold cursor-pointer">X</div>

                <h2 className="font-medium text-2xl flex justify-between items-center">
                    {currentState}
                </h2>

                {
                    currentState === "Sign Up"
                      &&
                    <>
                        <label htmlFor="image">
                            <input onChange={(e) => e.target.files && setImage(e.target.files[0])} type="file" id="image" hidden />
                            <div className="flex items-center gap-3">
                                Profile Image
                                <img src={image ? URL.createObjectURL(image) : assets.avatar_icon} className="w-10 rounded-full aspect-square cursor-pointer" alt="" />
                            </div>
                        </label>

                        <input onChange={(e) => setName(e.target.value)} value={name} type="text" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Name" required />
                        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email Address" required />
                    </>
                }

                {/* LOGIN FIELD */}
                {
                    currentState === "Login"
                      &&
                    <input onChange={(e) => setLoginId(e.target.value)} value={loginId} type="text" placeholder="Name or Email Address" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                }

                {/* PASSWORD (shared for both Login + Sign Up) */}
                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder="Password" className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />

                <button type="submit" className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer">
                    {currentState === "Sign Up" ? "Create Account" : "Login Now"}
                </button>

                {
                    currentState !== "Login"
                    &&
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <input type="checkbox" required />
                        <p>Agree to the terms of use & privacy policy.</p>
                    </div>
                }

                <div className="flex flex-col gap-2">
                    {
                        currentState === "Sign Up"
                            ?
                            <p className="text-sm text-gray-400">Already have an account? <span onClick={() => setCurrentState("Login")} className="font-medium text-violet-500 cursor-pointer">Login here</span></p>
                            :
                            <p className="text-sm text-gray-400">Create an account? <span onClick={() => setCurrentState("Sign Up")} className="font-medium text-violet-500 cursor-pointer">Click here</span></p>
                    }
                </div>

            </form>

        </div>
    )
}

export default Login
