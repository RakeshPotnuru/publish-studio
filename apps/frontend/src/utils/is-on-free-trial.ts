import type { IUser } from "@publish-studio/core";
import { constants, UserType } from "@publish-studio/core/src/config/constants";

export const isOnFreeTrial = (user: IUser) => {
  return (
    user.user_type === UserType.FREE &&
    user.created_at.getTime() + constants.FREE_TRIAL_TIME > Date.now()
  );
};
