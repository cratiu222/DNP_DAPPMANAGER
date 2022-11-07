import { packageGet } from "../../calls";
import { getIsInstalled, getIsUpdated } from "../../calls/fetchDnpRequest";
import {
  ConsensusClient,
  ExececutionClient,
  MevBoost,
  Network,
  Signer,
  StakerConfigGet,
  StakerItem
} from "../../types";
import { fileToGatewayUrl } from "../../utils/distributedFile";
import { listPackages } from "../docker/list";
import { ReleaseFetcher } from "../release";
import {
  getBeaconServiceName,
  getIsRunning,
  getStakerParamsByNetwork,
  getValidatorServiceName,
  pickStakerItemMetadata
} from "./utils";

/**
 * Fetches the current staker configuration:
 * - execution clients: isInstalled and isSelected
 * - consensus clients: isInstalled and isSelected
 * - web3signer: isInstalled and isSelected
 * - mevBoost: isInstalled and isSelected
 * - graffiti
 * - fee recipient address
 * - checkpoint sync url
 * @param network
 */
export async function getStakerConfig<T extends Network>(
  network: Network
): Promise<StakerConfigGet<T>> {
  try {
    const releaseFetcher = new ReleaseFetcher();

    const {
      execClients,
      currentExecClient,
      consClients,
      currentConsClient,
      web3signer,
      mevBoost,
      isMevBoostSelected
    } = getStakerParamsByNetwork(network);

    const dnpList = await listPackages();

    return {
      executionClients: await Promise.all(
        execClients.map(async execClient => {
          try {
            if (!(await releaseFetcher.repoExists(execClient.dnpName)))
              throw Error(`Repository ${execClient.dnpName} does not exist`);
            const repository = await releaseFetcher.getRelease(
              execClient.dnpName
            );
            return {
              status: "ok",
              dnpName: repository.dnpName as ExececutionClient<T>,
              avatarUrl: fileToGatewayUrl(repository.avatarFile),
              isInstalled: getIsInstalled(repository, dnpList),
              isUpdated: getIsUpdated(repository, dnpList),
              isRunning: getIsRunning(repository, dnpList),
              metadata: pickStakerItemMetadata(repository.metadata),
              isSelected: repository.dnpName === currentExecClient
            };
          } catch (error) {
            return {
              status: "error",
              dnpName: execClient.dnpName as ExececutionClient<T>,
              error
            };
          }
        })
      ),
      consensusClients: await Promise.all(
        consClients.map(async consClient => {
          try {
            if (!(await releaseFetcher.repoExists(consClient.dnpName)))
              throw Error(`Repository ${consClient.dnpName} does not exist`);
            const repository = await releaseFetcher.getRelease(
              consClient.dnpName
            );
            const isInstalled = getIsInstalled(repository, dnpList);
            let graffiti, feeRecipient, checkpointSync;
            if (isInstalled) {
              const pkgEnv = (await packageGet({ dnpName: repository.dnpName }))
                .userSettings?.environment;
              if (pkgEnv) {
                const validatorService = getValidatorServiceName(
                  repository.dnpName
                );
                const beaconService = getBeaconServiceName(repository.dnpName);
                graffiti = pkgEnv[validatorService]["GRAFFITI"];
                feeRecipient =
                  pkgEnv[validatorService]["FEE_RECIPIENT_ADDRESS"];
                checkpointSync = pkgEnv[beaconService]["CHECKPOINT_SYNC_URL"];
              }
            }
            return {
              status: "ok",
              dnpName: repository.dnpName as ConsensusClient<T>,
              avatarUrl: fileToGatewayUrl(repository.avatarFile),
              isInstalled: getIsInstalled(repository, dnpList),
              isUpdated: getIsUpdated(repository, dnpList),
              isRunning: getIsRunning(repository, dnpList),
              metadata: pickStakerItemMetadata(repository.metadata),
              isSelected: repository.dnpName === currentConsClient,
              graffiti,
              feeRecipient,
              checkpointSync
            };
          } catch (error) {
            return {
              status: "error",
              dnpName: consClient.dnpName as ConsensusClient<T>,
              error
            };
          }
        })
      ),
      web3Signer: await new Promise<StakerItem<T, "signer">>(async resolve => {
        try {
          if (!(await releaseFetcher.repoExists(web3signer.dnpName)))
            throw Error(`Repository ${web3signer.dnpName} does not exist`);
          const repository = await releaseFetcher.getRelease(
            web3signer.dnpName
          );
          const signerIsRunning = getIsRunning(repository, dnpList);
          resolve({
            status: "ok",
            dnpName: repository.dnpName as Signer<T>,
            avatarUrl: fileToGatewayUrl(repository.avatarFile),
            isInstalled: getIsInstalled(repository, dnpList),
            isUpdated: getIsUpdated(repository, dnpList),
            isRunning: signerIsRunning,
            metadata: pickStakerItemMetadata(repository.metadata),
            isSelected: signerIsRunning
          });
        } catch (error) {
          resolve({
            status: "error",
            dnpName: web3signer.dnpName as Signer<T>,
            error
          });
        }
      }),
      mevBoost: await new Promise<StakerItem<T, "mev-boost">>(async resolve => {
        try {
          if (!(await releaseFetcher.repoExists(mevBoost)))
            throw Error(`Repository ${mevBoost} does not exist`);
          const repository = await releaseFetcher.getRelease(mevBoost);
          const isInstalled = getIsInstalled(repository, dnpList);
          const relays: string[] = [];
          if (isInstalled) {
            const pkgEnv = (await packageGet({ dnpName: repository.dnpName }))
              .userSettings?.environment;
            if (pkgEnv) {
              pkgEnv["mev-boost"]["RELAYS"]
                .split(",")
                .forEach(relay => relays.push(relay));
            }
          }
          resolve({
            status: "ok",
            dnpName: repository.dnpName as MevBoost<T>,
            avatarUrl: fileToGatewayUrl(repository.avatarFile),
            isInstalled,
            isUpdated: getIsUpdated(repository, dnpList),
            isRunning: getIsRunning(repository, dnpList),
            metadata: pickStakerItemMetadata(repository.metadata),
            isSelected: isMevBoostSelected,
            relays
          });
        } catch (error) {
          resolve({
            status: "error",
            dnpName: mevBoost as MevBoost<T>,
            error
          });
        }
      })
    };
  } catch (e) {
    throw Error(`Error getting staker config: ${e}`);
  }
}
