import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllOrders } from "../Redux/Orders/OrderReducer";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { updateOrderStatus } from "../Firebase/utils/updateOrderStatus"; // Import the Firebase update function

const OrdersAdmin = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigateTo = useNavigate();
  const orders = useSelector((state) => state.order.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser_order = async () => {
      dispatch(FetchAllOrders());
    };
    fetchUser_order();
  }, [dispatch]);

  // const fetchUser_order = async () => {
  //   dispatch(FetchAllOrders());
  // };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // console.log(`Changing status for orderId: ${orderId} to ${newStatus}`);

      // Update the order status in Firebase
      await updateOrderStatus(orderId, newStatus);

      // Optionally, you can dispatch an action to update the local state
      dispatch(FetchAllOrders());
    } catch (error) {
      console.error("Failed to update order status:", error);
    }
  };

  // Sort orders by createdAt or timestamp, but "Delivered" orders will be placed last
  const sortedOrders = orders.slice().sort((a, b) => {
    const statusOrder = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    // If both orders have the same status, sort by createdAt (most recent first)
    if (a.deliver_status === b.deliver_status) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    // If they have different statuses, prioritize non-"Delivered" orders
    if (a.deliver_status === "delivered") return 1; // Place 'a' after 'b'
    if (b.deliver_status === "delivered") return -1; // Place 'b' after 'a'

    // Default sorting by statusOrder
    return (
      statusOrder.indexOf(a.deliver_status) -
      statusOrder.indexOf(b.deliver_status)
    );
  });

  if (!orders || !Array.isArray(orders)) {
    return <p>No orders to display.</p>;
  }

  // console.log(sortedOrders);
  

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
            <h2 className="text-center text-2xl font-bold mb-4">Orders</h2>
            <div className="w-full overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm"
                    >
                      Payment Status
                    </th>
                    <th
                      scope="col"
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="p-2 sm:p-3 text-left text-xs sm:text-sm"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    sortedOrders.map((order, index) => {
                      const totalQuantity = Array.isArray(
                        order.productIdQuantityArray
                      )
                        ? order.productIdQuantityArray.reduce(
                            (acc, item) => acc + item.quantity,
                            0
                          )
                        : 0; // If not an array, set totalQuantity to 0

                      return (
                        <tr key={order.id || index} className="border-b border-gray-300">
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">
                            {order.deliver_status}
                          </td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">
                            {order.paymentStatus}
                          </td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">
                            {order.firstName || "N/A"} {order.lastName || ""}
                          </td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">
                            ₹{order.price}
                          </td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">
                            {order.address || "Address not provided"}
                          </td>
                          <td className="p-2 sm:p-3 text-xs sm:text-sm">
                            {totalQuantity}{" "}
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="text-blue-500 underline"
                            >
                              View
                            </Link>
                          </td>
                          <td className="px-2 py-3 sm:px-3 md:px-4">
                            <select
                              value={order.deliver_status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              className="bg-white border border-gray-300 rounded px-1 py-1 sm:px-2 text-sm sm:py-1"
                            >
                              <option value="pending" className="sm:text-sm">
                                Pending
                              </option>
                              <option value="processing" className="sm:text-sm">
                                Processing
                              </option>
                              <option value="shipped" className="sm:text-sm">
                                Shipped
                              </option>
                              <option value="delivered" className="sm:text-sm">
                                Delivered
                              </option>
                              <option value="cancelled" className="sm:text-sm">
                                Cancelled
                              </option>
                            </select>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrdersAdmin;

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
