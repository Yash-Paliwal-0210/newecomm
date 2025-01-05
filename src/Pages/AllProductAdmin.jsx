import React, { useState, useEffect } from "react";
import { FetchAllProduct } from "../Redux/Products/ProductReducer";
import { useDispatch, useSelector } from "react-redux";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../Firebase/Config";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const AllProductAdmin = () => {
  const [editingProduct, setEditingProduct] = useState(null); // State to hold product being edited
  const [updateFormData, setUpdateFormData] = useState({
    Name: "",
    Price: 0,
    Stock: 0,
    Category: "",
    Description: "",
    Image: "",
    Size: [], // Ensure this is initialized as an array
    Sale: false,
  });
  
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [loading, setLoading] = useState(true);
  
  const product = useSelector((state) => state.product.product);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  
  useEffect(() => {
    
    async function fetchData() {
      await fetch_product();
    }
      fetchData()
    
    setLoading(false)
  }, []);
  
  const fetch_product = async () => {
    dispatch(FetchAllProduct());
  };

  // console.log(fetch_product())


  useEffect(() => {
    if (editingProduct) {
      setUpdateFormData({
        ...editingProduct,
        Size: editingProduct.Size || [], // Make sure this is an array
      });
    }
  }, [editingProduct]);


  const delete_product = async (productId, imageUrl) => {
    try {
      // Delete the document
      const docRef = doc(db, "Products", productId);
      await deleteDoc(docRef);
      

      // Delete the image from Firebase Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
       
      }
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Error deleting product: " + error.message);
      console.error("Error deleting product:", error);
    }
    dispatch(fetch_product()); // Refresh product list after deletion
  };

  const startEditing = (product) => {
    setEditingProduct(product);
    setUpdateFormData({
      Id: product.Id,
      Name: product.Name,
      Price: product.Price,
      Sale: product.Sale,
      Stock: product.Stock,
      Size: product.Size,
      Category: product.Category,
      Description: product.Description,
      Image: product.FrontImage, // Reset image field
    });
    setShowForm(true); // Show the form when editing starts
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setUpdateFormData({
      Id: "",
      Name: "",
      Price: "",
      Sale: "",
      Stock: "",
      Size: [],
      Category: "",
      Description: "",
      Image: null, // Reset image field
    });
    setShowForm(false); // Hide the form when editing is cancelled
  };

  const handleSizeChange = (e) => {
    const size = e.target.value; // Get the size value
    const isChecked = e.target.checked; // Check if the checkbox is selected

    setUpdateFormData((prevState) => {
      let updatedSizes;

      if (isChecked) {
        // Add the size to the array if the checkbox is checked
        updatedSizes = [...prevState.Size, size];
      } else {
        // Remove the size from the array if the checkbox is unchecked
        updatedSizes = prevState.Size.filter((s) => s !== size);
      }

      // Return the updated state with the new Sizes array
      return { ...prevState, Size: updatedSizes };
    
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setUpdateFormData({
      ...updateFormData,
      Image: e.target.files[0], // Store the selected file
    });
  };

  const submitUpdate = async (e) => {
    e.preventDefault();
    const { Id, Name, Price, Sale, Stock, Size, Description, Category } =
      updateFormData;
    const docRef = doc(db, "Products", Id);

    try {
      // Handle image upload if a new image is selected
      let imageUrl = null;
      if (Image) {
        // Upload new image
        const imageRef = ref(storage, `images/products/${Id}/${Image.name}`);
        await uploadBytes(imageRef, Image);
        imageUrl = await getDownloadURL(imageRef);

        // Delete old image
        const oldProduct = product.find((prod) => prod.Id === Id);
        if (oldProduct && oldProduct.Image) {
          const oldImageRef = ref(storage, oldProduct.Image);
          await deleteObject(oldImageRef);
        }
      }

      // Update product in Firestore
      await updateDoc(docRef, {
        Name: Name,
        Price: Price,
        Sale: Sale,
        Stock: Stock,
        Size: Size,
        Category: Category,
        Description: Description,
        Image: imageUrl || updateFormData.Image, // Use new image URL if available, otherwise retain old image URL
      });
      toast.success("Product updated successfully");
      cancelEditing();
      fetch_product(); // Refresh product list after update
    } catch (error) {
      toast.error("Error updating product: " + error.message);
      console.error("Error updating product:", error);
    }
  };

  const categories = [
    "all",
    "Ethnic",
    "Kurti",
    "Ambrella",
    "Nayra",
    // "Pant",
    // "Dupatta",
  ]; // List of categories

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>

      <Navbar />
      {
        loading ? (
          <div className="flex items-center justify-center h-screen">
          <div className="loader"></div>
        </div>
        ) : 
        (
      <div className="flex flex-col md:flex-row">
        <div className="p-4 md:hidden">
          <button
            className="text-white bg-green-600 px-4 py-2 rounded"
            onClick={toggleMenu}
          >
            {menuOpen ? "Close Menu" : "Open Menu"}
          </button>
        </div>

        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:block w-full md:w-64 bg-slate-50 border-3 p-4 transition-transform duration-300 ease-in-out`}
        >
          <div onClick={() => navigateTo("/admin/dashboard")}>
            <NavItem
              icon="fa-qrcode"
              text="Dashboard"
              link="/admin/dashboard"
            />
          </div>
          <NavItem
            icon="fa-cart-shopping"
            text="Products"
            link=""
            subLinks={[
              { text: "All", link: "/admin/product" },
              { text: "New", link: "/admin/product/new" },
              { text: "Banner", link: "/admin/banner" },
            ]}
          />
          <div onClick={() => navigateTo("/admin/orders")}>
            <NavItem
              icon="fa-cart-shopping"
              text="Orders"
              link="/admin/orders"
            />
          </div>
          <div onClick={() => navigateTo("/admin/users")}>
            <NavItem icon="fa-users" text="Users" link="/admin/users" />
          </div>
        </div>

        <div className="items-center w-full">
          <div className="flex flex-col justify-center items-center mt-4">
            <h2 className="text-center text-2xl font-bold mb-4">
              Product Table
            </h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">
                      ID
                    </th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">
                      Name
                    </th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">
                      Price
                    </th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">
                      Stock
                    </th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">
                      Category
                    </th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">
                      Update
                    </th>
                    <th className="p-2 sm:p-3 text-left text-xs sm:text-sm">
                      Delete
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {product.map((prod) => (
                    <tr key={prod.Id} className="border-b border-gray-300">
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        {prod.Id}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        {prod.Name.substring(0, 30)}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        {prod.Price}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        {prod.Stock}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        {prod.Category}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        <button
                          onClick={() => startEditing(prod)}
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm"
                        >
                          Update
                        </button>
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">
                        <button
                          onClick={() => delete_product(prod.Id, prod.Image)}
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 sm:py-2 px-2 sm:px-4 rounded text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Update Form */}
            {/* {editingProduct && showForm && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                  <h3 className="text-lg font-bold mb-4">Edit Product</h3>
                  <form onSubmit={submitUpdate}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Name:</label>
                      <input
                        type="text"
                        name="Name"
                        value={updateFormData.Name}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Price:</label>
                      <input
                        type="number"
                        name="Price"
                        value={updateFormData.Price}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Stock:</label>
                      <input
                        type="number"
                        name="Stock"
                        value={updateFormData.Stock}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Category:</label>
                      <select
                        name="Category"
                        value={updateFormData.Category}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Description:</label>
                      <input
                        type="text"
                        name="Description"
                        value={updateFormData.Description}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">Image:</label>
                      <input
                        type="file"
                        name="Image"
                        
                        onChange={handleImageChange}
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Save Update
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )} */}
            {editingProduct && showForm && (
              <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md h-auto max-h-[90vh] overflow-auto">
                  <h3 className="text-lg font-bold mb-4">Edit Product</h3>
                  <form onSubmit={submitUpdate}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Name:
                      </label>
                      <input
                        type="text"
                        name="Name"
                        value={updateFormData.Name}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Price:
                      </label>
                      <input
                        type="number"
                        name="Price"
                        value={updateFormData.Price}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Sale:
                      </label>
                      <input
                        type="number"
                        name="Sale"
                        value={updateFormData.Sale || ""} 
                        onChange={handleUpdateChange}
                        
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Stock:
                      </label>
                      <input
                        type="number"
                        name="Stock"
                        value={updateFormData.Stock}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Category:
                      </label>
                      <select
                        name="Category"
                        value={updateFormData.Category}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Description:
                      </label>
                      <input
                        type="text"
                        name="Description"
                        value={updateFormData.Description}
                        onChange={handleUpdateChange}
                        required
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Image:
                      </label>
                      <input
                        type="file"
                        name="Image"
                        onChange={handleImageChange}
                        className="block w-full border-gray-300 rounded-md p-2 mt-1"
                      />
                    </div>

                    {/* Available Sizes Field */}
                    <div className="flex flex-col mb-4">
                      <label className="text-sm font-medium text-gray-700">
                        Available Sizes:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          "26",
                          "28",
                          "30",
                          "32",
                          "34",
                          "38",
                          "40",
                          "42",
                          "44",
                          "46",
                          "47",
                          "48",
                          "50",
                        ].map((size) => (
                          <label
                            key={size}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              value={size}
                              checked={updateFormData.Size.includes(size)} // Checks if the size is selected
                              onChange={handleSizeChange} // Handle the change when checkbox is clicked
                              className="form-checkbox text-blue-500 focus:ring-blue-500"
                            />

                            <span>{size}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    

                    <div className="flex justify-end mt-4">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                      >
                        Save Update
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <ToastContainer />
          </div>
        </div>
      </div>

        )
      }
    </>
  );
};

const NavItem = ({ icon, text, link, subLinks = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSubMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="mb-4">
      <div
        className="flex gap-4 items-center px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer"
        onClick={toggleSubMenu}
      >
        <div className="w-[20px]">
          <i className={`fa-solid ${icon}`}></i>
        </div>
        <div className="font-semibold">{text}</div>
        {subLinks.length > 0 && (
          <i
            className={`fa-solid fa-chevron-down ml-auto transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          ></i>
        )}
      </div>
      {isOpen && subLinks.length > 0 && (
        <div className="ml-8 mt-2 space-y-1">
          {subLinks.map((subLink, index) => (
            <div key={index}>
              <Link
                to={subLink.link}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-300 rounded"
              >
                {subLink.text}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllProductAdmin;
