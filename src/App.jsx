// import React, { useEffect } from "react";
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import { Provider, useDispatch } from "react-redux";
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { auth, db } from "./Firebase/Config";
// import { setActiveUser } from "./Redux/User/UserReducer";
// import './App.css';
// import Home from './Pages/Home';
// import Layout from './Pages/Layout';
// import SignUp from './Pages/SignUp';
// import Login from "./Pages/Login";
// import Resetpassword from "./Pages/Resetpassword";
// import AddProductForm from "./Pages/AddProduct";
// import Products from "./Pages/Products";
// import Cart from "./Pages/Cart";
// import User from "./Pages/User";
// import Description from "./Pages/Description";
// import DashboardAdmin from "./Pages/DashboardAdmin";
// import Checkout from "./Pages/Checkout";
// // import ProductListAdmin from "./Pages/ProductListAdmin";
// import OrdersAdmin from "./Pages/OrdersAdmin";
// import UsersAdmin from "./Pages/UsersAdmin";
// import ReviewAdmin from "./Pages/ReviewAdmin";
// import Payment from "./Pages/Payment";
// import AllProductAdmin from "./Pages/AllProductAdmin";
// import OrderSummary from "./Pages/OrderSummary";
// import UpdateProfleAdmin from "./Pages/UpdateProfleAdmin";
// import MyOrders from "./Pages/MyOrders";
// import OrderDetails from "./Pages/OrderDetails";
// import About from "./Pages/About";
// import Contact from "./Pages/Contact";
// import BannerAdmin from "./Pages/BannerAdmin";
// import { AuthProvider } from "./context/AuthContext";
// import PrivateRoute from "./Pages/PrivateRoute";
// import store from "./Redux/Store";
// import ReturnPolicy from "./Pages/ReturnPolicy";
// import FAQ from "./Pages/FAQ";
// import TermsAndConditions from "./Pages/TermsAndConditions";
// import ShippingPolicy from "./Pages/ShippingPolicy";
// import PrivacyPolicy from "./Pages/PrivacyPolicy";
// import ScrollToTop from "./Components/ScrollToTop";

// function App() {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const uid = user.uid;
//         const querySnapshot = await getDoc(doc(db, "Users", uid));
//         const query = querySnapshot.data();

//         // Ensure createdAt exists and is a valid Timestamp
//         const createdAt = query?.createdAt && query.createdAt.seconds
//           ? new Date(query.createdAt.seconds * 1000).toISOString()
//           : null;

//         dispatch(setActiveUser({
//           email: user.email,
//           userName: user.displayName,
//           userId: user.uid,
//           createdAt: createdAt, // use the converted date or null
//           // wishList: query.wishList,
//           role: query.Role,
//         }));
//       } else {
//         console.log("logged out");
//       }
//     });
//   }, [dispatch]);

//   return (
//     <>
//       <Provider store={store}>
//         <AuthProvider>
//           <Router>
//             < ScrollToTop/>
//             <Routes>
//               <Route exact path='/' element={<Layout />}>
//                 <Route exact path='/' element={<Home />} />
//                 <Route exact path='/auth/SignUp' element={<SignUp />} />
//                 <Route exact path='/auth/Login' element={<Login />} />
//                 <Route exact path='/auth/Reset' element={<Resetpassword />} />
//                 <Route exact path='/admin/product/new' element={<PrivateRoute element={<AddProductForm />} requiredRole="admin" />} />
//                 <Route exact path='/admin/product' element={<PrivateRoute element={<AllProductAdmin />} requiredRole="admin" />} />
//                 <Route exact path='/product' element={<Products />} />
//                 <Route exact path='/cart' element={<Cart />} />
//                 <Route exact path='profile' element={<User />} />
//                 <Route exact path='/description/:id' element={<Description />} />
//                 <Route
//                   path="/admin/dashboard"
//                   element={<PrivateRoute element={<DashboardAdmin />} requiredRole="admin" />}
//                 />
//                 <Route exact path='/checkout' element={<Checkout />} />
//                 <Route exact path='/admin/orders' element={<PrivateRoute element={<OrdersAdmin />} requiredRole="admin" />} />
//                 <Route exact path='/admin/users' element={<PrivateRoute element={<UsersAdmin />} requiredRole="admin" />} />
//                 <Route exact path='/admin/review' element={<PrivateRoute element={<ReviewAdmin />} requiredRole="admin" />} />
//                 <Route exact path='/payment' element={<Payment />} />
//                 <Route exact path='/ordersummary' element={<OrderSummary />} />
//                 <Route exact path='/updateProfileAdmin' element={<UpdateProfleAdmin />} />
//                 <Route exact path='/order/:id' element={<MyOrders />} />
//                 <Route exact path='/admin/orders/:orderId' element={<OrderDetails />} />
//                 <Route exact path='/about' element={<About />} />
//                 <Route exact path='/contact' element={<Contact />} />
//                 <Route exact path="/return-policy" element={<ReturnPolicy />} />
//                 <Route exact path="/faq" element={<FAQ />} />
//                 <Route exact path="/termsandconditions" element={<TermsAndConditions/>} />
//                 <Route exact path="/shipping-policy" element={<ShippingPolicy/>} />
//                 <Route exact path="/privacy-policy" element={<PrivacyPolicy/>} />

