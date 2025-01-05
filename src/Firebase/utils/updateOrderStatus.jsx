import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import { deleteUser, getAuth } from "firebase/auth";

const app = getApp();
const db = getFirestore(app);

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    // console.log(`Attempting to update orderId: ${orderId} with newStatus: ${newStatus}`);

    const orderRef = doc(db, "Orders", orderId);
    const docSnap = await getDoc(orderRef);

    if (docSnap.exists()) {
      const updates = { deliver_status: newStatus };

      if (newStatus === "delivered") {
        updates.paymentStatus = "paid";
      }

      await updateDoc(orderRef, updates);
      // console.log(`Order ${orderId} status updated to ${newStatus}. Payment status updated if applicable.`);
    } else {
      console.error(`Document with orderId ${orderId} does not exist.`);
    }
  } catch (error) {
    console.error("Error updating order status: ", error);
    throw error; // Ensure error is propagated for handling in the component
  }
};


export const updateUserRoleStatus = async (userId, newRole) => {
  try {
    // console.log(`Attempting to update userId: ${userId} with newRole: ${newRole}`);

    const userRef = doc(db, "Users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      await updateDoc(userRef, {
        Role: newRole,
      });
      // console.log(`user ${userId} status updated to ${newRole}`);
    } else {
      console.error(`Document with userId ${userId} does not exist.`);
    }
  } catch (error) {
    console.error("Error updating user role: ", error);
    throw error; // Ensure error is propagated for handling in the component
  }
};


export const deleteUserAccount = async (uid) => {
  const auth = getAuth();
  const db = getFirestore();

  try {
    // Delete user data from Firestore
    await deleteDoc(doc(db, "users", uid));

    // Delete user authentication
    const user = auth.currentUser;
    if (user && user.uid === uid) {
      await deleteUser(user);
    } else {
      console.error("Cannot delete user: user not authenticated or different user logged in.");
    }
  } catch (error) {
    console.error("Error deleting user account:", error);
  }
};
