import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchOrderDetails } from "../Firebase/utils/fetchOrderDetails";
import { db } from "../Firebase/Config";
import { doc, getDoc } from "firebase/firestore";

const OrderDetails = () => {
  const { orderId } = useParams(); // Get the order ID from the URL
  const [order, setOrder] = useState(null);
  const [products, setProducts] = useState({}); // To store fetched products

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const orderDetails = await fetchOrderDetails(orderId);
        setOrder(orderDetails);
  
        // Fetch product details
        const fetchedProducts = {};
        for (const item of orderDetails.productIdQuantityArray) {
          if (item.Id) {  // Check if Id is defined
            const productRef = doc(db, "Products", item.Id);
            const productDoc = await getDoc(productRef);
            if (productDoc.exists()) {
              fetchedProducts[item.Id] = productDoc.data();
            }
          } else {
            console.warn("Skipping undefined productId");
          }
        }
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      }
    };
  
    getOrderDetails();
  }, [orderId]);
  

  if (!order) return <div>Loading...</div>;

  const { productIdQuantityArray } = order; // Array with productId, quantity, and size

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Order Details - {orderId}</h1>
      <table className="w-full mt-4 text-sm text-gray-500">
        <thead className="text-gray-700 uppercase bg-gray-50">
          <tr>
            <th className="px-4 py-2">Product ID</th>
            <th className="px-4 py-2">Product Name</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Size</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {productIdQuantityArray.map((item, index) => (
            item.Id && products[item.Id] ? (  // Ensure both Id and product are defined
              <tr key={index} className="border-b border-gray-300">
                <td className="px-4 py-2">{item.Id}</td>
                <td className="px-4 py-2">
                  {products[item.Id]?.Name || "Product not found"}
                </td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">{item.size}</td>
              </tr>
            ) : (
              <tr key={index} className="border-b border-gray-300">
                <td className="px-4 py-2" colSpan="4">Fetching data Please wait.......</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
      <div>
        {/* Address - {item.address} */}
      </div>
    </div>
  );
  
};

export default OrderDetails;
