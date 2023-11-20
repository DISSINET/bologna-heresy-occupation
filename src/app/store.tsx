import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import mainReducer from "../components/MainSlice";
import mapReducer from "../components/map/MapSlice";

export const store = configureStore({
  reducer: {
    main: mainReducer,
    map: mapReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
