import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
// import GoogleIcon from './../assets/images/google-color-svgrepo-com.svg'
// import FacebookIcon from './../assets/images/facebook-1-svgrepo-com.svg'
import LoginForm from "../Components/LoginForm";
import { Helmet } from "react-helmet";

export default function Login() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate("/");
  };

  return (
    <>
      <Helmet>
        <title>Revo | Login</title>
      </Helmet>
      <div className="py-16">
        <div className="max-w-md sm:max-w-lg mx-auto p-6 bg-white rounded-lg shadow-[0_4px_6px_0_rgba(242,113,65,0.3)]">
          <h2 className="text-[34px] font-Grotesk font-semibold text-center text-[#0D0C0C] mb-6">
            Login
          </h2>

          {/* Login Buttons for Google & Facebook */}
          {/* <button className="w-full flex justify-center items-center gap-8 border border-[#00000080] text-[#0D0C0C] font-Grotesk font-medium py-2 mb-4">
            <img src={GoogleIcon} alt="Google Icon" width={25} />
            Continue with Google
          </button>

          <button className="w-full flex justify-center items-center gap-5 bg-blue-800 text-white py-2 mb-4 hover:bg-blue-900 border border-blue-800">
            <img src={FacebookIcon} alt="Facebook Icon" width={25} /> 
            Continue with Facebook
          </button> */}

          {/* <div className="relative text-center text-[#000000] my-4">
            <span className="before:absolute before:left-0 before:top-1/2 before:w-[45%] before:h-[0.5px] before:bg-[#000000] before:-translate-y-1/2 after:absolute after:right-0 after:top-1/2 after:w-[45%] after:h-[0.5px] after:bg-[#000000] after:-translate-y-1/2">
              OR
            </span>
          </div> */}

          {/* Login Form */}
          <LoginForm onSuccess={handleLoginSuccess} />

          {/* Register Link */}
          <p className="text-sm text-center text-gray-700 mt-6">
            {"Don't have an account?"}{" "}
            <Link to="/account-type" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
