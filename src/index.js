import React from "react";
import * as ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Greetings2008 from "./containers/Greetings2008/Greetings2008";
import Greetings2009 from "./containers/Greetings2009/Greetings2009";
import Greetings2011 from "./containers/Greetings2011/Greetings2011";
import Greetings2012 from "./containers/Greetings2012/Greetings2012";
import Greetings2014 from "./containers/Greetings2014/Greetings2014";
import Greetings2015 from "./containers/Greetings2015/Greetings2015";
import Greetings2017 from "./containers/Greetings2017/Greetings2017";
import Greetings2019 from "./containers/Greetings2019/Greetings2019";
import { Greetings2020 } from "./containers/Greetings2020/Greetings2020";
import { Greetings2021 } from "./containers/Greetings2021/Greetings2021";
import { Greetings2022 } from "./containers/Greetings2022/Greetings2022";
import NotFound from "./containers/NotFound/NotFound";
import quizReducer from "features/quiz/quizSlice";
import { configureStore } from "@reduxjs/toolkit";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="2008"
        element={
          <App>
            <Greetings2008 />
          </App>
        }
      />
      <Route
        path="2009"
        element={
          <App>
            <Greetings2009 />
          </App>
        }
      />
      <Route
        path="2011"
        element={
          <App>
            <Greetings2011 />
          </App>
        }
      />
      <Route
        path="2012"
        element={
          <App>
            <Greetings2012 />
          </App>
        }
      />
      <Route
        path="2014"
        element={
          <App>
            <Greetings2014 />
          </App>
        }
      />
      <Route
        path="2015"
        element={
          <App>
            <Greetings2015 />
          </App>
        }
      />
      <Route
        path="2017"
        element={
          <App>
            <Greetings2017 />
          </App>
        }
      />
      <Route
        path="2019"
        element={
          <App>
            <Greetings2019 />
          </App>
        }
      />
      <Route
        path="2020"
        element={
          <App>
            <Greetings2020 />
          </App>
        }
      />
      <Route
        path="2021"
        element={
          <App>
            <Greetings2021 />
          </App>
        }
      />
      <Route
        path="2022"
        element={
          <App>
            <Greetings2022 />
          </App>
        }
      />
      <Route
        path="/"
        element={
          <App>
            <Greetings2022 />
          </App>
        }
      />
      <Route
        path="*"
        element={
          <App>
            <NotFound />
          </App>
        }
        status={404}
      />
    </>
  )
);

const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
