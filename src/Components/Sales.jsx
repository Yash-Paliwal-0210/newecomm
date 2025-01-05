import React, { useEffect, useState } from "react";
import { db } from "../Firebase/Config";
import { collection, getDocs } from "firebase/firestore";
import ReactStars from "react-stars";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setProduct } from "../Redux/Products/ProductReducer";
import { toast } from "react-toastify";
import { useMediaQuery } from "react-responsive";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

export default function Sales() {
  const [products, setProducts] = useState([]);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // const isSmallScreen = useMediaQuery({ query: "(max-width: 640px)" });

  useEffect(() => {
    getProduct();
    
  }, []);

  const getProduct = async () => {
    const querySnapshot = await getDocs(collection(db, "Products"));

    // console.log("querySnapshot",querySnapshot)

    // const productsArray = [];
    // querySnapshot.forEach((doc) => {
    //     const productData = doc.data();
    //     productsArray.push(productData);
    // });
    const productsArray = querySnapshot.docs.map((doc) => {
      const productData = doc.data();
      // Check if CreatedAt exists and is of type Firebase Timestamp
      if (
        productData.CreatedAt &&
        typeof productData.CreatedAt.toDate === "function"
      ) {
        productData.CreatedAt = productData.CreatedAt.toDate().toISOString();
      } else {
        // Handle cases where CreatedAt is missing or not a Timestamp
        productData.CreatedAt = null; // or any default value you prefer
      }
      return productData;
    });

    const filteredProducts = productsArray.filter(
      (product) => product.Sale > 0
    );
    dispatch(setProduct({ product: productsArray }));
    setProducts(filteredProducts);
    setLoading(false)

    // console.log(filteredProducts);
    // console.log(productsArray);
  };

  const handleAddToCart = (product) => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    const existingItem = cartItems.find((item) => item.Id === product.Id);
    if (existingItem) {
      existingItem.quantity = existingItem.quantity + 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    toast.success(`${product.Name} Added Successfully`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <div>
      <div className="mx-32 py-3 md:text-left sm:text-center text-center">
        <h1 className="text-2xl font-bold text-red-500">Today's</h1>
      </div>
      <div className="md:mx-32 mx-0 py-3 md:text-left sm:text-center text-center">
        <h1 className="text-4xl font-bold text-red-500"  >Flash Sales </h1>
      </div>

      {/* Cards for large screens */}
      { loading ? (
        <div className="flex items-center justify-center h-screen">
        <div className="loader"></div>
      </div>
      ): (

      <div className="hidden  flex-wrap xl:mx-32 py-6 sm:flex-row sm:flex gap-5 md:gap-10 justify-center mx-0 sm:mx-0 md:mx-10 lg:mx-10">
        
        {products.slice(0, 4).map((doc, index) => (
          <div
            key={doc.Id}
            className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow "
            style={{ width: "280px" }}
          >
            
              <div className="h-48 flex items-center justify-center overflow-hidden rounded-t-lg">

              <img
                onClick={() => navigateTo(`/Description/${doc.Id}`)}
                className="cursor-pointer w-40 h-40 object-contain rounded-l-lg"
                src={doc.FrontImage}
                alt="product" 
                onLoad={(e) => (e.target.style.visibility = 'visible')}
    style={{
      
      visibility: "hidden", // Hide image until loaded
    }}
                
              />
              </div>
            
            <div className="px-5 pb-5">
              <div>
                <h5
                  onClick={() => navigateTo(`/Description/${doc.Id}`)}
                  className="cursor-pointer text-xl font-semibold tracking-tight text-gray-900 "
                >
                  {doc.Name}  
                </h5>
              </div>
              <div className="flex items-center mt-2.5 mb-5">
                <div className="flex items-center space-x-1 rtl:space-x-reverse">
                  <ReactStars
                    half={true}
                    edit={false}
                    value={doc.Rating}
                    count={5}
                    size={25} 
                    color2={"#ffd700"}
                  />
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded  ms-3">
                  {doc.Rating}
                </span>
              </div>
              {/* <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-gray-900 ">
                  ${doc.Price}
                </span>
                <button
                  onClick={() => handleAddToCart(doc)}
                  className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center "
                >
                  Add to cart
                </button>
              </div> */}
              <div className="flex items-center justify-between">
            {/* <span className="text-3xl font-bold text-gray-900 ">
              ₹{doc.Price}
            </span>
            <span className="text-3xl font-bold text-gray-900 ">
              ₹{doc.Sale}
            </span> */}
            {/* Display the regular price, crossed out when there's a sale */}
            <div className="flex flex-col">

            <span
              className={`text-sm sm:text-3xl font-bold ${
                doc.Sale ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              Rs {doc.Price}
            </span>

            {/* Show the sale price only if available */}
            {doc.Sale && (
              <span className="text-sm sm:text-3xl font-bold text-red-600">
               Rs {doc.Sale}
              </span>
            )}
            </div>
            <button
              onClick={() => handleAddToCart(doc)}
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-1.5 sm:px-5 sm:py-2.5 text-center "
            >
              Add to cart
            </button>
          </div>
            </div>
          </div>
        ))}
      </div>
      )

      }

      {/* Cards for small screens */}
      <div className="sm:hidden flex-wrap xl:mx-32 py-6 px-2 flex-row flex gap-5 md:gap-10 justify-center mx-0 sm:mx-0 md:mx-10 lg:mx-10">
        {products.slice(0, 4).map((doc, index) => (
          <div
            key={doc.Id}
            className="flex flex-row xl:hidden bg-white border border-gray-200 rounded-lg shadow "
            style={{ width: "420px", height: "auto" }}
          >
            <a href="" className="flex-shrink-0">
              <img
                onClick={() => navigateTo(`/Description/${doc.Id}`)}
                className="w-40 h-40 object-cover rounded-l-lg"
                src={doc.FrontImage}
                alt="product"
                onLoad={(e) => (e.target.style.visibility = 'visible')}
    style={{
      
      visibility: "hidden", // Hide image until loaded
    }}
                
              />
            </a>
            <div className="flex flex-col justify-between p-4 w-full">
              <div>
                <h5
                  onClick={() => navigateTo(`/Description/${doc.Id}`)}
                  className="cursor-pointer text-sm sm:text-xl font-semibold tracking-tight text-gray-900 "
                >
                  {doc.Name}
                </h5>
              </div>
              <div className="flex items-center">
                <ReactStars
                  half={true}
                  edit={false}
                  value={doc.Rating}
                  count={5}
                  size={14 } 
                  color2={"#ffd700"}
                />
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded  ml-3">
                  {doc.Rating}
                </span>
              </div>
              <div className="flex items-center justify-between">
            {/* <span className="text-3xl font-bold text-gray-900 ">
              ₹{doc.Price}
            </span>
            <span className="text-3xl font-bold text-gray-900 ">
              ₹{doc.Sale}
            </span> */}
            {/* Display the regular price, crossed out when there's a sale */}
            <div className="flex flex-col">

            <span
              className={`text-sm sm:text-3xl font-bold ${
                doc.Sale ? "line-through text-gray-400" : "text-gray-900"
              }`}
            >
              Rs {doc.Price}
            </span>

            {/* Show the sale price only if available */}
            {doc.Sale && (
              <span className="text-sm sm:text-3xl font-bold text-red-600">
                Rs {doc.Sale}
              </span>
            )}
            </div>
            <button
              onClick={() => handleAddToCart(doc)}
              className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-1.5 py-2 text-center "
            >
              Add to cart
            </button>
          </div>
            </div>
          </div>
        ))}
      </div>

      <div className="py-4 flex justify-center mb-10">
        <div onClick={() => navigateTo("/product")}>
          <button className="px-14 py-4 text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-center ">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
}