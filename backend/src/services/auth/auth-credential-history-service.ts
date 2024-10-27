import { TAuthCredentialHistoryDALFactory } from "@app/services/history/auth-credential-history-dal";

import { TUserDALFactory } from "../user/user-dal";

type TAuthPasswordServiceFactoryDep = {
  userDAL: TUserDALFactory;
  authCredentialHistoryDAL: TAuthCredentialHistoryDALFactory;
};

export type TAuthCredentialsHistoryFactory = ReturnType<typeof authCredentialHistoryServiceFactory>;
export const authCredentialHistoryServiceFactory = ({
  userDAL,
  authCredentialHistoryDAL
}: TAuthPasswordServiceFactoryDep) => {
  const getCredentialHistory = async (userId: string) => {
    const userEnc = await userDAL.findUserEncKeyByUserId(userId);
    if (!userEnc) throw new Error("Failed to find user");
    return authCredentialHistoryDAL.findByUserId(userId);
  };

  const deleteCredentialHistory = async (historyId: string) => {
    await authCredentialHistoryDAL.deleteById(historyId);
    return historyId;
  };

  return {
    getCredentialHistory,
    deleteCredentialHistory
  };
};
