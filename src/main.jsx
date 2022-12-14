import React from "react";
import ReactDOM from "react-dom";

import { createBrowserHistory } from "history";
import { wrapHistory } from "oaf-react-router";
import App from "./App";
import "./index.css";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { CartContextProvider } from "./context/CartContext";
import { SearchContextProvider } from "./context/SearchContext";

window.baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
// window.baseUrl = "https://radiant-clothing-api.cyclic.app";
console.log(window.baseUrl);
const history = createBrowserHistory();
wrapHistory(history);

ReactDOM.render(
  <React.StrictMode>
    {/* <BrowserRouter> */}
    <HistoryRouter history={history}>
      <CartContextProvider>
        <SearchContextProvider>
          <App />
        </SearchContextProvider>
      </CartContextProvider>
    </HistoryRouter>
    {/* </BrowserRouter> */}
  </React.StrictMode>,
  document.getElementById("root")
);
