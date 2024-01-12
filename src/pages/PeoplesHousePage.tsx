import PeoplesHouseDeposits from "../components/PeoplesHouseDeposits";
import { formatEther, parseEther } from "@ethersproject/units";
import {
  CHAIN_METADATA,
  PeoplesHouseCommittee,
  getPluginInstallationId,
} from "../utils/networks";
import usePeoplesHouseDeposits from "../hooks/useDeposits";
import { useDisclosure } from "@chakra-ui/hooks";
import useIsUserDeposited from "../hooks/useIsUserDeposited";
import { useNetwork } from "../contexts/network";
import { useClient } from "../hooks/useClient";
import { useWallet } from "../hooks/useWallet";
import { useAppGlobalConfig } from "../contexts/AppGlobalConfig";
import Modal from "../components/Modal/Modal";
import { FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightAddon } from "@chakra-ui/input";
import BoxWrapper from "../components/BoxWrapper";
import { Tooltip } from "@chakra-ui/tooltip";
import { Button } from "@chakra-ui/button";
import useDaoGlobalSettings from "../hooks/useDaoGlobalSettings";
import { Select } from "@chakra-ui/select";
import { option } from "yargs";
import { use } from "chai";
import WithConnectedWallet from "../components/WithConnectedWallet";
import useIsJudiciaryMember from "../hooks/useIsJudiciaryMember";
import React, { FC, useEffect, useMemo } from "react";
import ManageJudiciary from "../components/ManageJudiciary";
import { Box, HStack, VStack } from "@chakra-ui/layout";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { Page } from "../components";
import JudiciariesIcon from "../utils/assets/icons/JudiciariesIcon";
import { zeroAddress } from "viem";

