import { useEffect, useState } from "react";
import axios from "axios";
import UserList from "@/components/home/UserList";
import { useUser } from "@clerk/clerk-react";
export type User = {
  id: string;
  username: string;
  firstname: string;
  lastname: string;
  imageUrl: string
};

const Home = () => {
  const {isLoaded, isSignedIn } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const getUsers = async () => {
    setLoadingUsers(true)
    try {
      const response = await axios.get("http://localhost:3000/api/getUsers", {withCredentials: true});
      const data = response.data;
      setUsers(data.users);
      setLoadingUsers(false)
    } catch (error) {
      console.error(`Error while fetching users: ${error}`);
    }
  };
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
      getUsers();
    }, [isLoaded, isSignedIn]);
  
  

  return (
    <>
      <UserList users={users} loadingUsers={ loadingUsers} />
    </>
  );
};

export default Home;
