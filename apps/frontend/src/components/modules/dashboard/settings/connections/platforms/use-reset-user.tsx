import useUserStore from "@/lib/stores/user";
import { trpc } from "@/utils/trpc";

export function useResetUser() {
  const { setUser, setIsLoading } = useUserStore();

  const { refetch: getUser } = trpc.auth.getMe.useQuery(undefined, {
    enabled: false,
    onSuccess: ({ data }) => {
      setUser(data.user);
      setIsLoading(false);
    },
  });

  const resetUser = async () => {
    setIsLoading(true);
    await getUser();
  };

  return {
    resetUser,
  };
}
