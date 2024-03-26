import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { Action } from "./reducer";

// Define the type for your state
interface State {
  token: string | null;
  userInfo: any | null;
  playlists: any[];
  currentPlaying: any | null;
  playerState: boolean;
  selectedPlaylist: any | null;
  selectedPlaylistId: string;
  shuffle: boolean;
  repeat: string;
}

// Define the type for your reducer
type Reducer = (state: State, action: Action) => State;

// Define the context type
interface ContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

// Create the context
export const StateContext = createContext<ContextType | undefined>(undefined);

// Define the props type for StateProvider
interface StateProviderProps {
  initialState: State;
  reducer: Reducer;
  children: ReactNode;
}

// Define the StateProvider component
export const StateProvider = ({
  initialState,
  reducer,
  children,
}: StateProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

// Define the custom hook to access the state and dispatch
export const useStateProvider = (): ContextType => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error("useStateProvider must be used within a StateProvider");
  }
  return context;
};
