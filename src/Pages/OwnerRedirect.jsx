import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

export default function OwnerRedirect() {
  return (
    <>
      <Helmet>
        <title>Revo | Download app and start a new journey</title>
      </Helmet>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Restaurant Owner Registration
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              To register as a restaurant owner, please download our mobile
              application
            </p>
          </div>
          <div className="mt-8">
            <a
              href="#" // Replace with actual mobile app link
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-[#F27141] hover:bg-[#d85f32]"
            >
              Download Mobile App
            </a>
            <p className="mt-4 text-sm text-gray-500">
              Already have an account?{" "}
              <Link to="/login" className="text-[#F27141] hover:text-[#d85f32]">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
