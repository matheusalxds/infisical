import { Knex } from "knex";

import { TableName } from "@app/db/schemas";

export async function up(knex: Knex): Promise<void> {
  const isTablePresent = await knex.schema.hasTable(TableName.AuthCredentialHistory);
  if (!isTablePresent) {
    await knex.schema.createTable(TableName.AuthCredentialHistory, (t) => {
      t.uuid("id", { primaryKey: true }).defaultTo(knex.fn.uuid());
      t.text("clientPublicKey");
      t.text("serverPrivateKey");
      t.integer("encryptionVersion").defaultTo(2);
      t.text("protectedKey");
      t.text("protectedKeyIV");
      t.text("protectedKeyTag");
      t.text("publicKey").notNullable();
      t.text("encryptedPrivateKey").notNullable();
      t.text("iv").notNullable();
      t.text("tag").notNullable();
      t.text("salt").notNullable();
      t.text("verifier").notNullable();
      // one to one relationship
      t.uuid("userId").notNullable();
      t.foreign("userId").references("id").inTable(TableName.Users).onDelete("CASCADE");
      t.text("hashedPassword");
      t.text("serverEncryptedPrivateKey").notNullable();
      t.text("serverEncryptedPrivateKeyIV").notNullable();
      t.text("serverEncryptedPrivateKeyTag").notNullable();
      t.text("serverEncryptedPrivateKeyEncoding").notNullable();
      t.timestamp("createdAt").defaultTo(knex.fn.now()).notNullable();
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists(TableName.AuthCredentialHistory);
}
