import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import {
  APP_NAME,
  LOGO_IMAGE,
  REGISTER_PAGE_URL,
} from "../../config";
import { close, open } from "../../store/features/alert-slice";
import { login } from "../../store/features/auth-slice";
import { Alert, Button, Input } from "../../components/controls";

const Login = () => {
  const [error, setError] = useState({});
  const [status, setStatus] = useState("");
  const [isLoading, setLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const message = useSelector((state) => state.alert.message);
  const type = useSelector((state) => state.alert.type);
  const visible = useSelector((state) => state.alert.visible);

  const handleSubmit = useCallback(
    (username, password) => {
      setError({});
      setLoading(true);
      setStatus("pending");
      setTimeout(() => {
        let user = localStorage.getItem("user");
        if (user === null)
          dispatch(
            open({
              type: "danger",
              message: "User does not exist",
            })
          );
        else {
          user = JSON.parse(user);
          if (username === user.username && password === user.password) {
            setStatus("fulfilled");
            dispatch(login(user));
          } else {
            setError({
              ...error,
              detail: "Unable to login with provided credentials!",
            });
            setStatus("rejected");
          }
        }
        setLoading(false);
      }, 2000);
    },
    [dispatch]
  );

  useEffect(() => {
    if (status === "fulfilled") {
      dispatch(
        open({
          message: "Logged in Successfully!",
          type: "success",
        })
      );
      setUsername("");
      setPassword("");
    } else if (status === "rejected" && (error?.error || error?.detail)) {
      dispatch(
        open({
          message: String(
            error?.error || error?.detail || "A server error occurred!"
          ),
          type: "danger",
        })
      );
    }
  }, [dispatch, status, error]);

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
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(close());
                handleSubmit(username, password);
              }}
            >
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
                    to={REGISTER_PAGE_URL}
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    {" "}
                    Need an account? Sign Up{" "}
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
