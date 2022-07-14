import React, { useContext } from "react";
import { UserContext } from "../context/useContext";
import { Alert } from "react-bootstrap";
const PrivateRoute = (props) => {
  const { user } = useContext(UserContext);
  if (user && !user.auth) {
    return (
      <>
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>You don't have permisson to access this route</p>
        </Alert>
      </>
    );
  }
  return <>{props.children}</>;
};

export default PrivateRoute;
