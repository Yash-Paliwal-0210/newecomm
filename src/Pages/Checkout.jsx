import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { db, auth } from '../Firebase/Config'; // Import auth to get current user
import { addDoc, collection, Timestamp, updateDoc, doc, arrayUnion, deleteDoc, getDocs } from "firebase/firestore";
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zip, setZip] = useState('');
    const [cart, setCart] = useState([]);

    const navigateTo = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cartItems"));
        if (storedCart) {
            setCart(storedCart);
        }
    }, []);

    const handlePlaceOrder = async () => {
        if (!firstName || !lastName || !address || !city || !state || !zip) {
            toast.error('Please fill out all fields.');
            return;
        }
    
        // Calculate the total price, considering any applied promo code
        let price = cart.reduce((total, item) => total + (Number(item.Sale || item.Price) * item.quantity), 0);
    
        // Fetch the promo code from localStorage
        const promoCode = localStorage.getItem('promoCode'); // Assuming promoCode is stored in localStorage
        if (promoCode) {
            // Fetch promo code details from Firestore
            try {
              const promoRef = collection(db, 'PromoCodes');
              const promoSnapshot = await getDocs(promoRef);
              let promoFound = false;
          
              // Iterate through the promo codes in Firestore to find the matching one
              for (const docSnap of promoSnapshot.docs) {
                const promoData = docSnap.data();
                if (promoCode === promoData.code) {
                  // Apply discount, for example, 10% off
                  price = price - promoData.price + Math.ceil(price * 0.03);
                  promoFound = true;
          
                  // Decrease maxUsers by 1
                  const newMaxUsers = promoData.maxUsers - 1;
                  const newUsedCount = promoData.usedCount - 1;
          
                  // Check if maxUsers is 0, delete the promo code if so
                  if (newMaxUsers <= 0) {
                    await deleteDoc(doc(db, 'PromoCodes', docSnap.id)); // Remove promo code from Firestore
                    // console.log(`Promo code ${promoCode} is deleted due to max usage reached.`);
                  } else {
                    // Update the maxUsers field with the new count
                    await updateDoc(doc(db, 'PromoCodes', docSnap.id), {
                      maxUsers: newMaxUsers,
                      usedCount : newUsedCount,
                    });
                    // console.log(`Promo code ${promoCode} updated. Remaining uses: ${newMaxUsers}`);
                  }
          
                  // Remove the applied promo code from localStorage
                  localStorage.removeItem('promoCode');
                  break;
                }
              }
          
              if (!promoFound) {
                toast.error("Promo code not found or expired.");
              }
            } catch (error) {
              console.error("Error applying promo code: ", error);
              toast.error("Failed to apply promo code");
            }
          }
          
    
        // Ensure price is a positive value
        price = Math.max(price, 0);
    
        const productIdQuantityArray = cart.map(item => ({ Id: item.Id, quantity: item.quantity, size: item.size }));
        const userId = auth.currentUser ? auth.currentUser.uid : null;
    
        // Prepare order data
        const orderData = {
            firstName,
            lastName,
            address,
            city,
            state,
            zip,
            price, // Store the accurate price in Firestore
            productIdQuantityArray,
            userId,
            paymentStatus: 'not paid', // Default payment status
            deliver_status: 'pending', // Default delivery status
            createdAt: Timestamp.fromDate(new Date())
        };
    
        try {
            // Save the order to Firestore
            const docRef = await addDoc(collection(db, 'Orders'), orderData);
            // console.log(docRef.id);
    
            // If user is logged in, associate the order with the user
            if (userId) {
                const userDocRef = doc(db, 'Users', userId);
                await updateDoc(userDocRef, {
                    OrdersArray: arrayUnion(docRef.id)
                });
            }
    
            // Clear localStorage after placing the order
            localStorage.removeItem('cartItems');
            setCart([]);
    
            // Reset form fields
            setFirstName('');
            setLastName('');
            setAddress('');
            setCity('');
            setState('');
            setZip('');
    
            // Show success message
            console.log("order places")
            alert("Order Placed Successfully")
            toast.success(`Order Placed Successfully`, {
                  position: "top-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
            navigateTo(`/payment?q=${docRef.id}`);
        } catch (error) {
            // console.log(error);
            toast.error('Error placing order. Please try again.');
        }
    
    };
    

    return (
        <div>
            <ToastContainer />
            <div className="bg-gray-100 ">
                <div className="w-full max-w-3xl mx-auto p-8 h-[100vh]">
                    <div className="bg-white  p-8 rounded-lg shadow-md border ">
                        <h1 className="text-2xl font-bold text-gray-800  mb-4 text-center">Checkout</h1>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold text-gray-700  mb-2">Shipping Address</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="first_name" className="block text-gray-700  mb-1">First Name</label>
                                    <input
                                        type="text"
                                        id="first_name"
                                        className="w-full rounded-lg border py-2 px-3  "
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="last_name" className="block text-gray-700  mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        id="last_name"
                                        className="w-full rounded-lg border py-2 px-3  "
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label htmlFor="address" className="block text-gray-700  mb-1">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    className="w-full rounded-lg border py-2 px-3"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </div>

                            <div className="mt-4">
                                <label htmlFor="city" className="block text-gray-700  mb-1">City</label>
                                <input
                                    type="text"
                                    id="city"
                                    className="w-full rounded-lg border py-2 px-3 "
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div>
                                    <label htmlFor="state" className="block text-gray-700  mb-1">State</label>
                                    <input
                                        type="text"
                                        id="state"
                                        className="w-full rounded-lg border py-2 px-3 "
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="zip" className="block text-gray-700  mb-1">ZIP Code</label>
                                    <input
                                        type="text"
                                        id="zip"
                                        className="w-full rounded-lg border py-2 px-3 "
                                        value={zip}
                                        onChange={(e) => setZip(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button onClick={handlePlaceOrder} className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-700 ">Place Order</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
