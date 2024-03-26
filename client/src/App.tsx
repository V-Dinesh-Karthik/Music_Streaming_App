import { useEffect } from "react";
import WebFont from "webfontloader";
import Login from "./pages/Login";
import { useStateProvider } from "./util/stateProvider";
import { ActionTypes } from "./util/actions";
import { useNavigate } from "react-router-dom";

function App() {
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Poppins", "Oswald", "Inria Sans"],
      },
    });
  }, []);

  const { state, dispatch } = useStateProvider();
  const navigate = useNavigate();
  const { token } = state;

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split("&")[0].split("=")[1];
      if (token) {
        history.replaceState(null, document.title, window.location.pathname);
        dispatch({ type: ActionTypes.SET_TOKEN, payload: token });
      }
    }
  }, [dispatch, token]);

  if (token) {
    navigate("/home");
    return null;
  } else {
    return <Login />;
  }
}

export default App;
