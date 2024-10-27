import { Knex } from "knex";

import { TDbClient } from "@app/db";
import { TableName, TUserEncryptionKeys } from "@app/db/schemas";
import { DatabaseError } from "@app/lib/errors";
import { ormify } from "@app/lib/knex";

export type TAuthCredentialHistoryDALFactory = ReturnType<typeof authCredentialHistoryDALFactory>;

export const authCredentialHistoryDALFactory = (db: TDbClient) => {
  const authCredentialHistoryOrm = ormify(db, TableName.AuthCredentialHistory);

  const createPasswordHistory = async (data: TUserEncryptionKeys, tx?: Knex): Promise<boolean> => {
    try {
      const response = await (tx || db)(TableName.AuthCredentialHistory)
        .insert({ ...data, id: undefined })
        .returning("*");
      return !!response;
    } catch (error) {
      throw new DatabaseError({ error, name: "Create credentials history" });
    }
  };

  const findByUserId = async (userId: string, tx?: Knex) => {
    return (tx || db)(TableName.AuthCredentialHistory)
      .where("userId", userId)
      .join(TableName.Users, `${TableName.AuthCredentialHistory}.userId`, `${TableName.Users}.id`)
      .select(
        db.ref("id").withSchema(TableName.AuthCredentialHistory),
        db.ref("hashedPassword").withSchema(TableName.AuthCredentialHistory),
        db.ref("createdAt").withSchema(TableName.AuthCredentialHistory),
        db.ref("email").withSchema(TableName.Users),
        db.ref("username").withSchema(TableName.Users),
        db.ref("id").withSchema(TableName.Users).as("userId")
      );
  };

  return {
    ...authCredentialHistoryOrm,
    createPasswordHistory,
    findByUserId
  };
};
