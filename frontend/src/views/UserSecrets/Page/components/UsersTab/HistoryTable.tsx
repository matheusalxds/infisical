import { faKey, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  EmptyState,
  IconButton,
  Table,
  TableContainer,
  TableSkeleton,
  TBody,
  Td,
  Th,
  THead,
  Tr
} from "@app/components/v2";
import { CredentialHistory } from "@app/hooks/api/users/types";
import { UsePopUpState } from "@app/hooks/usePopUp";
import { formatDate } from "@app/lib/date/date-format";

type Props = {
  data?: CredentialHistory[]
  handlePopUpOpen: (
    popUpName: keyof UsePopUpState<["removeHistory"]>,
    data: { id: string; }
  ) => void;
  isLoading: boolean
};

export const HistoryTable = ({ handlePopUpOpen, data, isLoading }: Props) => (
  <TableContainer className="mt-4">
    <Table>
      <THead>
        <Tr>
          <Th>Login</Th>
          <Th>Password</Th>
          <Th>Created At</Th>
          <Th className="w-5" />
        </Tr>
      </THead>
      <TBody>
        {isLoading && <TableSkeleton columns={5} innerKey="org-members" />}
        {data?.map((item) => (
          <Tr className="h-10 w-full transition-colors duration-100 hover:bg-mineshaft-700" key={item.id}>
            <Td className="text-mineshaft-400">{item.username}</Td>
            <Td className="text-mineshaft-400">{item.hashedPassword}</Td>
            <Td>{formatDate(item.createdAt)}</Td>
            <Td>
              <IconButton
                size="lg"
                colorSchema="danger"
                variant="plain"
                ariaLabel="update"
                onClick={() => handlePopUpOpen("removeHistory", { id: item.id })}
              >
                <FontAwesomeIcon icon={faTrash} />
              </IconButton>
            </Td>
          </Tr>
        ))}
        {!isLoading && !data?.length && (
          <Tr>
            <Td colSpan={3}>
              <EmptyState title="No credential history found" icon={faKey} />
            </Td>
          </Tr>
        )}
      </TBody>
    </Table>
  </TableContainer>
)
