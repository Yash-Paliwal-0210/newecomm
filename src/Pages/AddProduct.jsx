import React, { useState, useEffect } from "react";
import { db } from "../Firebase/Config";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../Components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "../Firebase/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AddProductForm() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [user, setUser] = useState(null);
  const [saleprice, setSalePrice] = useState(null);
  const [frontImage, setFrontImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); // To hold image previews
  const navigateTo = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSizeChange = (e) => {
    const { value, checked } = e.target;
    setSizes((prev) =>
      checked ? [...prev, value] : prev.filter((size) => size !== value)
    );
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const uploadImage = async (event, isFrontImage = false) => {
    event.preventDefault();
    const imageToUpload = isFrontImage ? frontImage : event.target.files[0];
    if (imageToUpload == null) return;

    const imageRef = ref(
      storage,
      `images/products/${imageToUpload.name + uuidv4()}`
    );
    try {
      await uploadBytes(imageRef, imageToUpload);
      const downloadURL = await getDownloadURL(imageRef);

      if (isFrontImage) {
        setFrontImage(downloadURL);
        toast.success("Front Image Uploaded Successfully");
      } else {
        // Store URL of uploaded images
        setOtherImages((prev) => [...prev, downloadURL]);
        // Store previews of uploaded images
        setImagePreviews((prev) => [
          ...prev,
          URL.createObjectURL(imageToUpload), // Local preview URL
        ]);
        toast.success("Other Image Uploaded Successfully");
      }
    } catch (error) {
      toast.error("Image upload failed. Please try again.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form validation (optional)
    if (!name || !price || !description || !frontImage ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!user) {
      toast.error("User is not authenticated");
      return;
    }

    const generatedProductId = uuidv4();

    const docData = {
      Name: name,
      Price: price,
      Sale: saleprice,
      Description: description,
      CreatedAt: new Date(user.metadata.creationTime).toLocaleString(),
      Rating: 4.1,
      Reviews: [],
      Category: category,
      Stock: stock,
      Size: sizes,
      Id: generatedProductId.slice(0, 16),
      FrontImage: frontImage,
      OtherImages: otherImages,
    };

    try {
      await setDoc(
        doc(db, "Products", generatedProductId.slice(0, 16)),
        docData
      );
      toast.success("Product added successfully!");
      // Reset the form fields after successful submission
      setName("");
      setPrice(0);
      setSalePrice(0);
      setDescription("");
      setCategory("");
      setStock(0);
      setSizes([])
      setFrontImage(null);
      setOtherImages([]);
      setImagePreviews([]);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex md:flex-row flex-col">
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
        <div className="w-full">
          <div className="flex items-center justify-center min-h-screen">
            {/* <ToastContainer position="top-right" autoClose={5000} /> */}
            <form
              onSubmit={handleSubmit}
              className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg space-y-6"
            >
              <h2 className="text-2xl font-bold text-center">
                Add New Product
              </h2>

              {/* Name Field */}
              <div className="flex flex-col">
                <label htmlFor="name" className="text-sm font-medium">
                  Name:
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Field */}
              <div className="flex flex-col">
                <label htmlFor="price" className="text-sm font-medium">
                  Price:
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description Field */}
              <div className="flex flex-col">
                <label htmlFor="description" className="text-sm font-medium">
                  Description:
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category Field */}
              <div className="flex flex-col">
                <label htmlFor="category" className="text-sm font-medium">
                  Category:
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a Category
                  </option>
                  <option value="Ethinic">Ethinic Set</option>
                  <option value="Tops">Tops</option>
                  <option value="Kurti">Kurti Set</option>
                  <option value="Ambrella">Ambrella Set</option>
                  <option value="Nayra">Nayra Set</option>
                  {/* <option value="Pant">Pant</option>
                  <option value="Dupatta">Dupatta</option> */}
                </select>
              </div>

              {/* Stock Field */}
              <div className="flex flex-col">
                <label htmlFor="stock" className="text-sm font-medium">
                  Stock:
                </label>
                <input
                  type="number"
                  id="stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Sale Price Field (Optional) */}
              <div className="flex flex-col">
                <label htmlFor="saleprice" className="text-sm font-medium">
                  Sale Price:
                </label>
                <input
                  type="number"
                  id="saleprice"
                  value={saleprice || ""}
                  onChange={(e) => setSalePrice(e.target.value)}
                  className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium">Available Sizes:</label>
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
                    <label key={size} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={size}
                        checked={sizes.includes(size)}
                        onChange={(e) => handleSizeChange(e)}
                        className="form-checkbox text-blue-500 focus:ring-blue-500"
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Front image upload */}
              <input
                type="file"
                onChange={(e) => setFrontImage(e.target.files[0])}
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-red-500">First Upload the Front Image</p>
              <button
                onClick={(e) => uploadImage(e, true)}
                className="px-4 py-2 mx-4 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Upload Front Image
              </button>

              {/* Display uploaded front image */}
              {frontImage && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Front Image Preview</h4>
                  <img
                    src={frontImage}
                    alt="Front Image Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}

              {/* Other image upload */}
              <input
                type="file"
                onChange={(e) => uploadImage(e)}
                multiple
                className="px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-red-500">You can upload additional images</p>

              {/* Display uploaded other images */}
              {imagePreviews.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Other Images Preview</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Other Image ${index + 1}`}
                          className="w-24 h-24 object-cover rounded-md"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 transition duration-200"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddProductForm;

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
