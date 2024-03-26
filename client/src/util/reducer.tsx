import { Reducer } from "react";
import { ActionTypes } from "./actions";

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

export const initialState: State = {
  token: null,
  userInfo: null,
  playlists: [],
  currentPlaying: null,
  playerState: false,
  selectedPlaylist: null,
  selectedPlaylistId: "37i9dQZF1DX0XUfTFmNBRM",
  shuffle: false,
  repeat: "off",
};

export interface Action {
  type: ActionTypes;
  payload?: any;
}

const handleShuffle = (shuffle: boolean): Action => ({
  type: ActionTypes.SET_SHUFFLE,
  payload: shuffle,
});

const reducer: Reducer<State, Action> = (state: State, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    case ActionTypes.SET_USER:
      return {
        ...state,
        userInfo: action.payload,
      };

    case ActionTypes.SET_PLAYLISTS:
      return {
        ...state,
        playlists: action.payload,
      };
    case ActionTypes.SET_PLAYING:
      return {
        ...state,
        currentPlaying: action.payload,
      };
    case ActionTypes.SET_PLAYER_STATE:
      return {
        ...state,
        playerState: action.payload,
      };
    case ActionTypes.SET_PLAYLIST:
      return {
        ...state,
        selectedPlaylist: action.payload,
      };
    case ActionTypes.SET_PLAYLIST_ID:
      return {
        ...state,
        selectedPlaylistId: action.payload,
      };

    case ActionTypes.SET_SHUFFLE:
      return {
        ...state,
        shuffle: action.payload,
      };
    case ActionTypes.SET_REPEAT:
      return {
        ...state,
        repeat: action.payload,
      };
    default:
      return state;
  }
};

export default reducer;
