import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
  listAll,
} from "firebase/storage";
import { toast } from "react-toastify";
import { v4 } from "uuid";
import { db, storage } from "../Firebase/Config";
import dltBtn from "../Assets/dltBtn.jpg";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  addDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";

const BannerAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigateTo = useNavigate();
  const [imageUpload, setImageUpload] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState([]);
  const [editedHighlights, setEditedHighlights] = useState([]);
  const [maxUsers, setMaxUsers] = useState(0);
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoPrice, setPromoPrice] = useState("");
  const [newPromoCode, setNewPromoCode] = useState("");

  useEffect(() => {
    fetchImages();
    fetchHighlights();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Fetch Highlights from Firestore
  const fetchHighlights = async () => {
    try {
      const sliderCollectionRef = collection(db, "Slider");
      const sliderSnapshot = await getDocs(sliderCollectionRef);

      sliderSnapshot.forEach((doc) => {
        const data = doc.data();
        const highlightsArray = data.Highlights || []; // Fetch Highlights as array
        setHighlights(highlightsArray);
        setEditedHighlights([...highlightsArray]); // Initialize edited highlights with the same value
      });
    } catch (error) {
      console.error("Error fetching highlights:", error);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Fetch Promo Codes from Firestore
  const fetchPromoCodes = async () => {
    try {
      const promoCodesCollectionRef = collection(db, "PromoCodes");
      const promoSnapshot = await getDocs(promoCodesCollectionRef);
      const promoList = promoSnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID for deletion later
        code: doc.data().code,
        maxUsers: doc.data().maxUsers,
        usedCount: doc.data().usedCount,
        price: doc.data().price,
      }));
      setPromoCodes(promoList);
    } catch (error) {
      console.error("Error fetching promo codes:", error);
      toast.error("Failed to fetch promo codes.");
    }
  };

  // Fetch Images from Firebase Storage
  const fetchImages = async () => {
    try {
      const listRef = ref(storage, "images/banners/");
      const res = await listAll(listRef);
      const urls = await Promise.all(
        res.items.map((itemRef) => getDownloadURL(itemRef))
      );
      setImageUrls(urls);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to fetch images.");
      setLoading(false);
    }
  };

  // Upload Image to Firebase Storage
  const uploadImage = async (event) => {
    event.preventDefault();
    if (imageUpload == null) {
      toast.error("No image selected. Please choose an image to upload.");
      return;
    }
    const imageRef = ref(storage, `images/banners/${imageUpload.name + v4()}`);
    try {
      await uploadBytes(imageRef, imageUpload);
      const downloadURL = await getDownloadURL(imageRef);
      setImageUrls((prev) => [...prev, downloadURL]);
      toast.success("Image Uploaded Successfully");
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Image upload failed. Please try again.");
    }
  };

  // Delete Image from Firebase Storage
  const deleteImgHandler = async (url) => {
    try {
      const imageRef = ref(storage, url);
      await deleteObject(imageRef);
      setImageUrls((prev) => prev.filter((img) => img !== url));
      toast.success("Image Deleted Successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image.");
    }
  };

  // Update Firestore with edited Highlights
  const updateHighlights = async () => {
    try {
      const sliderCollectionRef = collection(db, "Slider");
      const sliderSnapshot = await getDocs(sliderCollectionRef);
      const docRef = doc(sliderCollectionRef, sliderSnapshot.docs[0].id);

      await updateDoc(docRef, {
        Highlights: editedHighlights,
      });

      setHighlights(editedHighlights);
      toast.success("Highlights updated successfully");
    } catch (error) {
      console.error("Error updating highlights:", error);
      toast.error("Failed to update highlights.");
    }
  };

  // Handle Edit Highlight Text Change
  const handleHighlightChange = (index, value) => {
    const newHighlights = [...editedHighlights];
    newHighlights[index] = value;
    setEditedHighlights(newHighlights);
  };

  // Handle Delete Highlight
  const deleteHighlight = (index) => {
    const newHighlights = editedHighlights.filter((_, i) => i !== index);
    setEditedHighlights(newHighlights);
  };

  // Add a new empty Highlight field
  const addHighlightField = () => {
    setEditedHighlights([...editedHighlights, ""]); // Adds a new empty string to the highlights
  };

  const generatePromoCode = async () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 10; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    // Ensure promoPrice is a valid number
    if (!promoPrice || isNaN(promoPrice) || promoPrice <= 0) {
      toast.error("Please enter a valid price.");
      return;
    }

    try {
      // Save the promo code and its price to Firestore

      const promoCodeData = {
        code: code, // This can be a random string generator
        price: promoPrice,
        maxUsers: maxUsers, // Set the max users allowed to use the promo code
        usedCount: 0, // Initial used count is 0
      };
      await setDoc(doc(db, "PromoCodes", promoCodeData.code), promoCodeData);

      setPromoCodes((prevCodes) => [...prevCodes, promoCodeData]);
      setPromoPrice("");
      toast.success("Promo code generated and saved successfully.");
    } catch (error) {
      console.error("Error generating promo code:", error);
      toast.error("Failed to generate promo code.");
    }
  };

  const deletePromoCode = async (code) => {
    try {
      // Find the document with the given promo code
      const promoCodeRef = await getPromoCodeRefByCode(code);

      // Delete the promo code document from Firestore
      await deleteDoc(promoCodeRef);

      // Remove the promo code from the state (UI)
      setPromoCodes(promoCodes.filter((promo) => promo.code !== code));

      toast.success("Promo code deleted successfully.");
    } catch (error) {
      console.error("Error deleting promo code:", error);
      toast.error("Failed to delete promo code.");
    }
  };

  // Helper function to get Firestore reference of a promo code by its code
  const getPromoCodeRefByCode = async (code) => {
    const promoCodesCollectionRef = collection(db, "PromoCodes");
    const promoSnapshot = await getDocs(promoCodesCollectionRef);
    let promoCodeRef = null;

    promoSnapshot.forEach((doc) => {
      if (doc.data().code === code) {
        promoCodeRef = doc.ref;
      }
    });

    return promoCodeRef;
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row w-full">
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
          {/* Sidebar content */}
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

        <div className="w-full pt-3 p-4">
          {/* Banner Image Upload */}
          <div className="text-center text-2xl font-extrabold mb-4">
            Banner Images
          </div>
          <input
            type="file"
            onChange={(e) => setImageUpload(e.target.files[0])}
            className="border p-2 mb-4 md:mb-0 md:mr-4 w-full md:w-auto"
          />
          <button
            onClick={uploadImage}
            className="inline-flex items-center bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          >
            Upload
          </button>
          <div className="flex flex-wrap gap-1">
            {loading ? (
              <p>Loading...</p>
            ) : (
              imageUrls.map((url, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <img
                    src={url}
                    alt={`Image ${index + 1}`}
                    style={{ height: "20rem", width: "25rem" }}
                  />
                  <img
                    src={dltBtn}
                    alt={`Delete ${index + 1}`}
                    onClick={() => deleteImgHandler(url)}
                    className="rounded cursor-pointer"
                    style={{
                      height: "2rem",
                      width: "5rem",
                      marginLeft: "auto",
                    }}
                  />
                </div>
              ))
            )}
          </div>

          {/* Highlight Editing */}
          <div className="mt-8">
            <div className="text-center text-2xl font-extrabold mb-4">
              Edit Highlights
            </div>
            <div className="space-y-4">
              {editedHighlights.map((highlight, index) => (
                <div key={index} className="flex items-center justify-between">
                  <input
                    type="text"
                    value={highlight}
                    onChange={(e) =>
                      handleHighlightChange(index, e.target.value)
                    }
                    className="border p-2 w-4/5"
                  />
                  <button
                    onClick={() => deleteHighlight(index)}
                    className="ml-2 bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addHighlightField}
              className="mt-4 bg-blue-600 text-white p-2 mx-3 rounded"
            >
              Add New Highlight
            </button>
            <button
              onClick={updateHighlights}
              className="mt-4 bg-green-600 text-white p-2 rounded"
            >
              Update Highlights
            </button>
          </div>
          {/* Promo Code Generation */}
          <div className="mt-8 border-b pb-4">
            <div className="text-center text-2xl font-extrabold mb-4">
              Generate Promo Codes
            </div>
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="Set Promo Price"
                value={promoPrice}
                onChange={(e) => setPromoPrice(e.target.value)}
                className="border p-2 w-4/5"
              />
              <input
                type="number"
                placeholder="Max Users"
                value={maxUsers}
                onChange={(e) => setMaxUsers(e.target.value)}
                className="border p-2 w-4/5 ml-2"
              />
              <button
                onClick={generatePromoCode}
                className="ml-2 bg-blue-600 text-white p-2 rounded"
              >
                Generate Promo Code
              </button>
            </div>
            <div className="mt-4 space-y-2">
              {promoCodes.map((promo, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{promo.code}</span>
                  <span className="text-lg font-semibold">₹{promo.price}</span>
                  <span className="text-lg font-semibold">
                    Max Users: {promo?.maxUsers || 0}
                  </span>
                  <span className="text-lg font-semibold">
                    Used: {promo?.usedCount || 0}
                  </span>
                  <button
                    onClick={() => deletePromoCode(promo.code)}
                    className="ml-2 bg-red-500 text-white p-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
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

export default BannerAdmin;
