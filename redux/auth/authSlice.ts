import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  uid: string
  email: string
  name?: string
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<User>) {
      state.isLoggedIn = true
      state.user = action.payload
    },
    logout(state) {
      state.isLoggedIn = false
      state.user = null
    },
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