import DefaultProgressBar from "../components/DefaultProgressBar";
import {
  WalletAddressCard,
  WalletAddressCardWithBalance,
  WalletAddressCardWithDate,
} from "../components/WalletAddressCard";
import {
  PeoplesHouseProvider,
  usePeopleHouseContext,
} from "../contexts/PeoplesHouseContext";
import { Formik } from "formik";
import { toStandardTimestamp } from "../utils/date";
import useFetchVoterDepositAmount from "../hooks/useFetchVoterDepositAmount";
import {
  numberWithCommaSeparate,
  toEther,
  weiBigNumberToFormattedNumber,
} from "../utils/numbers";
import { BigNumber } from "ethers";
import useFetchTotalNumbersByCommittee from "../hooks/useFetchTotalNumbersByCommittee";
import { EmptyBoxIcon } from "../utils/assets/icons/EmptyBoxIcon";
import {
  PeopleButton,
  WalletAuthorizedButton,
} from "../components/Button/AuthorizedButton";
export type JoinHouseFormType = {
  amount: string;
};
const PeoplesHousePage = () => {
  const { daoAddress, pluginAddress } = useAppGlobalConfig();

  const { address: voterAddress } = useWallet();

  const { daofinClient } = useClient();
  const { network } = useNetwork();
  const isUserDeposited = useIsUserDeposited(voterAddress ? voterAddress : "");
  const isJudiciaryMember = useIsJudiciaryMember(
    voterAddress ? voterAddress : ""
  );
  const totalSupply = useFetchTotalNumbersByCommittee(PeoplesHouseCommittee);
  const showAddNewButton = isJudiciaryMember || isUserDeposited;

  const { isOpen, onClose, onOpen } = useDisclosure();

  // const { setValue, getValues, register, watch } = useForm({
  //   defaultValues: {
  //     depositAmount: "",
  //   },
  // });
  // const depositAmount = watch(["depositAmount"]);

  const { data: deposits } = usePeoplesHouseDeposits();
  const globalSettings = useDaoGlobalSettings();
  const handleDeposit = async () => {
    // const { depositAmount } = getValues();
    // const parsedAmount = depositAmount;
    // const depositIterator = daofinClient?.methods.deposit(parsedAmount);
    // if (!depositIterator) return;
    // try {
    //   for await (const step of depositIterator) {
    //     switch (step.key) {
    //       case DepositSteps.DEPOSITING:
    //         console.log(step.txHash);
    //         break;
    //       case DepositSteps.DONE: {
    //         console.log("DONE", step.key, step.key);
    //         onClose();
    //         break;
    //       }
    //     }
    //   }
    // } catch (error) {
    //   console.log(error);
    // }
  };
  const totalDeposits = useMemo(
    () =>
      deposits && deposits.length > 0
        ? deposits.reduce((acc, { amount }) => {
            return BigNumber.from(amount).add(acc);
          }, BigNumber.from(0))
        : BigNumber.from(0),
    []
  );
  const bgColor = useColorModeValue("gray.50", "gray.900");
  return (
    <Page>
      <Formik
        initialValues={{
          amount: "",
        }}
        onSubmit={() => {}}
      >
        <>
          <PeoplesHouseProvider>
            <PeoplesHouseHeader
              totalMembers={deposits ? deposits.length : 0}
              totalDeposits={weiBigNumberToFormattedNumber(totalDeposits)}
              totalSupply={weiBigNumberToFormattedNumber(
                totalSupply ? totalSupply : 0
              )}
            />
            <HStack>
              <VStack w={["70%"]} alignSelf={"flex-start"}>
                {deposits && deposits.length > 0 ? (
                  deposits.map(
                    ({
                      amount,
                      id,
                      snapshotBlock,
                      voter,
                      depositDate,
                      txHash,
                    }) => (
                      <WalletAddressCardWithBalance
                        address={voter}
                        // date={new Date(toStandardTimestamp(depositDate))}
                        balance={weiBigNumberToFormattedNumber(amount)}
                        symbol={CHAIN_METADATA[network].nativeCurrency.symbol}
                      />
                    )
                  )
                ) : (
                  <>
                    <VStack
                      p={"6"}
                      bgColor={bgColor}
                      borderRadius={"md"}
                      w={"100%"}
                      alignItems="center"
                      alignSelf={"center"}
                    >
                      <EmptyBoxIcon />
                      <Text fontSize={"xs"} fontWeight={"500"} opacity={"0.5"}>
                        {"There is no member yet."}
                      </Text>
                    </VStack>
                  </>
                )}
              </VStack>
              <Box
                alignSelf={"flex-start"}
                boxShadow={"sm"}
                bgColor={useColorModeValue("gray.50", "gray.900")}
                opacity={0.9}
                borderRadius={"md"}
                p={6}
              >
                <Accordion>
                  <Box
                    borderRadius={"md"}
                    p={6}
                    bg={"blue.100"}
                    fontSize={"sm"}
                    mb={4}
                  >
                    <Text fontWeight={"semibold"}>Rules of Decisions</Text>
                    <Text>
                      This is where judiciaries can decide on how rules of
                      decisions are differentiated between various proposal
                      types
                    </Text>
                  </Box>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <Text fontWeight={"semibold"}>Grant</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <HStack justifyContent={"space-between"}>
                        <DefaultProgressBar
                          percentage={10}
                          threshold={50}
                          ProgressLabel={<Text fontSize={"sm"}>Threshold</Text>}
                        />
                        <Text fontSize={"sm"}>10%</Text>
                      </HStack>
                      <HStack>
                        <DefaultProgressBar
                          percentage={60}
                          threshold={50}
                          ProgressLabel={<Text fontSize={"sm"}>Pass Rate</Text>}
                        />
                        <Text fontSize={"sm"}>60%</Text>
                      </HStack>
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          <Text fontWeight={"semibold"}>Update Settings</Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <HStack justifyContent={"space-between"}>
                        <DefaultProgressBar
                          percentage={50}
                          threshold={60}
                          ProgressLabel={<Text fontSize={"sm"}>Threshold</Text>}
                        />
                        <Text fontSize={"sm"}>50%</Text>
                      </HStack>
                      <HStack>
                        <DefaultProgressBar
                          percentage={80}
                          threshold={70}
                          ProgressLabel={<Text fontSize={"sm"}>Pass Rate</Text>}
                        />
                        <Text fontSize={"sm"}>80%</Text>
                      </HStack>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Box>
            </HStack>
          </PeoplesHouseProvider>
        </>
      </Formik>
    </Page>
  );
};

