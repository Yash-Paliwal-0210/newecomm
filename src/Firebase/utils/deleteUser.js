// src/Firebase/utils/deleteUser.js
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../Config"; // Adjust the path if necessary

export const deleteUserFromFirebase = async (userId) => {
  try {
    const userDocRef = doc(db, "Users", userId);
    await deleteDoc(userDocRef);
  } catch (error) {
    console.error("Error deleting user: ", error);
    throw error; // Propagate error to the caller
  }
};
