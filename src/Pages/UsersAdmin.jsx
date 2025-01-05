import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllUsers, UpdateUserRole } from "../Redux/User/UserReducer";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { updateUserRoleStatus } from "../Firebase/utils/updateOrderStatus";
import { deleteUserFromFirebase } from "../Firebase/utils/deleteUser"; // Import the delete function

const UsersAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigateTo = useNavigate();
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    dispatch(FetchAllUsers());
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      console.log(`Changing role for userId: ${userId} to ${newRole}`);

      // Update the user role in Firebase
      await updateUserRoleStatus(userId, newRole);

      // Optionally, you can dispatch an action to update the local state
      dispatch(FetchAllUsers());
    } catch (error) {
      console.error("Failed to update user role:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserFromFirebase(userId);
        dispatch(FetchAllUsers()); // Refresh the user list
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row w-full max-w-full">
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
            <NavItem icon="fa-qrcode" text="Dashboard" link="/admin/dashboard" />
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
            <NavItem icon="fa-cart-shopping" text="Orders" link="/admin/orders" />
          </div>
          <div onClick={() => navigateTo("/admin/users")}>
            <NavItem icon="fa-users" text="Users" link="/admin/users" />
          </div>
        </div>
            <div className="items-center w-full">
        <div className="flex flex-col justify-center items-center mt-4">
        <h2 className="text-center text-2xl font-bold mb-4">Users</h2>
          <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  {/* <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">UserID</th> */}
                  <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">Name</th>
                  <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">Email</th>
                  <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">Role</th>
                  <th scope="col" className="p-2 sm:p-3 text-left text-xs sm:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
  {users
    .slice() // Create a shallow copy to avoid mutating the original state
    .sort((a, b) => {
      if (a.Role === "admin" && b.Role === "user") return -1; // Admin comes first
      if (a.Role === "user" && b.Role === "admin") return 1;  // User comes second
      return 0; // No sorting if roles are the same
    })
    .map((user) => (
      <tr key={user.uid} className="border-b border-gray-300">
        <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.username}</td>
        <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.email}</td>
        <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.Role}</td>
        <td className="p-2 sm:p-3 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <select
                value={user.Role}
                onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                className="bg-white border border-gray-300 rounded px-1 py-1 sm:px-2 text-sm sm:py-1"
              >
                <option value="admin" className="sm:text-sm">Admin</option>
                <option value="user" className="sm:text-sm">User</option>
              </select>
            </div>
            <button
              onClick={() => handleDeleteUser(user.uid)}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
            >
              Delete
            </button>
          </div>
        </td>
      </tr>
    ))}
</tbody>

              {/* <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="border-b border-gray-300">
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.username}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.email}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">{user.Role}</td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative">
                          <select
                            value={user.Role}
                            onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                            className="bg-white  border border-gray-300 rounded px-1 py-1 sm:px-2 text-sm sm:py-1"
                          >
                            <option value="admin" className="sm:text-sm">Admin</option>
                            <option value="user" className="sm:text-sm">User</option>
                          </select>
                         
                        </div>
                        <button
                          onClick={() => handleDeleteUser(user.uid)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody> */}
            </table>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default UsersAdmin;

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
