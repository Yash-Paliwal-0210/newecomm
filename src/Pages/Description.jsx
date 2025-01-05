// import { doc, getDoc } from 'firebase/firestore';
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { db } from '../Firebase/Config';
// import { toast } from 'react-toastify';
// import Navbar from '../Components/Navbar';

// const Description = () => {
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [currentImage, setCurrentImage] = useState('');
//   const { id } = useParams();

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const productDoc = await getDoc(doc(db, 'Products', id));
//       if (productDoc.exists()) {
//         setProduct(productDoc.data());
//       } else {
//         console.error('Product not found');
//       }
//     } catch (error) {
//       console.error('Error fetching product:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddToCart = (product) => {
//     if (!selectedSize) {
//       toast.error('Please select a size before adding to the cart.', {
//         position: 'top-right',
//         autoClose: 3000,
//       });
//       return;
//     }

//     const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
//     const existingItem = cartItems.find((item) => item.Id === id && item.size === selectedSize);

//     if (existingItem) {
//       existingItem.quantity += 1;
//     } else {
//       cartItems.push({ ...product, Id: id, quantity: 1, size: selectedSize });
//     }

//     localStorage.setItem('cartItems', JSON.stringify(cartItems));
//     toast.success(`${product.Name} added to cart successfully.`, {
//       position: 'top-right',
//       autoClose: 3000,
//     });
//   };

//   const openModal = (image) => {
//     setCurrentImage(image);
//     setIsModalOpen(true);
//   };

//   const closeModal = () => {
//     setIsModalOpen(false);
//     setCurrentImage('');
//   };

//   return (
//     <>
//       {loading ? (
//         <div className="flex items-center justify-center h-screen">
//         <div className="loader"></div>
//       </div>
//       ) : (
//         <div>
//           <Navbar />
//           <div className="bg-white dark:bg-gray-800 py-8">
//             <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//               <div className="flex flex-col md:flex-row -mx-4">
//                 {/* Product Image */}
//                 <div className="md:flex-1 px-4">
//                   <div className="h-[460px] rounded-lg bg-gray-100 dark:bg-gray-700 mb-4">
//                     <img
//                       className="w-full h-full object-cover"
//                       src={product?.FrontImage}
//                       alt="Product"
//                     />
//                   </div>
//                   <div className="flex -mx-2 mb-4">
//                     <div className="w-1/2 px-2">
//                       <button
//                         onClick={() => handleAddToCart(product)}
//                         className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700"
//                       >
//                         Add to Cart
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Product Details */}
//                 <div className="md:flex-1 px-4">
//                   <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
//                     {product?.Name}
//                   </h2>
//                   <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{product?.Description}</p>

//                   <div className="flex mb-4 flex-col">
//                     <div className="mr-4">
//                       <span className="font-bold text-gray-700 dark:text-gray-300">Price:</span>
//                       <span className="text-gray-600 dark:text-gray-300 ml-1">{product?.Price}</span>
//                     </div>
//                     <div>
//                       <span className="font-bold text-gray-700 dark:text-gray-300">Availability:</span>
//                       <span className="text-gray-600 dark:text-gray-300 ml-1">{product?.Stock}</span>
//                     </div>
//                     <div>
//                       <span className="font-bold text-gray-700 dark:text-gray-300">Description:</span>
//                       <span className="text-gray-600 dark:text-gray-300 ml-1">{product?.Description}</span>
//                     </div>
//                   </div>

//                   {/* Size Selection */}
//                   <div className="mb-4">
//                     <span className="font-bold text-gray-700 dark:text-gray-300">Select Size:</span>
//                     <div className="grid grid-cols-3 gap-2 mt-2">
//                       {product?.Size &&
//                         product.Size.map((size) => (
//                           <button
//                             key={size}
//                             className={`py-2 px-4 rounded-full font-bold ${
//                               selectedSize === size
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-gray-300 text-gray-700'
//                             }`}
//                             onClick={() => setSelectedSize(size)}
//                           >
//                             {size}
//                           </button>
//                         ))}
//                     </div>
//                   </div>
//               {/* Additional Images Section */}
// <div className="mt-8">
//   <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-4">
//     {product?.OtherImages &&
//       product.OtherImages.map((image, index) => (
//         <div
//           key={index}
//           className="w-20 h-20 rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-700 transition-transform transform hover:scale-105 cursor-pointer"
//           onClick={() => openModal(image)}
//         >
//           <img
//             src={image}
//             alt={`Product Image ${index + 1}`}
//             className="w-full h-full object-cover"
//           />
//         </div>
//       ))}
//   </div>
// </div>


