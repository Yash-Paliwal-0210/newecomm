import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { db } from "../Firebase/Config";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const Payment = () => {
  const key_id = import.meta.env.VITE_RZP_KEY_ID;
  const [SearchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const navigateTo = useNavigate();

  const userId = useSelector((state) => state.user.userId);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    const docSnap = await getDoc(doc(db, "Orders", SearchParams.get("q")));
    setOrder(docSnap.data());
  };

  function loadScript(src) {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }

  async function displayRazorpay() {
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const result = {
      amount: parseFloat(order.price) * 100,
      order_id: SearchParams.get("q"),
      currency: "INR",
    };

    const { amount, id: order_id, currency } = result;

    const options = {
      key: key_id,
      amount: amount.toString(),
      currency: currency,
      name: `${order.firstName} ${order.lastName}`,
      description: "Test Transaction",
      order_id: order_id,
      handler: async function (response) {
        const data = {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id || " ",
          razorpaySignature: response.razorpay_signature || " ",
        };
        await updateDoc(doc(db, "Orders", SearchParams.get("q")), {
          paymentDetails: data,
          paymentStatus: "paid",
          deliver_status: "pending",
        });

        const userDoc = await getDoc(doc(db, "Users", userId));
        if (userDoc.exists()) {
          const currentOrders = userDoc.data().orders || [];
          currentOrders.push(SearchParams.get("q"));
          await updateDoc(doc(db, "Users", userId), { orders: currentOrders });
        }

        order.productIdQuantityArray.forEach(async (product) => {
          const { Id, quantity } = product;
          const productDocRef = doc(db, "Products", Id);
          const productDoc = await getDoc(productDocRef);
          if (productDoc.exists()) {
            const productData = productDoc.data();
            const currentStock = parseInt(productData.Stock) || 0;
            const newStock = currentStock - quantity;
            await updateDoc(productDocRef, { Stock: newStock });
          }
        });

        localStorage.clear();
        // Show success toast
        toast.success("Thank you for your payment! Your order will be delivered soon.");
        navigateTo("/")

      },
      prefill: {
        name: `${order.firstName} ${order.lastName}`,

      },
      notes: {
        address: order.address,
      },
      theme: {
        color: "#61dafb",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <header className="text-center">
          <h1 className="text-2xl font-bold mb-4">Complete Your Payment</h1>
          <p className="text-gray-700 mb-6">You are about to pay ₹{order && order.price}</p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300"
            onClick={displayRazorpay}
          >
            Pay Now
          </button>
        </header>
      </div>
      <ToastContainer position="top-center" autoClose={5000} />
    </div>
  );
};

export default Payment;



