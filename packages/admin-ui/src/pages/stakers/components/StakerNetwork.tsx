import React, { useState, useEffect } from "react";
import SubTitle from "components/SubTitle";
import { withToast } from "components/toast/Toast";
import Card from "components/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import {
  Network,
  ReqStatus,
  StakerConfigGet,
  StakerConfigSet,
  StakerItemOk
} from "types";
import { api, useApi } from "api";
import ErrorView from "components/ErrorView";
import { confirm } from "components/ConfirmDialog";
import MevBoost from "./columns/MevBoost";
import RemoteSigner from "./columns/RemoteSigner";
import ConsensusClient from "./columns/ConsensusClient";
import ExecutionClient from "./columns/ExecutionClient";
import Button from "components/Button";
import AdvanceView from "./AdvanceView";
import { disclaimer } from "../data";
import Loading from "components/Loading";
import {
  areChangesAllowed,
  isOkSelectedInstalledAndRunning,
  validateEthereumAddress,
  validateGraffiti
} from "./utils";
import { responseInterface } from "swr";

export default function StakerNetwork<T extends Network>({
  network,
  description
}: {
  network: T;
  description: string;
}) {
  // Error
  const [feeRecipientError, setFeeRecipientError] = useState<string | null>(
    null
  );
  const [graffitiError, setGraffitiError] = useState<string | null>(null);
  // Req
  const [reqStatus, setReqStatus] = useState<ReqStatus>({});
  // New config
  const [newExecClient, setNewExecClient] = useState<
    StakerItemOk<T, "execution">
  >();
  const [newConsClient, setNewConsClient] = useState<
    StakerItemOk<T, "consensus">
  >();
  const [newMevBoost, setNewMevBoost] = useState<
    StakerItemOk<T, "mev-boost">
  >();
  const [newEnableWeb3signer, setNewEnableWeb3signer] = useState<boolean>(
    false
  );

  // Default config
  const [defaultGraffiti, setDefaultGraffiti] = useState<string>("");
  const [defaultFeeRecipient, setDefaultFeeRecipient] = useState<string>("");
  const [defaultCheckpointSync, setDefaultCheckpointSync] = useState<string>(
    ""
  );
  // Apply button state
  const [isApplyAllowed, setIsApplyAllowed] = useState(false);
  const [currentStakerConfig, setCurrentStakerConfig] = useState<
    StakerConfigSet<T>
  >();

  const currentStakerConfigReq = useApi.stakerConfigGet(
    network
  ) as responseInterface<StakerConfigGet<T>, Error>;

  useEffect(() => {
    if (currentStakerConfigReq.data) {
      const {
        executionClients,
        consensusClients,
        mevBoost,
        web3Signer
      } = currentStakerConfigReq.data;

      const executionClient = executionClients.find(ec =>
        isOkSelectedInstalledAndRunning(ec)
      );
      const consensusClient = consensusClients.find(cc =>
        isOkSelectedInstalledAndRunning(cc)
      );
      const enableWeb3signer = isOkSelectedInstalledAndRunning(web3Signer);

      if (executionClient && executionClient.status === "ok")
        setNewExecClient(executionClient);
      if (consensusClient && consensusClient.status === "ok")
        setNewConsClient(consensusClient);
      if (mevBoost && mevBoost.status === "ok") setNewMevBoost(mevBoost);
      setNewEnableWeb3signer(enableWeb3signer);

      // Set the current config to be displayed in advance view
      setCurrentStakerConfig({
        network,
        executionClient:
          executionClient?.status === "ok" ? executionClient : undefined,
        consensusClient:
          consensusClient?.status === "ok" ? consensusClient : undefined,
        mevBoost: newMevBoost,
        enableWeb3signer
      });

      // Set default consensus client: fee recipient, checkpointsync and graffiti
      if (consensusClient && consensusClient.status === "ok") {
        if (!consensusClient.checkpointSync) {
          const defaultCheckpointSync =
            network === "mainnet"
              ? "https://checkpoint-sync.dappnode.io"
              : network === "prater"
              ? "https://checkpoint-sync-prater.dappnode.io"
              : "";
          setNewConsClient({
            ...consensusClient,
            checkpointSync: defaultCheckpointSync
          });
          setDefaultCheckpointSync(defaultCheckpointSync);
        } else {
          setDefaultCheckpointSync(consensusClient.checkpointSync);
        }
        if (!consensusClient.graffiti) {
          const defaultGraffiti = "validating_from_DAppNode";
          setNewConsClient({
            ...consensusClient,
            graffiti: defaultGraffiti
          });
          setDefaultGraffiti(defaultGraffiti);
        } else {
          setDefaultGraffiti(consensusClient.graffiti);
        }
        if (consensusClient.feeRecipient) {
          setDefaultFeeRecipient(consensusClient.feeRecipient);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStakerConfigReq.data]);

  useEffect(() => {
    if (newConsClient) {
      setFeeRecipientError(validateEthereumAddress(newConsClient.feeRecipient));
      setGraffitiError(validateGraffiti(newConsClient.graffiti));
    }
  }, [newConsClient]);

  useEffect(() => {
    if (currentStakerConfig) {
      if (
        areChangesAllowed({
          currentStakerConfig,
          feeRecipientError,
          graffitiError,
          newConsClient,
          newMevBoost,
          newEnableWeb3signer,
          newExecClient
        })
      ) {
        setIsApplyAllowed(true);
      } else setIsApplyAllowed(false);
    } else {
      setIsApplyAllowed(false);
    }
  }, [
    currentStakerConfig,
    feeRecipientError,
    graffitiError,
    newConsClient,
    newMevBoost,
    newEnableWeb3signer,
    newExecClient
  ]);

  /**
   * Set new staker config
   */
  async function setNewConfig() {
    try {
      // Make sure there are changes
      if (isApplyAllowed) {
        // TODO: Ask for removing the previous Execution Client and/or Consensus Client if its different
        await new Promise((resolve: (confirmOnSetConfig: boolean) => void) => {
          confirm({
            title: `Staker configuration`,
            text:
              "Are you sure you want to implement this staker configuration?",
            buttons: [
              {
                label: "Continue",
                onClick: () => resolve(true)
              }
            ]
          });
        });
        await new Promise((resolve: (confirmOnSetConfig: boolean) => void) => {
          confirm({
            title: `Disclaimer`,
            text: disclaimer,
            buttons: [
              {
                label: "Continue",
                onClick: () => resolve(true)
              }
            ]
          });
        });
        setReqStatus({ loading: true });
        await withToast(
          () =>
            api.stakerConfigSet({
              stakerConfig: {
                network,
                executionClient: newExecClient,
                consensusClient: newConsClient,
                mevBoost: newMevBoost,
                enableWeb3signer: newEnableWeb3signer
              }
            }),
          {
            message: `Setting new staker configuration...`,
            onSuccess: `Successfully set new staker configuration`,
            onError: `Error setting new staker configuration`
          }
        );
        setReqStatus({ result: true });
      }
    } catch (e) {
      setReqStatus({ error: e });
    } finally {
      setReqStatus({ loading: true });
      await withToast(() => currentStakerConfigReq.revalidate(), {
        message: `Getting new ${network} staker configuration`,
        onSuccess: `Successfully loaded ${network} staker configuration`,
        onError: `Error new loading ${network} staker configuration`
      });
      setReqStatus({ loading: false });
    }
  }

  return (
    <>
      {currentStakerConfigReq.data ? (
        <Card>
          <p>
            Set up your Proof-of-Stake validator configuration for Ethereum and
            Ethereum-based chains. You will need to: <br />
            (1) Choose an Execution Layer client <br />
            (2) Choose a Consensus Layer client (+ validator) <br />
            (3) Install the web3signer, which will hold the validator keys and
            sign <br />
            (4) Optional; delegate block-building capacities through the MEV
            Boost network and potentially profit from MEV
          </p>
          <br />
          <p>{description}</p>
          <Row className="staker-network">
            <Col>
              <SubTitle>Execution Clients</SubTitle>
              {currentStakerConfigReq.data.executionClients.map(
                (executionClient, i) => (
                  <ExecutionClient<T>
                    key={i}
                    executionClient={executionClient}
                    setNewExecClient={setNewExecClient}
                    isSelected={
                      executionClient.dnpName === newExecClient?.dnpName
                        ? true
                        : false
                    }
                  />
                )
              )}
            </Col>

            <Col>
              <SubTitle>Consensus Clients</SubTitle>
              {currentStakerConfigReq.data.consensusClients.map(
                (consensusClient, i) => (
                  <ConsensusClient<T>
                    key={i}
                    consensusClient={consensusClient}
                    setNewConsClient={setNewConsClient}
                    newConsClient={newConsClient}
                    isSelected={
                      consensusClient.dnpName === newConsClient?.dnpName
                        ? true
                        : false
                    }
                    graffitiError={graffitiError}
                    feeRecipientError={feeRecipientError}
                    defaultGraffiti={defaultGraffiti}
                    defaultFeeRecipient={defaultFeeRecipient}
                    defaultCheckpointSync={defaultCheckpointSync}
                  />
                )
              )}
            </Col>

            <Col>
              <SubTitle>Remote signer</SubTitle>
              <RemoteSigner
                signer={currentStakerConfigReq.data.web3Signer}
                setEnableWeb3signer={setNewEnableWeb3signer}
                isSelected={newEnableWeb3signer}
              />
            </Col>
            {network === "prater" && (
              <Col>
                <SubTitle>Mev Boost</SubTitle>
                <MevBoost
                  network={network}
                  mevBoost={currentStakerConfigReq.data.mevBoost}
                  setNewMevBoost={setNewMevBoost}
                  isSelected={newMevBoost?.dnpName ? true : false}
                />
              </Col>
            )}
          </Row>

          <hr />

          <div>
            {currentStakerConfig && (
              <AdvanceView<T>
                currentStakerConfig={currentStakerConfig}
                newStakerConfig={{
                  network,
                  executionClient: newExecClient,
                  consensusClient: newConsClient,
                  mevBoost: newMevBoost,
                  enableWeb3signer: newEnableWeb3signer
                }}
                defaultGraffiti={defaultGraffiti}
                defaultFeeRecipient={defaultFeeRecipient}
                defaultCheckpointSync={defaultCheckpointSync}
              />
            )}

            <Button
              variant="dappnode"
              disabled={!isApplyAllowed || reqStatus.loading}
              onClick={setNewConfig}
            >
              Apply changes
            </Button>

            {reqStatus.error && (
              <ErrorView error={reqStatus.error} hideIcon red />
            )}
          </div>
        </Card>
      ) : currentStakerConfigReq.error ? (
        <ErrorView error={currentStakerConfigReq.error} hideIcon red />
      ) : currentStakerConfigReq.isValidating ? (
        <Loading steps={[`Loading ${network} staker configuration`]} />
      ) : (
        <ErrorView error={"No data"} hideIcon red />
      )}
    </>
  );
}