//                 </div>
//               </div>


//               {/* Modal for Enlarged Image */}
//               {isModalOpen && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
//                   <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl w-full">
//                     <button
//                       className="absolute top-2 right-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white focus:outline-none"
//                       onClick={closeModal}
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         className="h-6 w-6"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                     <img src={currentImage} alt="Enlarged Product" className="w-full h-[400px] object-contain p-4" />
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Description;
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../Firebase/Config';
import { toast } from 'react-toastify';
import Navbar from '../Components/Navbar';

const Description = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const [mainImage, setMainImage] = useState(''); // Main image state
  const { id } = useParams();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Automatically set the main image after 20 seconds
    const timer = setTimeout(() => {
      if (product && product.FrontImage) {
        setMainImage(product.FrontImage);
      }
    }, 20000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, [product]);

  const fetchData = async () => {
    try {
      const productDoc = await getDoc(doc(db, 'Products', id));
      if (productDoc.exists()) {
        const productData = productDoc.data();
        setProduct(productData);
        setMainImage(productData.FrontImage); // Set the default main image
      } else {
        console.error('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (!selectedSize) {
      toast.error('Please select a size before adding to the cart.', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find((item) => item.Id === id && item.size === selectedSize);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({ ...product, Id: id, quantity: 1, size: selectedSize });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    toast.success(`${product.Name} added to cart successfully.`, {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const openModal = (image) => {
    setCurrentImage(image);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentImage('');
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          <Navbar />
          <div className="bg-white  py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row -mx-4">
                {/* Product Image */}
                <div className="md:flex-1 px-4">
                  <div className="h-[460px] rounded-lg bg-gray-100  mb-4">
                    <img
                      className="w-full h-full object-contain"
                      src={mainImage || product?.FrontImage} // Default to FrontImage
                      alt="Product"
                      onLoad={(e) => (e.target.style.visibility = 'visible')}
    style={{
      
      visibility: "hidden", // Hide image until loaded
    }}
                    />
                  </div>
                  <div className="flex -mx-2 mb-4">
                    <div className="w-1/2 px-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gray-900  text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 "
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>

                {/* Product Details */}
                <div className="md:flex-1 px-4">
                  <h2 className="text-2xl font-bold text-gray-800  mb-2">
                    {product?.Name}
                  </h2>
                  <p className="text-gray-600  text-sm mb-4">{product?.Description}</p>

                  <div className="flex mb-4 flex-col">
                    <div className="mr-4">
                      <span className="font-bold text-gray-700 ">Price:</span>
                      <span className="text-gray-600  ml-1">{product?.Price}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700 ">Availability:</span>
                      <span className="text-gray-600  ml-1">{product?.Stock}</span>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-4">
                    <span className="font-bold text-gray-700 ">Select Size:</span>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {product?.Size &&
                        product.Size.map((size) => (
                          <button
                            key={size}
                            className={`py-2 px-4 rounded-full font-bold ${
                              selectedSize === size
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-300 text-gray-700'
                            }`}
                            onClick={() => setSelectedSize(size)}
                          >
                            {size}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Additional Images Section */}
                  <div className="mt-8">
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {product?.OtherImages &&
                        product.OtherImages.map((image, index) => (
                          <div
                            key={index}
                            className="w-20 h-20 rounded-lg overflow-hidden shadow-lg bg-gray-100  transition-transform transform hover:scale-105 cursor-pointer"
                            onClick={() => setMainImage(image)} // Update mainImage when clicked
                          >
                            <img
                              src={image}
                              alt={`Product Image ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal for Enlarged Image */}
              {isModalOpen && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                  onClick={closeModal} // Close modal when clicking outside
                >
                  <div
                    className="relative bg-white  rounded-lg shadow-lg max-w-3xl w-full"
                    onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
                  >
                    <button
                      className="absolute top-2 right-2 text-gray-500  hover:text-gray-700 dark:hover:text-white focus:outline-none"
                      onClick={closeModal}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <img src={currentImage} alt="Enlarged Product" className="w-full h-[400px] object-contain p-4" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Description;