interface PeoplesHouseHeaderType {
  totalMembers: number;
  totalDeposits: string;
  totalSupply: string;
}
const PeoplesHouseHeader: FC<PeoplesHouseHeaderType> = ({
  totalMembers,
  totalDeposits,
  totalSupply,
}) => {
  const { handleToggleFormModal } = usePeopleHouseContext();
  const { network } = useNetwork();
  return (
    <>
      <VStack
        boxShadow={"sm"}
        bgColor={useColorModeValue("gray.50", "gray.900")}
        borderRadius={"md"}
        p={6}
        mb={6}
      >
        <HStack justifyContent={"space-between"} w={"full"} mb={4}>
          <Box>
            <HStack>
              <Box w={"40px"} flexShrink={1}>
                <JudiciariesIcon />
              </Box>
              <Box>
                <Text fontSize={"md"} fontWeight={"bold"}>
                  {" "}
                  People’s House
                </Text>
                <Text fontSize={"xs"}>
                  This is the group of expert people who are selected during
                  initial deployment
                </Text>
              </Box>
            </HStack>
          </Box>
          <Box>
            <PeopleButton colorScheme="blue" onClick={handleToggleFormModal}>
              Join House
            </PeopleButton>
          </Box>
        </HStack>
        <HStack>
          <HStack w={"70%"}>
            <VStack
              borderRadius={"md"}
              p={6}
              w={["50%"]}
              fontSize={"sm"}
              border={"1px"}
              borderColor={"gray.100"}
              alignSelf={"normal"}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <Text>Deposited Tokens</Text>
              <Text fontSize={"lg"} fontWeight={"bold"}>
                {totalDeposits} {CHAIN_METADATA[network].nativeCurrency.symbol}
              </Text>
            </VStack>
            <VStack
              borderRadius={"md"}
              p={6}
              w={["50%"]}
              fontSize={"sm"}
              border={"1px"}
              borderColor={"gray.100"}
              alignSelf={"normal"}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <Text>Total Supply</Text>
              <Text fontSize={"lg"} fontWeight={"bold"} whiteSpace={"nowrap"}>
                {totalSupply} {CHAIN_METADATA[network].nativeCurrency.symbol}
              </Text>
            </VStack>{" "}
            <VStack
              borderRadius={"md"}
              p={6}
              w={["50%"]}
              fontSize={"sm"}
              border={"1px"}
              borderColor={"gray.100"}
              alignSelf={"normal"}
              alignItems={"flex-start"}
              justifyContent={"center"}
            >
              <Text>House Members</Text>
              <Text fontSize={"lg"} fontWeight={"bold"}>
                {numberWithCommaSeparate(totalMembers)}
              </Text>
            </VStack>
          </HStack>
          <Box
            borderRadius={"md"}
            p={6}
            w={["50%"]}
            bg={"blue.100"}
            fontSize={"sm"}
          >
            <Text fontWeight={"semibold"}>
              How to modify one or multiple member?
            </Text>
            <Text>
              Lorem ipsum dolor sit amet consectetur. Senectus elementum erat
              pellentesque nisl nibh. Vitae diam dolor convallis porta lacus.
              Rhoncus cursus a viverra cursus lobortis ut amet pulvinar. Sit
              mauris lectus libero lectus...
            </Text>
          </Box>
        </HStack>
      </VStack>
    </>
  );
};

export default PeoplesHousePage;
