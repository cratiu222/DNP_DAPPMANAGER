import {
  dockerCreateNetwork,
  dockerListNetworks,
  dockerNetworkConnect,
  dockerNetworkDisconnect
} from "../docker";
import { listContainers } from "../docker/list";
import params from "../../params";
import { getExternalNetworkAlias } from "../../domains";
import {
  PackageContainer,
  HttpsPortalMapping,
  HttpsLocalProxyingStatus
} from "../../types";
import { HttpsPortalApiClient } from "./apiClient";
import { addNetworkAliasCompose, removeNetworkAliasCompose } from "./utils";
import { packageSetEnvironment } from "../../calls";
export { addAliasToRunningContainersMigration } from "./migration";
export { HttpsPortalApiClient };
export { getExposableServices } from "./exposable";

const externalNetworkName = params.DNP_EXTERNAL_NETWORK_NAME;

export class HttpsPortal {
  private httpsPortalApiClient: HttpsPortalApiClient;

  constructor(httpsPortalApiClient: HttpsPortalApiClient) {
    this.httpsPortalApiClient = httpsPortalApiClient;
  }

  /**
   * Expose an internal container to the external internet through the https-portal
   */
  async addMapping(mapping: HttpsPortalMapping): Promise<void> {
    const containers = await listContainers();
    const container = await this.getContainerForMapping(mapping, containers);

    const externalNetworkAlias = getExternalNetworkAlias(container);
    const aliases = [externalNetworkAlias];

    // Call Http Portal API to add the mapping
    await this.httpsPortalApiClient.add({
      fromSubdomain: mapping.fromSubdomain,
      toHost: `${externalNetworkAlias}:${mapping.port}`
    });

    // Ensure network exists
    const networks = await dockerListNetworks();
    if (!networks.find(network => network.Name === externalNetworkName)) {
      await dockerCreateNetwork(externalNetworkName);
    }

    // Ensure the HTTPs portal container is connected to `externalNetworkName`
    const httpsPortalContainer = containers.find(
      c => c.dnpName === params.HTTPS_PORTAL_DNPNAME
    );
    if (!httpsPortalContainer) throw Error(`HTTPs portal container not found`);
    if (!this.isConnected(httpsPortalContainer)) {
      await dockerNetworkConnect(
        externalNetworkName,
        httpsPortalContainer.containerName
      );
    }

    // Container joins external network with a designated alias (immediate)
    // Check first is it's already connected, or dockerNetworkConnect throws
    if (!this.isConnected(container)) {
      await dockerNetworkConnect(externalNetworkName, container.containerName, {
        Aliases: aliases
      });
    }

    // Edit compose to persist the setting
    addNetworkAliasCompose(container, externalNetworkName, aliases);
  }

  /**
   * Remove an internal container from being exposed to the external internet
   */
  async removeMapping(mapping: HttpsPortalMapping): Promise<void> {
    const containers = await listContainers();
    const container = await this.getContainerForMapping(mapping, containers);

    const externalNetworkAlias = getExternalNetworkAlias(container);

    // Call Http Portal API to remove the mapping
    await this.httpsPortalApiClient.remove({
      fromSubdomain: mapping.fromSubdomain,
      toHost: externalNetworkAlias
    });

    // If container still has mappings, don't disconnect from network
    const mappings = await this.getMappings(containers);
    const containerHasMappings = mappings.some(
      mapping =>
        mapping.dnpName === container.dnpName &&
        mapping.serviceName === container.serviceName
    );
    if (containerHasMappings) return;

    // Container leaves external network
    // Check first is it's connected, or dockerNetworkDisconnect throws
    if (this.isConnected(container)) {
      await dockerNetworkDisconnect(
        externalNetworkName,
        container.containerName
      );
    }

    // Edit compose to persist the setting
    removeNetworkAliasCompose(container, externalNetworkName);
  }

  async getMappings(
    containers?: PackageContainer[]
  ): Promise<HttpsPortalMapping[]> {
    if (!containers) containers = await listContainers();

    const entries = await this.httpsPortalApiClient.list();

    const aliases = new Map<string, PackageContainer>();
    for (const container of containers) {
      const externalNetworkAlias = getExternalNetworkAlias(container);
      aliases.set(externalNetworkAlias, container);
    }

    const mappings: HttpsPortalMapping[] = [];
    for (const { fromSubdomain, toHost } of entries) {
      const [alias, port] = toHost.split(":");
      const container = aliases.get(alias);
      if (container) {
        mappings.push({
          fromSubdomain,
          dnpName: container.dnpName,
          serviceName: container.serviceName,
          port: parseInt(port) || 80
        });
      }
    }
    return mappings;
  }

  async localProxyingEnableDisable(
    enable: HttpsLocalProxyingStatus
  ): Promise<void> {
    await packageSetEnvironment({
      dnpName: params.HTTPS_PORTAL_DNPNAME,
      environmentByService: {
        [params.HTTPS_PORTAL_MAIN_SERVICE]: {
          [params.HTTPS_PORTAL_LOCAL_PROXYING_ENVNAME]: enable
        }
      }
    });
  }

  private async getContainerForMapping(
    mapping: HttpsPortalMapping,
    containers?: PackageContainer[]
  ): Promise<PackageContainer> {
    if (!containers) containers = await listContainers();

    const container = containers.find(
      c =>
        c.dnpName === mapping.dnpName && c.serviceName === mapping.serviceName
    );
    if (!container)
      throw Error(
        `No container found for ${mapping.dnpName} ${mapping.serviceName}`
      );

    return container;
  }

  private isConnected(container: PackageContainer): boolean {
    return container.networks.some(n => n.name === externalNetworkName);
  }
}
