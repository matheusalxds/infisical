import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createNotification } from "@app/components/notifications";
import attemptChangePassword from "@app/components/utilities/attemptChangePassword";
import {
  Button,
  FormControl, Input,
  Modal,
  ModalContent,
} from "@app/components/v2";
import { useOrganization, useUser } from "@app/context";
import { UsePopUpState } from "@app/hooks/usePopUp";

const userChangeWebLoginSchema = z
  .object({
    currentPassword: z.string().min(12),
    newPassword: z
      .string()
      .refine((newPassword) => /[A-Z]/.test(newPassword), {
        message: "Password should contain at least 1 uppercase",
      })
      .refine((newPassword) => /[a-z]/.test(newPassword), {
        message: "Password should contain at least 1 lowercase",
      })
      .refine((newPassword) => /[0-9]/.test(newPassword), {
        message: "Password should contain at least 1 number",
      })
      .refine((newPassword) => /[!@#$%^&*.]/.test(newPassword), {
        message: "Password should contain at least 1 special character",
      })
      .refine((newPassword) => newPassword.length >= 12, {
        message: "Password should contain at least 8 characters",
      }),
    newPasswordConfirmation: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.newPasswordConfirmation !== data.newPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mismatching passwords", path: ["newPasswordConfirmation"] });
    }

    if (data.currentPassword === data.newPassword) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "It's the same password", path: ["currentPassword"] });
    }
  });

type TUpdateWebLoginForm = z.infer<typeof userChangeWebLoginSchema>;

type Props = {
  popUp: UsePopUpState<["updateWebLogin"]>;
  handlePopUpToggle: (popUpName: keyof UsePopUpState<["updateWebLogin"]>, state?: boolean) => void;
};

export const UpdateCredentialsModal = ({ popUp, handlePopUpToggle }: Props) => {
  const { t } = useTranslation();
  const { user } = useUser();
  const { currentOrg } = useOrganization();

  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<TUpdateWebLoginForm>({ resolver: zodResolver(userChangeWebLoginSchema) });

  const onAddMembers = async ({
    newPassword,
    currentPassword
  }: TUpdateWebLoginForm) => {
    if (!currentOrg?.id) return;

    try {
      await attemptChangePassword({ email: user.username, currentPassword, newPassword });
      createNotification({ text: "Successfully updated information", type: "success"});
      window.location.href = "/login";
    } catch (e) {
      createNotification({ text: "Was not possible to update the information.", type: "error"});
    }
  };

  return (
    <Modal
      isOpen={popUp?.updateWebLogin?.isOpen}
      onOpenChange={(isOpen) => {
        handlePopUpToggle("updateWebLogin", isOpen);
      }}
    >
      <ModalContent
        title={`${t("user-secrets.modal.update.title")}`}
        subTitle={t("user-secrets.modal.update.subtitle")}
      >
        <form onSubmit={handleSubmit(onAddMembers)}>
          <Controller
            control={control}
            name="newPassword"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                label="New password"
                errorText={error?.message}
                isError={Boolean(error)}
              >
                <Input {...field} placeholder="New password" type="password" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="newPasswordConfirmation"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                label="New password confirmation"
                errorText={error?.message}
                isError={Boolean(error)}
              >
                <Input {...field} placeholder="New password confirmation" type="password" />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="currentPassword"
            render={({ field, fieldState: { error } }) => (
              <FormControl
                label="Current password"
                errorText={error?.message}
                isError={Boolean(error)}
              >
                <Input {...field} placeholder="Your current password" type="password" />
              </FormControl>
            )}
          />
          <div className="mt-8 flex items-center">
            <Button className="mr-4" size="sm" type="submit" isLoading={isSubmitting} isDisabled={isSubmitting}>
              Save
            </Button>
            <Button colorSchema="secondary" variant="plain" onClick={() => handlePopUpToggle("updateWebLogin", false)}>
              Cancel
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  );
};
