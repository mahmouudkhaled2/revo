/* eslint-disable react/prop-types */
import { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Loader2 } from 'lucide-react';
import { authContext } from '../Context/AuthProvider';

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email is required.'),
  password: Yup.string().required('Password is required.'),
});

export default function LoginForm({ onSuccess, className = '' }) {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useContext(authContext);

  const handleLogin = async (user) => {
    const { email, password } = user;

    try {
      setError('');
      setIsLoading(true);
      await signIn(email, password);
      onSuccess?.(); // Call the success callback if provided
    } catch {
      setError('Incorrect email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: handleLogin,
  });

  return (
    <form onSubmit={formik.handleSubmit} className={`space-y-4 ${className}`}>
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
              ? 'border-red-500 focus:border-red-500'
              : 'focus:border-[#F27141]'
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
          <span className="text-red-500 text-sm">{formik.errors.email}</span>
        )}
      </div>

      {/* Password Field */}
      <div className="relative z-0 w-full mb-5 group">
        <input
          type="password"
          name="password"
          id="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 peer ${
            formik.touched.password && formik.errors.password
              ? 'border-red-500 focus:border-red-500'
              : 'focus:border-[#F27141]'
          }`}
          placeholder=" "
          required
        />
        <label
          htmlFor="password"
          className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-[#F27141]"
        >
          Password
        </label>
        {formik.touched.password && formik.errors.password && (
          <span className="text-red-500 text-sm">
            {formik.errors.password}
          </span>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#F27141] text-white py-2 rounded-md hover:bg-[#e05f35] flex justify-center items-center"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Login'}
      </button>

      {/* Error Message */}
      {error && <p className="mt-4 text-center text-red-600">{error}</p>}
    </form>
  );
} 