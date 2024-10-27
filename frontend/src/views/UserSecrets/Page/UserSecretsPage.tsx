import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";

import { Tab, TabList, TabPanel, Tabs } from "@app/components/v2";
import { OrgPermissionActions, OrgPermissionSubjects } from "@app/context";
import { withPermission } from "@app/hoc";
import { isTabSection } from "@app/views/Org/Types";
import { CredentialsHistoryTab } from "@app/views/UserSecrets/Page/components/UsersTab";

export const UserSecretsPage = withPermission(
  () => {
    const router = useRouter();
    const { t } = useTranslation();

    const { query } = router;

    const selectedTab = query.selectedTab as string;
    const tabs = [
      { name: t("user-secrets.tabs.first-title"), key: "first-tab", comp: () => <CredentialsHistoryTab /> },
    ];
    const [activeTab, setActiveTab] = useState(tabs[0].key);

    useEffect(() => {
      if (selectedTab && isTabSection(selectedTab)) {
        setActiveTab(selectedTab);
      }
    }, [isTabSection, selectedTab]);

    const updateSelectedTab = (tab: string) => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, selectedTab: tab },
      });
    }

    return (
      <div className="container mx-auto flex flex-col justify-between bg-bunker-800 text-white">
        <div className="mx-auto mb-6 w-full max-w-7xl py-6 px-6">
          <p className="mr-4 mb-4 text-3xl font-semibold text-white">{t("user-secrets.title")}</p>
          <Tabs value={activeTab} onValueChange={updateSelectedTab}>
            <TabList>
              {tabs.map(tab => <Tab value={tab.key} key={tab.name}>{tab.name}</Tab>)}
            </TabList>
            {tabs.map(tab => (<TabPanel value={tab.key} key={tab.name}>{tab.comp()}</TabPanel>))}
          </Tabs>
        </div>
      </div>
    );
  },
  { action: OrgPermissionActions.Read, subject: OrgPermissionSubjects.Member }
);
