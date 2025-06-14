/* eslint-disable react/prop-types */
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import LoginForm from "./LoginForm";
// import GoogleIcon from './../assets/images/google-color-svgrepo-com.svg'
// import FacebookIcon from './../assets/images/facebook-1-svgrepo-com.svg'

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Login to Continue
        </h2>

        {/* Login Buttons for Google & Facebook */}
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

        <LoginForm onSuccess={onSuccess} />

        {/* Register Link */}
        <p className="text-sm text-center text-gray-700 mt-6">
          {"Don't have an account?"}{" "}
          <Link
            to="/account-type"
            className="text-[#F27141] hover:text-[#e05f35]"
            onClick={onClose}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
