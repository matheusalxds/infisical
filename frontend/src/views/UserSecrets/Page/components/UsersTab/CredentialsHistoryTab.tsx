import { useTranslation } from "react-i18next";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";

import { createNotification } from "@app/components/notifications";
import { OrgPermissionCan } from "@app/components/permissions";
import { Button, DeleteActionModal } from "@app/components/v2";
import { OrgPermissionActions, OrgPermissionSubjects, useUser } from "@app/context";
import { useCredentialsHistory, useDeleteHistoryCredentials } from "@app/hooks/api/users/queries";
import { usePopUp } from "@app/hooks/usePopUp";

import { HistoryTable } from "./HistoryTable";
import { UpdateCredentialsModal } from "./UpdateCredentialsModal";

export const CredentialsHistoryTab = () => {
  const { t } = useTranslation();
  const { popUp, handlePopUpOpen, handlePopUpToggle, handlePopUpClose } = usePopUp([ "updateWebLogin", "removeHistory"]);
  const { user } = useUser();
  const { data: histories, isLoading, refetch } = useCredentialsHistory(user.id);
  const { mutateAsync: deleteHistory } = useDeleteHistoryCredentials();

  const handleUpdateClick = () => handlePopUpOpen("updateWebLogin");

  const handleRemoveClick = async (): Promise<void> => {
    try {
      const { id } = popUp?.removeHistory?.data as { id: string };
      await deleteHistory(id);
      await refetch();
      handlePopUpClose("removeHistory");
      createNotification({ type: "success", text: "Successfully deleted user" });
    } catch (err) {
      createNotification({ type: "error", text: "Error deleting user" });
    }
  };

  return (
    <motion.div
      key="panel-org-members"
      transition={{ duration: 0.15 }}
      initial={{ opacity: 0, translateX: 30 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: 30 }}
    >
      <div className="mb-6 rounded-lg border border-mineshaft-600 bg-mineshaft-900 p-4">
        <div className="mb-4 flex justify-between">
          <p className="text-xl font-semibold text-mineshaft-100">{t("user-secrets.tabs.first-subtitle")}</p>
          <OrgPermissionCan I={OrgPermissionActions.Create} a={OrgPermissionSubjects.Member}>
            {(isAllowed) => (
              <Button
                colorSchema="primary"
                type="submit"
                leftIcon={<FontAwesomeIcon icon={faEdit} />}
                onClick={handleUpdateClick}
                isDisabled={!isAllowed}
              >
                {t("user-secrets.btns.update-credentials")}
              </Button>
            )}
          </OrgPermissionCan>
        </div>
        <HistoryTable handlePopUpOpen={handlePopUpOpen} data={histories} isLoading={isLoading} />
        <UpdateCredentialsModal popUp={popUp} handlePopUpToggle={handlePopUpToggle} />
        <DeleteActionModal
          isOpen={popUp.removeHistory.isOpen}
          deleteKey="remove"
          title={t("user-secrets.btns.update-credentials")}
          onChange={(isOpen) => handlePopUpToggle("removeHistory", isOpen)}
          onDeleteApproved={handleRemoveClick}
        />
      </div>
    </motion.div>
  );
};

