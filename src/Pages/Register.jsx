// Register.jsx (معدلة بالكامل مع دعم رفع صورة Base64)
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { authContext } from "../Context/AuthProvider";
import { Loader2, Eye, EyeOff, Camera } from "lucide-react";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const { signUp } = useContext(authContext);
  const navigate = useNavigate();

  const registerSchema = Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string().email("Invalid Email").required("Email is required."),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters.")
      .matches(/[a-zA-Z]/, "Password must contain at least one letter.")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .matches(/[^a-zA-Z0-9]/, "Password must contain at least one symbol.")
      .required("Password is required."),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .notRequired(),
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (user) => {
    const { name, email, password } = user;
    const userType = sessionStorage.getItem("userType") || "user";

    try {
      setError("");
      setIsLoading(true);
      await signUp(name, email, password, userType, profileImage);
      sessionStorage.removeItem("userType");
      navigate("/login");
      toast.success("Account created successfully");
    } catch (error) {
      if (error.message.includes("(auth/email-already-in-use)")) {
        setError("Email already exists");
      } else {
        setError("Failed to create a new account");
      }
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema: registerSchema,
    onSubmit: handleRegister,
  });

  return (
    <>
      <Helmet>
        <title>Revo | Register</title>
      </Helmet>
      <div className="py-16">
        <div className="max-w-md sm:max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-[30px] font-semibold text-center text-[#0D0C0C] mb-6">
            Create an Account
          </h2>

          {/* Upload Image */}
          <div className="flex justify-center mb-6">
            <label
              htmlFor="profileImageUpload"
              className="relative cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-[#F27141] flex items-center justify-center overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Camera className="text-[#F27141]" size={28} />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                id="profileImageUpload"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="relative z-0 w-full group">
              <label
                htmlFor="name"
                className="block mb-1 text-base text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#F27141]"
                required
              />
              {formik.touched.name && formik.errors.name && (
                <span className="text-red-500 text-sm">
                  {formik.errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="relative z-0 w-full group">
              <label
                htmlFor="email"
                className="block mb-1 text-base text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 text-sm text-gray-900 focus:outline-none focus:border-[#F27141]"
                required
              />
              {formik.touched.email && formik.errors.email && (
                <span className="text-red-500 text-sm">
                  {formik.errors.email}
                </span>
              )}
            </div>

            {/* Password Field */}
            <div className="relative z-0 w-full group">
              <label
                htmlFor="password"
                className="block mb-1 text-base text-gray-700"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 text-sm text-gray-900 pr-10 focus:outline-none focus:border-[#F27141]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.password && formik.errors.password && (
                <span className="text-red-500 text-sm">
                  {formik.errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="relative z-0 w-full group">
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-base text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="block w-full px-3 py-2 border-b-2 border-gray-300 text-sm text-gray-900 pr-10 focus:outline-none focus:border-[#F27141]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <span className="text-red-500 text-sm">
                    {formik.errors.confirmPassword}
                  </span>
                )}
            </div>

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

            {error && <p className="mt-4 text-center text-red-500">{error}</p>}

            <p className="text-sm text-center text-gray-700 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
