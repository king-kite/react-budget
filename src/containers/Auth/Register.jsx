import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa"
import { APP_NAME, BG_IMAGE, LOGO_IMAGE, LOGIN_PAGE_URL } from "../../config"
import { close, open } from "../../store/features/alert-slice";
import { Alert, Button, Input } from "../../components/controls";

const Login = () => {
  const [error, setError] = useState({})
  const [status, setStatus] = useState("")
  const [isLoading, setLoading] = useState(false)

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const dispatch = useDispatch();
  const message = useSelector((state) => state.alert.message);
  const type = useSelector((state) => state.alert.type);
  const visible = useSelector((state) => state.alert.visible);

  const navigate = useNavigate()

  const handleSubmit = useCallback((username, password) => {
    setError({})
    setLoading(true)
    setStatus("pending")
    setTimeout(() => {
      if (username === null || username === undefined) {
        setError(prevState => ({...prevState, username: "Username is required"}))
      }
      if (password === null || password === undefined) {
        setError(prevState => ({...prevState, password: "Username is required"}))
      }
      if (username && password) {
        localStorage.setItem("user", JSON.stringify({username, password}))
        dispatch(
          open({
            message: "Registration was successful!",
            type: "success",
          })
        );
        setUsername("")
        setPassword("")
        setError({})
        navigate(LOGIN_PAGE_URL)
      }
      setLoading(false)
    }, 2000)
  }, [dispatch, navigate]);

  return (
    <div className="bg-gray-200 flex flex-row-reverse min-h-screen items-center justify-between w-full">
      <div className="w-full md:flex md:flex-col md:items-center md:px-6">
        <div className="bg-gray-50 flex flex-col justify-center max-h-[600px] max-w-xs mx-auto py-6 rounded-md shadow-lg w-full">
          <div>
            <img
              className="mx-auto h-[40px] w-[40px]"
              src={LOGO_IMAGE}
              alt={APP_NAME}
            />
            <h2 className="capitalize my-3 text-center text-lg font-extrabold text-gray-900 md:text-xl lg:text-2xl">
              Sign Up
            </h2>
          </div>
          <div className="px-10 space-y-4">
            <div className={visible ? "block w-full z-[45]" : "hidden"}>
              <Alert
                message={message}
                onClick={() => dispatch(close())}
                type={type}
                visible={visible}
              />
            </div>
            <form className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(close())
                handleSubmit(username, password);
              }}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="my-4">
                  <Input
                    bg="bg-white focus:bg-gray-50"
                    bdr="border"
                    bdrColor="border border-gray-300"
                    color="text-gray-700"
                    disabled={isLoading}
                    error={error?.username}
                    label="Username"
                    labelColor="text-gray-700"
                    onChange={(e) => setUsername(e.target.value)}
                    padding="p-2 md:p-3"
                    placeholder="Enter username"
                    rounded="rounded-md"
                    value={username.value}
                  />
                </div>
                <div className="my-4">
                  <Input
                    bg="bg-white focus:bg-gray-50"
                    bdr="border"
                    bdrColor="border border-gray-300"
                    color="text-gray-700"
                    disabled={isLoading}
                    error={error?.password}
                    label="Password"
                    labelColor="text-gray-700"
                    onChange={(e) => setPassword(e.target.value)}
                    padding="p-2 md:p-3"
                    placeholder="Enter Password"
                    rounded="rounded-md"
                    type="password"
                    value={password.value}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link
                    to={LOGIN_PAGE_URL}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    {" "}
                    Already have an account? Sign In{" "}
                  </Link>
                </div>
              </div>
              <div>
                <Button
                  border="border border-transparent"
                  bg="bg-primary-500 group hover:bg-primary-600"
                  bold="medium"
                  caps
                  color="text-white"
                  focus="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                  IconLeft={FaLock}
                  loader
                  loading={isLoading}
                  padding="py-2 px-4"
                  rounded="rounded-md"
                  title="Sign Up"
                  titleSize="text-sm"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
