import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase/Config";

const initialState = {
  isLoggedIn: false,
  users: [],
};

// export const FetchAllUsers = createAsyncThunk("user/FetchAllUsers", async () => {
//   const response = await getDocs(collection(db, "Users"));
//   return response.docs.map((doc) => doc.data());
// });

const convertTimestamps = (data) => {
  if (data instanceof Object) {
    for (const key in data) {
      if (data[key] instanceof Object) {
        if (data[key].toDate) {
          // Convert Firestore Timestamp to ISO string
          data[key] = data[key].toDate().toISOString();
        } else {
          // Recursively convert nested objects/arrays
          convertTimestamps(data[key]);
        }
      }
    }
  }
  return data;
};

export const FetchAllUsers = createAsyncThunk("user/FetchAllUsers", async () => {
  const response = await getDocs(collection(db, "Users"));
  return response.docs.map((doc) => {
    const data = doc.data();
    return convertTimestamps(data);
  });
});



// export const FetchAllUsers = createAsyncThunk("user/FetchAllUsers", async () => {
//   const response = await getDocs(collection(db, "Users"));
//   return response.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       ...data,
//       createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : null,
//     };
//   });
// });



export const UpdateUserRole = createAsyncThunk(
  "user/UpdateUserRole",
  async ({ userId, role }) => {
    const userRef = doc(db, "Users", userId);
    await updateDoc(userRef, {
      role: role,
    });
    return { userId, role };
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setActiveUser(state, action) {
      const { email, userName, userId, wishList, createdAt, role } = action.payload;
      state.isLoggedIn = true;
      state.email = email;
      state.userName = userName;
      state.userId = userId;
      // state.wishList = wishList;
      state.createdAt = createdAt;
      state.role = role;
    },
    removeActiveUser(state) {
      state.isLoggedIn = false;
      state.email = null;
      state.userName = null;
      state.userId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchAllUsers.pending, (state) => {
        // Optionally handle pending state
      })
      .addCase(FetchAllUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(FetchAllUsers.rejected, (state, action) => {
        // Optionally handle error state
      })
      .addCase(UpdateUserRole.fulfilled, (state, action) => {
        const { userId, role } = action.payload;
        const userIndex = state.users.findIndex((user) => user.userId === userId);
        if (userIndex !== -1) {
          state.users[userIndex].role = role;
        }
      });
  },
});

export const { setActiveUser, removeActiveUser } = userSlice.actions;

export default userSlice.reducer;
