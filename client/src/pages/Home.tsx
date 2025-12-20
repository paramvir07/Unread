import { useEffect, useState } from "react";
import axios from "axios";
import UserList from "@/components/home/UserList";
import { useUser } from "@clerk/clerk-react";
export type User = {
  id: string;
  clerkId: string,
  username: string;
  firstname: string;
  lastname: string;
  imageUrl: string;
  isOnline: true
};

const Home = () => {
  const {isLoaded, isSignedIn } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const getUsers = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/getUsers`, {withCredentials: true});
      const data = response.data;
      setUsers(data.users);
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
      <UserList users={users} />
    </>
  );
};

export default Home;