//                 <Route exact path='/admin/banner' element={<PrivateRoute element={<BannerAdmin />} requiredRole="admin" />} />
//               </Route>
//             </Routes>
//           </Router>
//           <ToastContainer />
//         </AuthProvider>
//       </Provider>
//     </>
//   );
// }

// export default App;


import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "./Firebase/Config";
import { setActiveUser } from "./Redux/User/UserReducer";
import "./App.css";

// Redux Store
import store from "./Redux/Store";

// Context
import { AuthProvider } from "./context/AuthContext";

// Components
import ScrollToTop from "./Components/ScrollToTop";
import PrivateRoute from "./Pages/PrivateRoute";

// Pages
import Layout from "./Pages/Layout";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import Login from "./Pages/Login";
import Resetpassword from "./Pages/Resetpassword";
import AddProductForm from "./Pages/AddProduct";
import Products from "./Pages/Products";
import Cart from "./Pages/Cart";
import User from "./Pages/User";
import Description from "./Pages/Description";
import DashboardAdmin from "./Pages/DashboardAdmin";
import Checkout from "./Pages/Checkout";
import OrdersAdmin from "./Pages/OrdersAdmin";
import UsersAdmin from "./Pages/UsersAdmin";
import ReviewAdmin from "./Pages/ReviewAdmin";
import Payment from "./Pages/Payment";
import AllProductAdmin from "./Pages/AllProductAdmin";
import OrderSummary from "./Pages/OrderSummary";
import UpdateProfleAdmin from "./Pages/UpdateProfleAdmin";
import MyOrders from "./Pages/MyOrders";
import OrderDetails from "./Pages/OrderDetails";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import BannerAdmin from "./Pages/BannerAdmin";
import ReturnPolicy from "./Pages/ReturnPolicy";
import FAQ from "./Pages/FAQ";
import TermsAndConditions from "./Pages/TermsAndConditions";
import ShippingPolicy from "./Pages/ShippingPolicy";
import PrivacyPolicy from "./Pages/PrivacyPolicy";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userDoc = await getDoc(doc(db, "Users", uid));
        const userData = userDoc.data();

        const createdAt = userData?.createdAt?.seconds
          ? new Date(userData.createdAt.seconds * 1000).toISOString()
          : null;

        dispatch(setActiveUser({
          email: user.email,
          userName: user.displayName,
          userId: user.uid,
          createdAt: createdAt,
          role: userData?.Role,
        }));
      } else {
        // console.log("User logged out");
        // toast.success("Logged Out Successfully")
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Provider store={store}>
      <AuthProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="auth/SignUp" element={<SignUp />} />
              <Route path="auth/Login" element={<Login />} />
              <Route path="auth/Reset" element={<Resetpassword />} />
              <Route path="product" element={<Products />} />
              <Route path="cart" element={<Cart />} />
              <Route path="profile" element={<User />} />
              <Route path="description/:id" element={<Description />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="payment" element={<Payment />} />
              <Route path="ordersummary" element={<OrderSummary />} />
              <Route path="order/:id" element={<MyOrders />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="return-policy" element={<ReturnPolicy />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="termsandconditions" element={<TermsAndConditions />} />
              <Route path="shipping-policy" element={<ShippingPolicy />} />
              <Route path="privacy-policy" element={<PrivacyPolicy />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin">
              <Route path="dashboard" element={<PrivateRoute element={<DashboardAdmin />} requiredRole="admin" />} />
              <Route path="product/new" element={<PrivateRoute element={<AddProductForm />} requiredRole="admin" />} />
              <Route path="product" element={<PrivateRoute element={<AllProductAdmin />} requiredRole="admin" />} />
              <Route path="orders" element={<PrivateRoute element={<OrdersAdmin />} requiredRole="admin" />} />
              <Route path="orders/:orderId" element={<PrivateRoute element={<OrderDetails />} requiredRole="admin" />} />
              <Route path="users" element={<PrivateRoute element={<UsersAdmin />} requiredRole="admin" />} />
              <Route path="review" element={<PrivateRoute element={<ReviewAdmin />} requiredRole="admin" />} />
              <Route path="banner" element={<PrivateRoute element={<BannerAdmin />} requiredRole="admin" />} />
              <Route path="updateProfileAdmin" element={<UpdateProfleAdmin />} />
            </Route>
          </Routes>
          {/* <ToastContainer /> */}
        </Router>
      </AuthProvider>
    </Provider>
  );
}

export default App;
