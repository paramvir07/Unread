import { Skeleton } from "./ui/skeleton";

export const MySkeleton = () => {
  return (
    <div className="flex flex-col items-center gap-5 mt-10">
      <Skeleton className="h-14 w-[300px] rounded-xl" />
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  );
};
