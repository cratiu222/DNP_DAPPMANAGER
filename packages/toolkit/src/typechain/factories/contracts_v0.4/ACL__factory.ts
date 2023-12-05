/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { ethers } from "ethers";
import type { ContractTransactionResponse } from "ethers";
import type { Signer, ContractDeployTransaction, ContractRunner } from "ethers";
import type { NonPayableOverrides } from "../../common.js";
import type { ACL, ACLInterface } from "../../contracts_v0.4/ACL.js";

const _abi = [
  {
    constant: true,
    inputs: [],
    name: "CREATE_PERMISSIONS_ROLE",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "EVMSCRIPT_REGISTRY_APP_ID",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "",
        type: "bytes32",
      },
      {
        name: "",
        type: "uint256",
      },
    ],
    name: "permissionParams",
    outputs: [
      {
        name: "id",
        type: "uint8",
      },
      {
        name: "op",
        type: "uint8",
      },
      {
        name: "value",
        type: "uint240",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "appId",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getInitializationBlock",
    outputs: [
      {
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "EVMSCRIPT_REGISTRY_APP",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_sender",
        type: "address",
      },
      {
        name: "_role",
        type: "bytes32",
      },
      {
        name: "params",
        type: "uint256[]",
      },
    ],
    name: "canPerform",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "EMPTY_PARAM_HASH",
    outputs: [
      {
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "kernel",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_script",
        type: "bytes",
      },
    ],
    name: "getExecutor",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "entity",
        type: "address",
      },
      {
        indexed: true,
        name: "app",
        type: "address",
      },
      {
        indexed: true,
        name: "role",
        type: "bytes32",
      },
      {
        indexed: false,
        name: "allowed",
        type: "bool",
      },
    ],
    name: "SetPermission",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: "app",
        type: "address",
      },
      {
        indexed: true,
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        name: "manager",
        type: "address",
      },
    ],
    name: "ChangePermissionManager",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_permissionsCreator",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_entity",
        type: "address",
      },
      {
        name: "_app",
        type: "address",
      },
      {
        name: "_role",
        type: "bytes32",
      },
      {
        name: "_manager",
        type: "address",
      },
    ],
    name: "createPermission",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_entity",
        type: "address",
      },
      {
        name: "_app",
        type: "address",
      },
      {
        name: "_role",
        type: "bytes32",
      },
    ],
    name: "grantPermission",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_entity",
        type: "address",
      },
      {
        name: "_app",
        type: "address",
      },
      {
        name: "_role",
        type: "bytes32",
      },
      {
        name: "_params",
        type: "uint256[]",
      },
    ],
    name: "grantPermissionP",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_entity",
        type: "address",
      },
      {
        name: "_app",
        type: "address",
      },
      {
        name: "_role",
        type: "bytes32",
      },
    ],
    name: "revokePermission",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        name: "_newManager",
        type: "address",
      },
      {
        name: "_app",
        type: "address",
      },
      {
        name: "_role",
        type: "bytes32",
      },
    ],
    name: "setPermissionManager",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_app",
        type: "address",
      },
      {
        name: "_role",
        type: "bytes32",
      },
    ],
    name: "getPermissionManager",
    outputs: [
      {
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_who",
        type: "address",
      },
      {
        name: "_where",
        type: "address",
      },
      {
        name: "_what",
        type: "bytes32",
      },
    ],
    name: "hasPermission",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_who",
        type: "address",
      },
      {
        name: "_where",
        type: "address",
      },
      {
        name: "_what",
        type: "bytes32",
      },
      {
        name: "_how",
        type: "uint256[]",
      },
    ],
    name: "hasPermission",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        name: "_who",
        type: "address",
      },
      {
        name: "_where",
        type: "address",
      },
      {
        name: "_what",
        type: "bytes32",
      },
      {
        name: "_how",
        type: "bytes",
      },
    ],
    name: "hasPermission",
    outputs: [
      {
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x6060604052341561000f57600080fd5b6116548061001e6000396000f3006060604052600436106100f85763ffffffff60e060020a6000350416630a8ed3db81146100fd5780633d6ab68f1461012757806360b1e0571461014c5780636815c9921461015f5780636d6712d8146101c9578063710a83151461020557806380afdea8146102525780638b3dd749146102655780639b3fdf4c146102785780639d0effdb1461028b578063a1658fad146102b3578063afd925df14610316578063b19057271461033e578063be0384781461037c578063c4d66de8146103ab578063c513f66e146103ca578063d4aae0c4146103dd578063f520b58d146103f0578063f92a79ff1461045a578063fdef9106146104ab575b600080fd5b341561010857600080fd5b610125600160a060020a0360043581169060243516604435610517565b005b341561013257600080fd5b61013a610547565b60405190815260200160405180910390f35b341561015757600080fd5b61013a61057b565b341561016a57600080fd5b610125600160a060020a036004803582169160248035909116916044359160849060643590810190830135806020818102016040519081016040528093929190818152602001838360200280828437509496506105af95505050505050565b34156101d457600080fd5b6101f1600160a060020a0360043581169060243516604435610632565b604051901515815260200160405180910390f35b341561021057600080fd5b61021e600435602435610673565b60405160ff9384168152919092166020820152600160f060020a039091166040808301919091526060909101905180910390f35b341561025d57600080fd5b61013a6106bb565b341561027057600080fd5b61013a6106c1565b341561028357600080fd5b61013a6106c8565b341561029657600080fd5b610125600160a060020a0360043581169060243516604435610744565b34156102be57600080fd5b6101f160048035600160a060020a031690602480359190606490604435908101908301358060208082020160405190810160405280939291908181526020018383602002808284375094965061079995505050505050565b341561032157600080fd5b610125600160a060020a03600435811690602435166044356108d7565b341561034957600080fd5b610360600160a060020a036004351660243561090d565b604051600160a060020a03909116815260200160405180910390f35b341561038757600080fd5b610125600160a060020a03600435811690602435811690604435906064351661093e565b34156103b657600080fd5b610125600160a060020a0360043516610996565b34156103d557600080fd5b61013a610a05565b34156103e857600080fd5b610360610a1b565b34156103fb57600080fd5b6101f1600160a060020a03600480358216916024803590911691604435916084906064359081019083013580602081810201604051908101604052809392919081815260200183836020028082843750949650610a2a95505050505050565b341561046557600080fd5b61036060046024813581810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610ad095505050505050565b34156104b657600080fd5b6101f1600160a060020a036004803582169160248035909116916044359160849060643590810190830135806020601f82018190048102016040519081016040528181529291906020840183838082843750949650610bac95505050505050565b610542838383600060405180591061052c5750595b90808252806020026020018201604052506105af565b505050565b6040517f4352454154455f5045524d495353494f4e535f524f4c450000000000000000008152601701604051809103902081565b6040517f65766d7265672e617261676f6e706d2e657468000000000000000000000000008152601301604051809103902081565b600083836105bd828261090d565b600160a060020a031633600160a060020a03161415156105dc57600080fd5b6105e7878787610632565b156105f157600080fd5b6000845111610612576000604051908152602001604051809103902061061b565b61061b84610be5565b925061062987878786610d3a565b50505050505050565b600061063c6115bd565b600060405180591061064b5750595b9080825280602002602001820160405250905061066a85858584610a2a565b95945050505050565b60656020528160005260406000208181548110151561068e57fe5b60009182526020909120015460ff80821693506101008204169150620100009004600160f060020a031683565b60015481565b6003545b90565b6040517f6170700000000000000000000000000000000000000000000000000000000000815260030160405180910390206040517f65766d7265672e617261676f6e706d2e6574680000000000000000000000000081526013016040518091039020604051918252602082015260409081019051809103902081565b8181610750828261090d565b600160a060020a031633600160a060020a031614151561076f57600080fd5b61077a858585610632565b151561078557600080fd5b6107928585856000610d3a565b5050505050565b60006107a36115bd565b600080845111156107bc57835160200290508391508082525b600054600160a060020a031615806108cd575060008054600160a060020a03169063fdef91069088903090899087906040516020015260405160e060020a63ffffffff8716028152600160a060020a0380861660048301908152908516602483015260448201849052608060648301908152909160840183818151815260200191508051906020019080838360005b8381101561086357808201518382015260200161084b565b50505050905090810190601f1680156108905780820380516001836020036101000a031916815260200191505b5095505050505050602060405180830381600087803b15156108b157600080fd5b6102c65a03f115156108c257600080fd5b505050604051805190505b9695505050505050565b81816108e3828261090d565b600160a060020a031633600160a060020a031614151561090257600080fd5b610792858585610daf565b60006066600061091d8585610e31565b8152602081019190915260400160002054600160a060020a03169392505050565b61097933306040517f4352454154455f5045524d495353494f4e535f524f4c4500000000000000000081526017016040518091039020610632565b151561098457600080fd5b61099084848484610e75565b50505050565b600354156109a357600080fd5b6109ab610ebd565b60005433600160a060020a039081169116146109c657600080fd5b610a0281306040517f4352454154455f5045524d495353494f4e535f524f4c450000000000000000008152601701604051809103902084610e75565b50565b6000604051908152602001604051809103902081565b600054600160a060020a031681565b600080600060646000610a3e898989610ed7565b815260208101919091526040016000205491508115801590610a685750610a688288888888610f28565b15610a765760019250610ac6565b60646000610a876000198989610ed7565b815260208101919091526040016000205490508015801590610ab35750610ab381600019888888610f28565b15610ac15760019250610ac6565b600092505b5050949350505050565b6000610ada610f5b565b600160a060020a03166304bf2a7f836000604051602001526040518263ffffffff1660e060020a0281526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610b41578082015183820152602001610b29565b50505050905090810190601f168015610b6e5780820380516001836020036101000a031916815260200191505b5092505050602060405180830381600087803b1515610b8c57600080fd5b6102c65a03f11515610b9d57600080fd5b50505060405180519392505050565b6000610bb66115bd565b600060208451811515610bc557fe5b049050839150808252610bda87878785610a2a565b979650505050505050565b6000806000806000610bf56115cf565b8660405180828051906020019060200280838360005b83811015610c23578082015183820152602001610c0b565b505050509050019150506040519081900390206000818152606560205260409020805491965094501515610d2f57600092505b8651831015610d2f57868381518110610c6b57fe5b906020019060200201519150606060405190810160405280610c8c8461104b565b60ff168152602001610c9d84611071565b60ff16815260200183600160f060020a03168152509050838054806001018281610cc791906115ef565b600092835260209092208391018151815460ff191660ff919091161781556020820151815460ff919091166101000261ff001990911617815560408201518154600160f060020a0391909116620100000261ffff909116179055505060019290920191610c56565b509295945050505050565b8060646000610d4a878787610ed7565b815260208101919091526040908101600020919091558290600160a060020a0380861691908716907f759b9a74d5354b5801710a0c1b283cc9f0d32b607ac8ced10c83ac8e75c77d52908515159051901515815260200160405180910390a450505050565b8260666000610dbe8585610e31565b815260208101919091526040908101600020805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03938416179055848216918391908516907ff3addc8b8e25ee11528a61b0e65092cae0666ef0ec0c64cb303993c88d689b4d905160405180910390a4505050565b600060018383604051928352600160a060020a03919091166c0100000000000000000000000002602083015260348201526054016040518091039020905092915050565b6000610e81848461090d565b600160a060020a031614610e9457600080fd5b610eb284848460006040519081526020016040518091039020610d3a565b610990818484610daf565b60035415610eca57600080fd5b610ed2611096565b600355565b600060028484846040519384526c01000000000000000000000000600160a060020a0393841681026020860152919092160260348301526048820152606801604051809103902090505b9392505050565b600080604051908152602001604051908190039020861415610f4c5750600161066a565b6108cd8660008787878761109a565b600080548190600160a060020a03166342c71f1d6040517f6170700000000000000000000000000000000000000000000000000000000000815260030160405180910390206040517f65766d7265672e617261676f6e706d2e6574680000000000000000000000000081526013016040518091039020604051918252602082015260409081019051809103902060006040516020015260405160e060020a63ffffffff84160281526004810191909152602401602060405180830381600087803b151561102757600080fd5b6102c65a03f1151561103857600080fd5b50505060405180519250829150505b5090565b7f0100000000000000000000000000000000000000000000000000000000000000900490565b7e01000000000000000000000000000000000000000000000000000000000000900490565b4390565b60006110a46115cf565b600088815260656020526040812054819063ffffffff8a16106110ca5760009350611320565b60008a8152606560205260409020805463ffffffff8b169081106110ea57fe5b906000526020600020900160606040519081016040908152915460ff80821683526101008204166020830152620100009004600160f060020a031691810191909152925060cc835160ff16141561115057611149838b8a8a8a8a61132d565b9350611320565b8260400151600160f060020a0316905060cb835160ff161415611212578260400151600160a060020a0316631a2b625089898960006040516020015260405160e060020a63ffffffff8616028152600160a060020a0393841660048201529190921660248201526044810191909152606401602060405180830381600087803b15156111db57600080fd5b6102c65a03f115156111ec57600080fd5b50505060405180519050611201576000611204565b60015b60ff169150600190506112cf565b60c8835160ff16141561122e57611227611096565b91506112cf565b60c9835160ff161415611254576112436114e3565b67ffffffffffffffff1691506112cf565b60ca835160ff1614156112725733600160a060020a031691506112cf565b60cd835160ff161415611294578260400151600160f060020a031691506112cf565b8451835160ff16106112a95760009350611320565b84835160ff16815181106112b957fe5b90602001906020020151600160f060020a031691505b600c836020015160ff16600c8111156112e457fe5b600c8111156112ef57fe5b141561130057600082119350611320565b61131d82846020015160ff16600c81111561131757fe5b836114e7565b93505b5050509695505050505050565b60008080808080808080600b8f6020015160ff16600c81111561134c57fe5b600c81111561135757fe5b14156113aa576113738f60400151600160f060020a03166115a4565b9750975097506113878e898f8f8f8f61109a565b94506113a38e86611398578761139a565b885b8f8f8f8f61109a565b98506114d1565b6113c08f60400151600160f060020a03166115a4565b50935093506113d38e858f8f8f8f61109a565b915060078f6020015160ff16600c8111156113ea57fe5b600c8111156113f557fe5b141561140457811598506114d1565b81801561142e575060098f6020015160ff16600c81111561142157fe5b600c81111561142c57fe5b145b1561143c57600198506114d1565b81158015611467575060088f6020015160ff16600c81111561145a57fe5b600c81111561146557fe5b145b1561147557600098506114d1565b6114838e848f8f8f8f61109a565b9050600a8f6020015160ff16600c81111561149a57fe5b600c8111156114a557fe5b14156114cd578180156114b6575080155b806113a35750811580156113a357508098506114d1565b8098505b50505050505050509695505050505050565b4290565b6000600183600c8111156114f757fe5b14156115065750828114610f21565b600283600c81111561151457fe5b1415611524575082811415610f21565b600383600c81111561153257fe5b14156115415750808311610f21565b600483600c81111561154f57fe5b141561155e5750808310610f21565b600583600c81111561156c57fe5b141561157c575080831015610f21565b600683600c81111561158a57fe5b141561159a575080831115610f21565b5060009392505050565b9064010000000082049068010000000000000000830490565b60206040519081016040526000815290565b606060405190810160409081526000808352602083018190529082015290565b815481835581811511610542576000838152602090206105429181019083016106c591905b8082111561104757600081556001016116145600a165627a7a72305820a4f377a9289148b340fc5e548b34f44d71794ac656633c1d3c79d3771997a7f40029";

type ACLConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ethers.ContractFactory>;

const isSuperArgs = (
  xs: ACLConstructorParams
): xs is ConstructorParameters<typeof ethers.ContractFactory> => xs.length > 1;

export class ACL__factory extends ethers.ContractFactory {
  constructor(...args: ACLConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override getDeployTransaction(
    overrides?: NonPayableOverrides & { from?: string }
  ): Promise<ContractDeployTransaction> {
    return super.getDeployTransaction(overrides || {});
  }
  override deploy(overrides?: NonPayableOverrides & { from?: string }) {
    return super.deploy(overrides || {}) as Promise<
      ACL & {
        deploymentTransaction(): ContractTransactionResponse;
      }
    >;
  }
  override connect(runner: ContractRunner | null): ACL__factory {
    return super.connect(runner) as ACL__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ACLInterface {
    return new ethers.Interface(_abi) as ACLInterface;
  }
  static connect(address: string, runner?: ContractRunner | null): ACL {
    return new ethers.Contract(address, _abi, runner) as unknown as ACL;
  }
}
