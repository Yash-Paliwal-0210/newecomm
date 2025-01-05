import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import { useParams } from 'react-router-dom';
import { collection, doc, getDoc, getDocs, query, where, updateDoc, deleteDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../Firebase/Config';
import { useSelector } from 'react-redux';

const MyOrders = () => {
  const { id } = useParams(); // This will be the userId
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = useSelector(state => state.user.userId);


  useEffect(() => {
    if (id) { // Use id from URL (userId in this case)
      const fetchOrdersData = async () => {
        try {
          const fetchedOrders = await fetchOrders(id);
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrdersData();
    } else {
      console.error("User ID is undefined");
      setLoading(false);
    }
  }, [id]);

  const fetchOrders = async (userId) => {
    // console.log(`Fetching orders for userId: ${userId}`);
  
    try {
      // Fetch the user's document
      const userDocRef = doc(db, 'Users', userId);
      const userDoc = await getDoc(userDocRef);
  
      if (!userDoc.exists()) {
        // console.log("User not found!");
        return [];
      }
  
      const userData = userDoc.data();
      const ordersArray = userData.OrdersArray || [];
  
      if (ordersArray.length === 0) {
        // console.log("No orders found for this user!");
        return [];
      }
  
      // Split the ordersArray into chunks of 30 or fewer
      const chunkSize = 30;
      const orderChunks = [];
      for (let i = 0; i < ordersArray.length; i += chunkSize) {
        orderChunks.push(ordersArray.slice(i, i + chunkSize));
      }
  
      let allOrders = [];
  
      // Fetch orders in chunks
      for (const chunk of orderChunks) {
        const ordersRef = collection(db, 'Orders');
        const ordersQuery = query(ordersRef, where('__name__', 'in', chunk));
        const ordersSnapshot = await getDocs(ordersQuery);
  
        if (ordersSnapshot.empty) {
          // console.log("No orders found in this chunk!");
          continue;
        }
  
        // Process each order
        const ordersWithProductDetails = await Promise.all(ordersSnapshot.docs
          .map(async (orderDoc) => {
            const orderData = orderDoc.data();
            const productIdQuantityArray = orderData.productIdQuantityArray || [];
  
            // Fetch product details
            const productsPromises = productIdQuantityArray.map(item => getDoc(doc(db, "Products", item.Id)));
            const productDocs = await Promise.all(productsPromises);
  
            const products = productDocs
              .filter(doc => doc.exists())
              .map(doc => {
                const productData = doc.data();
                const quantity = productIdQuantityArray.find(item => item.Id === doc.id)?.quantity || 0;
                return { id: doc.id, ...productData, quantity };
              });
  
            return {
              id: orderDoc.id,
              ...orderData,
              products
            };
          })
        );
  
        allOrders = [...allOrders, ...ordersWithProductDetails];
      }
  
      return allOrders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  };
  

  const handleCancelProduct = async (orderId, productId) => {
    try {
      // Fetch the order
      const orderRef = doc(db, 'Orders', orderId);
      const orderDoc = await getDoc(orderRef);

      if (!orderDoc.exists()) {
        console.error("Order not found!");
        return;
      }

      const orderData = orderDoc.data();
      const productIdQuantityArray = orderData.productIdQuantityArray || [];

      // Filter out the product to be canceled
      const updatedProductArray = productIdQuantityArray.filter(item => item.Id !== productId);

      // Update the order with the new product array
      await updateDoc(orderRef, {
        productIdQuantityArray: updatedProductArray
      });

      // If the order has no products left, delete the order
      if (updatedProductArray.length === 0) {
        await deleteDoc(orderRef);

        // Remove the order from the Users' OrdersArray
        const userRef = doc(db, 'Users', id);
        await updateDoc(userRef, {
          OrdersArray: arrayRemove(orderId)
        });
      }

      // Refresh the orders list
      const updatedOrders = await fetchOrders(id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error cancelling product:", error);
    }
  };



  return (
    <>
      <Navbar />
    { loading ? (
      <div className="flex items-center justify-center h-screen">
      <div className="loader"></div>
    </div>
    ) : (

      <div className='p-10 overflow-x-auto'>
        <div className='text-3xl font-bold text-center mt-10'>My Orders</div>
        <div className="w-full  sm:rounded-lg mt-4">
          <table className="w-full overflow-x-auto text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                {/* <th scope="col" className="px-6 py-3">Order Id</th> */}
                <th scope="col" className="px-6 py-3">Product Name</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">Quantity</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.flatMap((order) => {
                  return order.products.map((product) => (
                    <tr key={`${order.id}-${product.id}`}>
                      {/* <td className="px-6 py-4">{order.id}</td> */}
                      <td className="px-6 py-4">{product.Name}</td>
                      <td className="px-6 py-4">₹{product.Price}</td>
                      <td className="px-6 py-4">{product.quantity}</td>
                      <td className="px-6 py-4">{order.deliver_status}</td>
                      <td className="px-6 py-4">
                        {order.deliver_status !== 'delivered' && order.deliver_status !== 'shipped' && order.paymentStatus !== 'paid' && (
                          <button 
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleCancelProduct(order.id, product.id)}
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ));
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    )

    }
    </>
  );
};

export default MyOrders;
