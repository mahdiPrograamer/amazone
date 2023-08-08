import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/header/header";
import { ToastContainer } from "react-toastify";
import { Route, Routes, useLocation, useRoutes } from "react-router-dom";
import routes from "./routes/routes";
import { Container } from "react-bootstrap";
import React, { useEffect } from "react";
import { connect } from "react-redux";
import { getAllProducts } from "./stateManagment/reducer/reducer";
import Map from "./pages/map";
import ProtectedRoute from "./components/protectedRoutes/protectRoute";

export const App = (props) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const router = useRoutes(routes);

  useEffect(() => {
    console.log("dd");
    // props.getAll(); // want to stop for this line
  }, []);

  return (
    <>
      <ToastContainer position="bottom-center" limit={1} />
      {props.isLoading ? (
        <div>loading ....</div>
      ) : (
        <>
          {currentPath !== "/map" ? (
            <>
              <Header></Header>
              <main>
                <Container className="mt-3">{router}</Container>
              </main>
            </>
          ) : (
            <Routes>
              <Route
                path="/map"
                element={
                  // <ProtectedRoute>
                  <Map />
                  // </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    // isMap: state.featureSlice.isMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
