import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";
import { Body } from "./pages/Body";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Connections from "./pages/Connections";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Feed = lazy(() => import("./pages/FeedPage"));
const Profile = lazy(() => import("./pages/Profile"));

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter basename="/">
          <Suspense
            fallback={<span className="loading loading-ring loading-sm"></span>}
          >
            <Routes>
              <Route path="/" element={<Body />}>
                <Route path="/" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/connections" element={<Connections />} />
                <Route path="/requests" element={<Connections />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
