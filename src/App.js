import { BrowserRouter } from "react-router-dom";
import MainRouter from "./router";
import "../src/assets/css/style.css";
import { supabase } from "./supabase";
import { useEffect, useState } from "react";

function App() {
  // const [users, setUsers] = useState([]);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   const {data} = await supabase.from("users").select("*");
  //   setUsers(data);
  // console.log("Users", users);

  // };

  return (
    <div>
      <BrowserRouter>
        <MainRouter />
      </BrowserRouter>
    </div>
  );
}

export default App;
