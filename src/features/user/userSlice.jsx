import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  cartId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    setCartId: (state, action) => {
      state.cartId = action.payload;
    },
    clearUserData: (state) => {
      state.userId = null;
      state.cartId = null;
    },
  },
});

export const { setUserId, setCartId, clearUserData } = userSlice.actions;
export default userSlice.reducer;
