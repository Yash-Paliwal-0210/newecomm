import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinusCircle, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import {
  getFirestore,
  doc,
  getDoc,
  deleteDoc,
  collection,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [productSizes, setProductSizes] = useState({});
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigateTo = useNavigate();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    setCartItems(cart);

    const fetchProductSizes = async () => {
      const sizes = {};
      for (let item of cart) {
        const productRef = doc(getFirestore(), "Products", item.Id);
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
          const productData = productSnap.data();
          if (productData.Size && Array.isArray(productData.Size)) {
            sizes[item.Id] = productData.Size;
          }
        } else {
          console.log(`No data found for product with ID: ${item.Id}`);
        }
      }
      setProductSizes(sizes);
      setLoading(false);
    };

    fetchProductSizes();
  }, []);

  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.Id === product.Id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.Id === product.Id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
    toast.success("Added to cart");
  };

  const handleRemoveFromCart = (productId) => {
    const updatedCartItems = cartItems.filter((item) => item.Id !== productId);
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
    toast.error("Removed from cart");
  };

  const handleChangeQuantity = (productId, quantity) => {
    const updatedCartItems = cartItems.map((item) =>
      item.Id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const handleSizeChange = (productId, size) => {
    const updatedCartItems = cartItems.map((item) =>
      item.Id === productId ? { ...item, size } : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
  };

  const calculateSubtotal = () => {
    // Calculate the total product price (ignoring discounts)
    return cartItems.reduce(
      (total, item) => total + Number(item.Sale || item.Price) * item.quantity,
      0
    );
  };

  const calculateDeliveryCharges = (subtotal) => {
    // Calculate 5% delivery charges based on subtotal
    return Math.ceil((subtotal * 0.03).toFixed(2)); // Delivery charge is 5% of the subtotal
  };

  const calculateTotalPrice = () => {
    const subtotal = calculateSubtotal();
    const deliveryCharges = calculateDeliveryCharges(subtotal);
    return Math.ceil(subtotal - discount + parseFloat(deliveryCharges)); // Apply discount and add delivery charges
  };

  const isCheckoutDisabled = () => {
    return cartItems.some((item) => !item.size);
  };

  const applyPromoCode = async () => {
    try {
      const db = getFirestore();
      const promoRef = collection(db, "PromoCodes");
      const promoSnapshot = await getDocs(promoRef);
      let promoFound = false;
  
      // Iterate through the promo codes in Firestore to check if the applied promo code is valid
      for (const docSnap of promoSnapshot.docs) {
        const promoData = docSnap.data();
        if (promoCode === promoData.code) {
          // Apply the discount
          setDiscount(promoData.price); // Apply the discount value to the state
          toast.success("Promo code applied successfully!");
  
          // Store promo code in localStorage
          localStorage.setItem("promoCode", promoCode);
  
          promoFound = true;
          break;
        }
      }
  
      if (!promoFound) {
        setDiscount(0); // If promo code is not found, reset the discount
        toast.error("Invalid promo code");
      }
    } catch (error) {
      console.error("Error applying promo code: ", error);
      toast.error("Failed to apply promo code");
    }
  };
  

  const handleCheckout = () => {
    if (isCheckoutDisabled()) {
      toast.error(
        "Please select a size for all products before proceeding to checkout."
      );
    } else {
      navigateTo("/checkout");
    }
  };

  return (
    <>
      <Navbar />
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4 py-16">
            <ToastContainer position="top-right" autoClose={3000} />
            <h2 className="text-3xl font-extrabold mb-8 text-center">
              Your Shopping Cart
            </h2>
            {!cartItems || cartItems.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg flex flex-col sm:flex-row"
                  >
                    <img
                      onClick={() => navigateTo(`/Description/${item.Id}`)}
                      src={item.FrontImage}
                      alt={item.Name}
                      className="w-full sm:w-24 sm:h-24 rounded object-cover"
                    />
                    <div className="p-4 flex flex-col justify-between w-full">
                      <div className="flex-grow">
                        <Link
                          to={`/Description/${item.Id}`}
                          className="text-xs md:text-sm font-medium text-gray-800 hover:text-blue-500"
                        >
                          {item.Name}
                        </Link>
                        <p className="text-gray-500">
                          ₹
                          {item.Sale
                            ? Number(item.Sale).toFixed(2)
                            : Number(item.Price).toFixed(2)}
                        </p>
                        {productSizes[item.Id] &&
                          productSizes[item.Id].length > 0 && (
                            <div className="mt-2">
                              <label className="block text-sm font-bold mb-1 text-gray-700">
                                Available Sizes:
                              </label>
                              <div className="grid grid-cols-3 gap-2 mt-2">
                                {productSizes[item.Id].map((size) => (
                                  <label
                                    key={size}
                                    className={`flex items-center bg-gray-300 text-gray-700 py-2 px-4 rounded-full font-bold cursor-pointer ${
                                      item.size === size
                                        ? "bg-sky-900 text-white"
                                        : ""
                                    }`}
                                  >
                                    <input
                                      type="radio"
                                      name={`size-${item.Id}`}
                                      value={size}
                                      checked={item.size === size}
                                      onChange={() =>
                                        handleSizeChange(item.Id, size)
                                      }
                                      className="hidden"
                                    />
                                    {size}
                                  </label>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                      <div className="flex items-center space-x-4 mt-4">
                        <button
                          onClick={() =>
                            handleChangeQuantity(item.Id, item.quantity - 1)
                          }
                          className="text-gray-500 hover:text-red-500 focus:outline-none"
                          disabled={item.quantity <= 1}
                        >
                          <FiMinusCircle size={20} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            handleChangeQuantity(item.Id, item.quantity + 1)
                          }
                          className="text-gray-500 hover:text-green-500 focus:outline-none"
                        >
                          <FiPlusCircle size={20} />
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.Id)}
                          className="text-red-600 hover:text-red-800 focus:outline-none"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cartItems && cartItems.length > 0 && (
              <div className="mt-8 flex flex-col items-center sm:flex-row sm:justify-between bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none"
                  >
                    Apply
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-0">
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-gray-700">
                      Subtotal: ₹{calculateSubtotal().toFixed(2)}
                    </p>
                    <p className="text-lg font-semibold text-gray-700">
                      Delivery Charges: ₹
                      {calculateDeliveryCharges(calculateSubtotal())}
                    </p>
                    <p className="text-lg font-bold text-black">
                      Total: ₹{calculateTotalPrice().toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className={`${
                      isCheckoutDisabled()
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-700"
                    } text-white px-4 py-2 rounded-md`}
                    disabled={isCheckoutDisabled()}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}

export const calculateTotalPrice = () => {
  const subtotal = calculateSubtotal();
  const deliveryCharges = calculateDeliveryCharges(subtotal);
  return Math.ceil(subtotal - discount + parseFloat(deliveryCharges)); // Apply discount and add delivery charges
};

export default Cart;
