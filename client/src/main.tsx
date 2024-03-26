import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { Toaster } from "@/components/ui/toaster.tsx";
import "./index.css";
import Home from "./pages/Home.tsx";
import { StateProvider } from "./util/stateProvider.tsx";
import reducer, { initialState } from "./util/reducer.tsx";
import Album from "./pages/Album.tsx";
import { Playlist } from "./pages/Playlist.tsx";
import Search from "./pages/Search.tsx";
import ShowAll from "./pages/ShowAll.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <StateProvider initialState={initialState} reducer={reducer}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/home" element={<Home />}>
            <Route path="playlist/:id" element={<Playlist />} />
            <Route path="album/:id" element={<Album />} />
            <Route path="search" element={<Search />} />
            <Route path="showall" element={<ShowAll />} />
          </Route>
        </Routes>
      </StateProvider>
    </BrowserRouter>
    <Toaster />
  </React.StrictMode>
);
