import { useEffect, useState } from "react";
import UserList from "@/components/home/UserList";
import { useUser } from "@clerk/clerk-react";
import { useAuthedApi } from "@/api/authedApi";
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
  const api = useAuthedApi();
  const getUsers = async () => {
    try {
      
      const response = await api.get(`${apiUrl}/api/getUsers`);
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
