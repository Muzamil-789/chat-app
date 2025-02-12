import React from "react";
import AuthRouting from "./AuthRouting";
import { auth } from "../firebase";
import AppRouting from "./AppRouting";

const MainRouter = () => {
  const Users = auth.currentUser;

  return (
    <div>
    {Users ? <AppRouting/> : <AuthRouting/>}
      {/* <AuthRouting /> */}
    </div>
  );
};

export default MainRouter;
