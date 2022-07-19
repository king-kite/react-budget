import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { APP_NAME, LOGO_IMAGE, LOGIN_PAGE_URL } from "../../config";
import { close, open } from "../../store/features/alert-slice";
import { useRegisterMutation } from "../../store/features/auth-api-slice";
import { Alert, Button, Input } from "../../components/controls";

const Register = () => {
  const [errors, setError] = useState({});
  const [register, { isLoading, error, status }] = useRegisterMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const message = useSelector((state) => state.alert.message);
  const type = useSelector((state) => state.alert.type);
  const visible = useSelector((state) => state.alert.visible);

  const handleSubmit = useCallback(
    (email, password) => {
      setError({});
      if (email === null || email === undefined) {
        setError((prevState) => ({
          ...prevState,
          email: "Email is required",
        }));
      }
      if (password === null || password === undefined) {
        setError((prevState) => ({
          ...prevState,
          password: "Email is required",
        }));
      }
      if (email && password) register({ email, password });
    },
    [register]
  );

  useEffect(() => {
    if (status === "fulfilled") {
      dispatch(
        open({
          message: "Registration was successful!",
          type: "success",
        })
      );
      setEmail("");
      setPassword("");
      setError({});
    } else if (status === "rejected" && error) {
      dispatch(
        open({
          message: String(error.detail),
          type: "danger",
        })
      );
    }
  }, [status, error]);

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
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                dispatch(close());
                handleSubmit(email, password);
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
                    error={error?.email || errors?.usernmae}
                    label="Email"
                    labelColor="text-gray-700"
                    onChange={(e) => setEmail(e.target.value)}
                    padding="p-2 md:p-3"
                    type="email"
                    placeholder="Enter email"
                    rounded="rounded-md"
                    value={email.value}
                  />
                </div>
                <div className="my-4">
                  <Input
                    bg="bg-white focus:bg-gray-50"
                    bdr="border"
                    bdrColor="border border-gray-300"
                    color="text-gray-700"
                    disabled={isLoading}
                    error={error?.password || errors?.password}
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

export default Register;
