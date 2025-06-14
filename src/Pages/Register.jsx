import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
// import GoogleIcon from "./../assets/images/google-color-svgrepo-com.svg";
// import FacebookIcon from "./../assets/images/facebook-1-svgrepo-com.svg";
import { authContext } from "../Context/AuthProvider";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; // For show/hide icons
import { Helmet } from "react-helmet";

export default function Register() {
  // States
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Context
  const { signUp } = useContext(authContext);

  // Navigation
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string().email("Invalid Email").required("Email is required."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one non-alphanumeric character."
      )
      .required("Password is required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .notRequired(),
  });

  const handleRegister = async (user) => {
    const { name, email, password } = user;
    const userType = sessionStorage.getItem("userType") || "user";

    try {
      setError("");
      setIsLoading(true);
      await signUp(name, email, password, userType); // Pass userType to Firebase
      sessionStorage.removeItem("userType"); // Clean up after registration
      navigate("/login");
      toast.success("Account created successfully");
    } catch (error) {
      if (error.message.includes("(auth/email-already-in-use)")) {
        setError("Email already exists");
      } else if (error.message.includes("Missing password requirements")) {
        setError("Password doesn't match requirements");
      } else {
        setError("Failed to create a new account");
      }
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: registerSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <Helmet>
        <title>Revo | Register</title>
      </Helmet>
      <div className="py-16">
        <div className="max-w-md sm:max-w-lg mx-auto p-6 bg-white rounded-lg shadow-[0_4px_6px_0_rgba(242,113,65,0.3)]">
          <h2 className="text-[34px] font-Grotesk font-semibold text-center text-[#0D0C0C] mb-6">
            Create an Account
          </h2>

          {/* Social Media Buttons */}
          {/* <button className="w-full flex justify-center items-center gap-8 border border-[#00000080] text-[#0D0C0C] font-Grotesk font-medium py-2 mb-4">
            <img src={GoogleIcon} alt="Google Icon" width={25} />
            Continue with Google
          </button>

          <button className="w-full flex justify-center items-center gap-5 bg-blue-800 text-white py-2 mb-4 hover:bg-blue-900 border border-blue-800">
            <img src={FacebookIcon} alt="Facebook Icon" width={25} />
            Continue with Facebook
          </button>

          <div className="relative text-center text-[#000000] my-4">
            <span className="before:absolute before:left-0 before:top-1/2 before:w-[45%] before:h-[0.5px] before:bg-[#000000] before:-translate-y-1/2 after:absolute after:right-0 after:top-1/2 after:w-[45%] after:h-[0.5px] after:bg-[#000000] after:-translate-y-1/2">
              OR
            </span>
          </div> */}

          {/* Register Form */}
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer ${
                  formik.touched.name && formik.errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-[#F27141]"
                }`}
                placeholder=""
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#F27141]"
              >
                Name
              </label>
              {formik.touched.name && formik.errors.name && (
                <span className="text-red-500 text-sm">
                  {formik.errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-[#F27141]"
                }`}
                placeholder=" "
                required
              />
              <label
                htmlFor="email"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#F27141]"
              >
                Email Address
              </label>
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500 text-sm">
                  {formik.errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="w-full mb-5 group">
              <div className="relative z-0">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`block py-2.5 px-0 pr-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500 focus:border-red-500"
                      : "focus:border-[#F27141]"
                  }`}
                  placeholder=" "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-5 transform -translate-y-1/2 mr-5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <label
                  htmlFor="password"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#F27141]"
                >
                  Password
                </label>
              </div>
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-500 text-sm">
                  {formik.errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative z-0 w-full mb-5 group">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`block py-2.5 px-0 pr-10 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "focus:border-[#F27141]"
                }`}
                placeholder=" "
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-5 transform -translate-y-1/2 mr-5 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              <label
                htmlFor="confirmPassword"
                className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#F27141]"
              >
                Confirm Password
              </label>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>

            {/* Subscribe to Newsletter */}
            <div className="flex items-center gap-2">
              <input type="checkbox" id="subscribe" className="w-4 h-4" />
              <label htmlFor="subscribe" className="text-sm text-gray-700">
                Subscribe to our Newsletter
              </label>
            </div>

            <p className="block text-[12px] font-Grotesk mb-7">
              By creating an account you agree to the Privacy and to the terms
              of use
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#F27141] text-white py-2 rounded-md hover:bg-[#e05f35]"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-full flex justify-center items-center">
                  <Loader2 className="animate-spin text-white" />
                </div>
              ) : (
                "Create an Account"
              )}
            </button>
          </form>

          {/* Status Message */}
          {error && <p className="mt-4 text-center text-red-500">{error}</p>}

          {/* Login Link */}
          <p className="text-sm text-center text-gray-700 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
