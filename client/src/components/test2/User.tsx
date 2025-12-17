import { useAtom } from "jotai";
import { loadableUserAtom } from "./Atoms";
import { Separator } from "../ui/separator";

const User = () => {
  const [usersData] = useAtom(loadableUserAtom);
  console.log(usersData);

  return (
    <>
      {/* <Separator />
    <div>User</div> */}
    </>
  );
};

export default User;
