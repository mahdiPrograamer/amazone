import React from "react";
import { connect } from "react-redux";
import { Navigate } from "react-router-dom";

export const Protect = (props) => {
  return props.userData && props.userData.isAdmin ? (
    props.children
  ) : (
    <Navigate to="/signin" />
  );
};

const mapStateToProps = (state) => {
  return {
    userData: state.userSlice.userData,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Protect);
