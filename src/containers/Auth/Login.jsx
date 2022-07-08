import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa"
import { APP_NAME, BG_IMAGE, LOGO_IMAGE } from "../../config"
import { close, open } from "../../store/features/alert-slice";
import { login } from "../../store/features/auth-slice";
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

  const handleSubmit = useCallback((username, password) => {
    setError({})
    setLoading(true)
    setStatus("pending")
    setTimeout(() => {
      if (username === "admin" && password === "password") {        
        setStatus("fulfilled")
      } else {
        setError({ ...error, detail: "Unable to login with provided credentials!"})
        setStatus("rejected")
      }
      setLoading(false)
    }, 2000)
  }, []);

  useEffect(() => {
    if (status === "fulfilled") {
      dispatch(
        open({
          message: "Logged in Successfully!",
          type: "success",
        })
      );
      const item = JSON.stringify({"user": "admin"})
      localStorage.setItem('user', item)
      dispatch(login(item))
      setUsername("")
      setPassword("")
    } else if (
      status === "rejected" &&
      (error?.error || error?.detail)
    ) {
      dispatch(
        open({
          message: String(error?.error || error?.detail || "A server error occurred!"),
          type: "danger",
        })
      );
    }
  }, [dispatch, status, error]);

  return (
    <div className="bg-gray-200 flex flex-row-reverse min-h-screen items-center justify-between w-full">
      <div
        className="hidden md:absolute md:block md:h-full md:right-0 md:top-0 md:w-1/2"
        style={{
          background: `url(${BG_IMAGE})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div
          className="md:flex md:items-end md:justify-center md:h-full md:px-3 md:pb-9 lg:px-8 lg:pb-12"
          style={{
            background: "rgba(0, 0, 0, 0.8)",
          }}
        >
          <h1 className="md:font-semibold md:m-3 md:text-4xl md:text-gray-200 md:tracking-wider md:uppercase lg:text-5xl">
            &ldquo;a building with four walls and tomorrow inside&rdquo;
          </h1>
        </div>
      </div>
      <div className="w-full md:flex md:flex-col md:items-center md:mr-auto md:px-6 md:w-1/2">
        <div className="bg-gray-50 flex flex-col justify-center max-h-[600px] max-w-xs mx-auto py-6 rounded-md shadow-lg w-full">
          <div>
            <img
              className="mx-auto h-[40px] w-[40px]"
              src={LOGO_IMAGE}
              alt={APP_NAME}
            />
            <h2 className="my-3 text-center text-lg font-extrabold text-gray-900 md:text-xl lg:text-2xl">
              Sign In
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
                    to="#"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    {" "}
                    Forgot your password?{" "}
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
                  title="Sign In"
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
