import { FC } from "react";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import { Text, useColorModeValue } from "@chakra-ui/react";
import { Page } from "../components";
import { MasterNodeSenateCard } from "../components/WalletAddressCard";
import MasterNodeDelegateeSenateIcon from "../utils/assets/icons/MasterNodeDelegateeSenateIcon";
import {
  MasterNodeDelegateeSentateProvider,
  useMasterNodeDelegateeSentateContext,
} from "../contexts/MasterNodeDelegateeSentateContext";
import { Formik } from "formik";
import useFetchMasterNodeDelegatee from "../hooks/useFetchMasterNodeDelegatee";
import { toNormalDate } from "../utils/date";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { MasterNodeCommittee } from "../utils/networks";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import { MasterNodeAuthorizedButton } from "../components/Button/AuthorizedButton";
import { DefaultBox } from "../components/Box";
import { DefaultAlert } from "../components/Alerts";
import RulesOfDecisions from "../components/RulesOfDecisions";
import useFetchPluginProposalTypeDetails from "../hooks/useFetchPluginProposalTypeDetails";

export type UpdateOrJoinMasterNodeDelegateeType = {
  delegateeAddress: string;
};
const MasterNodeDelegatePage = () => {
  const { data: delegatees } = useFetchMasterNodeDelegatee();
  const communityName = MasterNodeCommittee;
  const totalMasterNodes = useFetchTotalNumbersByCommittee(communityName);
  const bgColor = useColorModeValue("gray.50", "gray.900");

  const { data: proposalTypes } = useFetchPluginProposalTypeDetails();

  return (
    <Page>
      <Formik
        initialValues={{
          delegateeAddress: "",
        }}
        onSubmit={() => {}}
      >
        <MasterNodeDelegateeSentateProvider>
          <>
            <DefaultBox mb={6}>
              <VStack>
                {totalMasterNodes != undefined && (
                  <MasterNodeDelegateeHeader
                    totalMasterNodes={parseInt(totalMasterNodes?.toString())}
                    totalJoined={delegatees.length}
                  />
                )}
              </VStack>
            </DefaultBox>
            <HStack flexDirection={["column", "column", "column", "row"]}>
              <DefaultBox w={["full", "full", "60%"]} alignSelf={"flex-start"}>
                <VStack>
                  {delegatees.length > 0 ? (
                    delegatees.map(
                      ({
                        member,
                        masterNode,
                        snapshotBlock,
                        txHash,
                        id,
                        creationDate,
                      }) => (
                        <MasterNodeSenateCard
                          key={id}
                          address={member}
                          joinedDate={toNormalDate(creationDate.toString())}
                          blockNumber={parseInt(snapshotBlock.toString())}
                          masterNodeAddress={masterNode}
                        />
                      )
                    )
                  ) : (
                    <>
                      <VStack
                        w={"100%"}
                        alignItems="center"
                        alignSelf={"center"}
                      >
                        <EmptyBoxIcon />
                        <Text
                          fontSize={"xs"}
                          fontWeight={"500"}
                          opacity={"0.5"}
                        >
                          {"There is no member yet."}
                        </Text>
                      </VStack>
                    </>
                  )}
                </VStack>
              </DefaultBox>
              {proposalTypes && proposalTypes?.length > 0 && (
                <DefaultBox
                  w={["full", "full", "40%"]}
                  alignSelf={"flex-start"}
                >
                  <RulesOfDecisions
                    communityName={communityName}
                    summary={"All below info demostrate how voting rules work."}
                    proposalTypes={proposalTypes}
                  />
                </DefaultBox>
              )}
            </HStack>
          </>
        </MasterNodeDelegateeSentateProvider>
      </Formik>
    </Page>
  );
};
interface MasterNodeDelegateeHeaderProps {
  totalJoined: number;
  totalMasterNodes: number;
}
const MasterNodeDelegateeHeader: FC<MasterNodeDelegateeHeaderProps> = ({
  totalJoined,
  totalMasterNodes,
}) => {
  const { handleToggleFormModal } = useMasterNodeDelegateeSentateContext();

  return (
    <>
      <HStack
        justifyContent={"space-between"}
        w={"full"}
        mb={4}
        flexDirection={["column", "column", "column", "row"]}
      >
        <Box>
          <HStack>
            <Box w={["60px", "50px"]} flexShrink={1}>
              <MasterNodeDelegateeSenateIcon />
            </Box>
            <Box>
              <Text fontSize={["lg", "xl"]} fontWeight={"bold"}>
                {" "}
                Master Nodes Delegatee Senate
              </Text>
              <Text fontSize={"xs"}>
                The set of Master Nodes who have joined DAOFIN by delegation
                mechanism.
              </Text>
            </Box>
          </HStack>
        </Box>
        <Box w={["full", "fit-content"]}>
          <MasterNodeAuthorizedButton
            w={["full", "inherit"]}
            colorScheme="blue"
            onClick={handleToggleFormModal}
          >
            Delegate a member
          </MasterNodeAuthorizedButton>
        </Box>
      </HStack>
      <HStack flexDirection={["column", "column", "column", "row"]}>
        <DefaultBox w={["full", "50%", "25%", "25%"]}>
          <VStack
            fontSize={"sm"}
            alignSelf={"normal"}
            alignItems={"flex-start"}
            justifyContent={"center"}
          >
            <Text>Total Master Nodes</Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {totalMasterNodes}
            </Text>
          </VStack>
        </DefaultBox>{" "}
        <DefaultBox w={["full", "50%", "25%", "25%"]}>
          <VStack
            fontSize={"sm"}
            alignSelf={"normal"}
            alignItems={"flex-start"}
            justifyContent={"center"}
          >
            <Text>Joined Master Nodes</Text>
            <Text fontSize={"lg"} fontWeight={"bold"}>
              {totalJoined}
            </Text>
          </VStack>
        </DefaultBox>
        <DefaultAlert w={["full", "50%"]} p={4}>
          <Box fontSize={"sm"}>
            <Text fontWeight={"semibold"}>
              How to modify one or multiple member?
            </Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur. Senectus elementum erat
              pellentesque nisl nibh. Vitae diam dolor convallis porta lacus.
            </Text>
          </Box>
        </DefaultAlert>
      </HStack>
    </>
  );
};
export default MasterNodeDelegatePage;
