import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../Firebase/Config';
import { doc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useSelector } from 'react-redux';

const SignUp = () => {
  const [register, setRegister] = useState({
    email: '',
    password: '',
    cpassword: '',
    username: '',
    gender: '',
    age: '',
  });
  const [loading, setLoading] = useState(false);
  const navigateTo = useNavigate();
  const provider = new GoogleAuthProvider();
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn === true) {
      navigateTo("/");
    }
  }, [isLoggedIn]);

  const registerUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    const age = parseInt(register.age, 10);
    if (register.password !== register.cpassword) {
      alert('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (isNaN(age) || age <= 0 || age >= 80) {
      alert('Please enter a valid age between 1 and 79.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, register.email, register.password);
      const user = userCredential.user;

      await setDoc(doc(db, 'Users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: register.username,
        gender: register.gender,
        age: register.age,
        cart: [],
        orders: [],
        createdAt: new Date().toLocaleString(),
        Role: "user",
      });
      alert('Registered successfully!');
      navigateTo('/');
    } catch (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      await setDoc(doc(db, 'Users', user.uid), {
        uid: user.uid,
        email: user.email,
        username: register.username,
        gender: register.gender,
        age: register.age,
        orders: [],
        createdAt: new Date().toLocaleString(),
        Role: "user",
      });
      alert('Registered successfully with Google!');
      navigateTo('/');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-5 max-w-screen-lg w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="hidden md:block relative">
          <img
            src="https://picsum.photos/800/600?random=8"
            alt="Signup Background"
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-gray-900 bg-opacity-50"></div>
        </div>
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
          <form onSubmit={registerUser} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                required
                value={register.email}
                onChange={(e) => setRegister({ ...register, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                autoComplete="username"
                required
                value={register.username}
                onChange={(e) => setRegister({ ...register, username: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                name="gender"
                required
                value={register.gender}
                onChange={(e) => setRegister({ ...register, gender: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                autoComplete="age"
                required
                min="1"
                max="79"
                value={register.age}
                onChange={(e) => setRegister({ ...register, age: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                required
                value={register.password}
                onChange={(e) => setRegister({ ...register, password: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="cpassword"
                name="cpassword"
                autoComplete="new-password"
                required
                value={register.cpassword}
                onChange={(e) => setRegister({ ...register, cpassword: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Sign Up
            </button>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full px-4 py-2 mt-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Sign Up with Google
            </button>
          </form>
          <div className="mt-4 flex justify-center items-center">
            <span className="mr-2">Already have an account?</span>
            <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
