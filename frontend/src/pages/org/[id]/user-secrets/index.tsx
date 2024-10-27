import { useTranslation } from "react-i18next";
import Head from "next/head";

import { UserSecretsPage } from "@app/views/UserSecrets/Page";

export default function UserSecrets() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t("common.head-title", { title: t("user-secrets.title") })}</title>
        <link rel="icon" href="/infisical.ico" />
      </Head>
      <UserSecretsPage />
    </>
  );
}

UserSecrets.requireAuth = true;
