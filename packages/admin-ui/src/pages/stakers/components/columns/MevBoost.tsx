import React, { useState } from "react";
import Card from "components/Card";
import { prettyDnpName } from "utils/format";
import { joinCssClass } from "utils/css";
import { StakerItem, StakerItemOk } from "common";
import "./columns.scss";
import defaultAvatar from "img/defaultAvatar.png";
import errorAvatar from "img/errorAvatarTrim.png";
import Button from "components/Button";
import { MdCheck, MdClose } from "react-icons/md";
import { rootPath as installedRootPath } from "pages/installer";
import { Link } from "react-router-dom";
import { Network } from "types";
import { Table } from "react-bootstrap";
import { Form } from "react-bootstrap";

export default function MevBoost<T extends Network>({
  network,
  mevBoost,
  setNewMevBoost,
  isSelected,
  ...props
}: {
  network: T;
  mevBoost: StakerItem<T, "mev-boost">;
  setNewMevBoost: React.Dispatch<
    React.SetStateAction<StakerItemOk<T, "mev-boost"> | undefined>
  >;
  isSelected: boolean;
}) {
  const [newRelays, setNewRelays] = useState<string[]>(mevBoost.relays || []);
  return (
    <Card
      {...props}
      className={`mev-boost ${joinCssClass({ isSelected })}`}
      onClick={
        mevBoost.status === "ok"
          ? isSelected
            ? () => setNewMevBoost(undefined)
            : () =>
                setNewMevBoost({
                  ...mevBoost,
                  relays: newRelays
                })
          : undefined
      }
      shadow={isSelected}
    >
      {mevBoost.status === "ok" ? (
        <div className="avatar">
          <img src={mevBoost.avatarUrl || defaultAvatar} alt="avatar" />
        </div>
      ) : mevBoost.status === "error" ? (
        <div className="avatar">
          <img src={errorAvatar} alt="avatar" />
        </div>
      ) : null}

      <div className="title">{prettyDnpName(mevBoost.dnpName)} </div>

      {mevBoost.status === "ok" &&
        isSelected &&
        mevBoost.isInstalled &&
        !mevBoost.isUpdated && (
          <>
            <Link to={`${installedRootPath}/${mevBoost.dnpName}`}>
              <Button variant="dappnode">UPDATE</Button>
            </Link>
            <br />
            <br />
          </>
        )}

      {mevBoost.status === "ok" && isSelected && (
        <RelaysList
          network={network}
          newRelays={newRelays}
          setNewRelays={setNewRelays}
        />
      )}

      {mevBoost.status === "ok" && (
        <div className="description">
          {isSelected && mevBoost.metadata.shortDescription}
        </div>
      )}
    </Card>
  );
}

function RelaysList({
  network,
  newRelays,
  setNewRelays
}: {
  network: Network;
  newRelays: string[];
  setNewRelays: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const defaultRelays =
    network === "mainnet"
      ? mainnetRelays
      : network === "prater"
      ? goerliRelays
      : [];
  if (defaultRelays.length > 0)
    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Relay</th>
            <th>OFAC compliant</th>
            <th>Enable/disable</th>
          </tr>
        </thead>
        <tbody>
          {defaultRelays.map((relay, index) => {
            return (
              <tr key={index}>
                <td>{relay.operator}</td>
                <td>
                  {relay.ofacCompliant === undefined ? (
                    "-"
                  ) : relay.ofacCompliant ? (
                    <MdCheck color="#1ccec0" />
                  ) : (
                    <MdClose color="#ff0000" />
                  )}
                </td>
                <td>
                  <Form.Check
                    type={"radio"}
                    onChange={() => {
                      if (!newRelays.includes(relay.url))
                        setNewRelays([...newRelays, relay.url]);
                      else
                        setNewRelays(
                          newRelays.filter(item => item !== relay.url)
                        );
                    }}
                    checked={newRelays.includes(relay.url)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  return null;
}

interface Relay {
  operator: string;
  url: string;
  ofacCompliant?: boolean;
}

const goerliRelays: Relay[] = [
  {
    operator: "Flashbots",
    url:
      "https://0xafa4c6985aa049fb79dd37010438cfebeb0f2bd42b115b89dd678dab0670c1de38da0c4e9138c9290a398ecd9a0b3110@builder-relay-goerli.flashbots.net"
  },
  {
    operator: "bloXroute",
    url:
      "https://0x821f2a65afb70e7f2e820a925a9b4c80a159620582c1766b1b09729fec178b11ea22abb3a51f07b288be815a1a2ff516@bloxroute.max-profit.builder.goerli.blxrbdn.com"
  },
  {
    operator: "Blocknative",
    url:
      "https://0x8f7b17a74569b7a57e9bdafd2e159380759f5dc3ccbd4bf600414147e8c4e1dc6ebada83c0139ac15850eb6c975e82d0@builder-relay-goerli.blocknative.com"
  },
  {
    operator: "Eden Network",
    url:
      "https://0xb1d229d9c21298a87846c7022ebeef277dfc321fe674fa45312e20b5b6c400bfde9383f801848d7837ed5fc449083a12@relay-goerli.edennetwork.io"
  },
  {
    operator: "Manifold",
    url:
      "https://0x8a72a5ec3e2909fff931c8b42c9e0e6c6e660ac48a98016777fc63a73316b3ffb5c622495106277f8dbcc17a06e92ca3@goerli-relay.securerpc.com/"
  }
];

const mainnetRelays: Relay[] = [
  {
    operator: "Flashbots",
    ofacCompliant: true,
    url:
      "https://0xac6e77dfe25ecd6110b8e780608cce0dab71fdd5ebea22a16c0205200f2f8e2e3ad3b71d3499c54ad14d6c21b41a37ae@boost-relay.flashbots.net"
  },
  {
    operator: "bloXroute (1)",
    ofacCompliant: false,
    url:
      "https://0x8b5d2e73e2a3a55c6c87b8b6eb92e0149a125c852751db1422fa951e42a09b82c142c3ea98d0d9930b056a3bc9896b8f@bloxroute.max-profit.blxrbdn.com"
  },
  {
    operator: "bloXroute (2)",
    ofacCompliant: false,
    url:
      "https://0xad0a8bb54565c2211cee576363f3a347089d2f07cf72679d16911d740262694cadb62d7fd7483f27afd714ca0f1b9118@bloxroute.ethical.blxrbdn.com"
  },
  {
    operator: "bloXroute (3)",
    ofacCompliant: false,
    url:
      "https://0xb0b07cd0abef743db4260b0ed50619cf6ad4d82064cb4fbec9d3ec530f7c5e6793d9f286c4e082c0244ffb9f2658fe88@bloxroute.regulated.blxrbdn.com"
  },
  {
    operator: "Blocknative",
    ofacCompliant: true,
    url:
      "https://0x9000009807ed12c1f08bf4e81c6da3ba8e3fc3d953898ce0102433094e5f22f21102ec057841fcb81978ed1ea0fa8246@builder-relay-mainnet.blocknative.com"
  },
  {
    operator: "Eden Network",
    ofacCompliant: true,
    url:
      "https://0xb3ee7afcf27f1f1259ac1787876318c6584ee353097a50ed84f51a1f21a323b3736f271a895c7ce918c038e4265918be@relay.edennetwork.io"
  },
  {
    operator: "Anonymous",
    ofacCompliant: false,
    url:
      "https://0x84e78cb2ad883861c9eeeb7d1b22a8e02332637448f84144e245d20dff1eb97d7abdde96d4e7f80934e5554e11915c56@relayooor.wtf"
  }
];
