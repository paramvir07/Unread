import { useEffect, useState } from "react";
import axios from "axios";
import UserList from "@/components/home/UserList";
export type User = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
};

const Home = () => {
  const [users, setUsers] = useState<User[]>([]);
  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/getUsers");
      const data = response.data;
      setUsers(data.users);
    } catch (error) {
      console.error(`Error while fetching users: ${error}`);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <>
      <UserList users={users}/>
    </>
  );
};

export default Home;
