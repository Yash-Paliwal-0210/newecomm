// src/Firebase/utils/fetchOrderDetails.js

import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../Config"; // Import your Firebase configuration

export const fetchOrderDetails = async (orderId) => {
    if (!orderId) {
      throw new Error("Order ID is not provided");
    }
  
    const orderRef = doc(db, "Orders", orderId);
    const orderDoc = await getDoc(orderRef);
  
    if (!orderDoc.exists()) {
      throw new Error("Order not found");
    }
  
    const orderData = orderDoc.data();
    const productIds = orderData.productIdQuantityArray.map(item => item.productId);
  
    if (!productIds.length) {
      throw new Error("No product IDs found in order data");
    }
  
    // Fetch product details individually
    const productsMap = {};
    for (const productId of productIds) {
      if (!productId) {
        console.warn("Skipping undefined productId");
        continue;
      }
  
      const productRef = doc(db, "Products", productId);
      const productDoc = await getDoc(productRef);
  
      if (productDoc.exists()) {
        productsMap[productId] = productDoc.data().Name;
      } else {
        console.warn(`Product not found: ${productId}`);
      }
    }
  
    // Add product names to order data
    const updatedProductIdQuantityArray = orderData.productIdQuantityArray.map(item => ({
      ...item,
      productName: productsMap[item.productId] || "Unknown"
    }));
  
    return { ...orderData, productIdQuantityArray: updatedProductIdQuantityArray };
  };
  
  
