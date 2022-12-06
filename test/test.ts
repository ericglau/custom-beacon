import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

describe("MyToken", function () {
  it("Test contract", async function () {

    // test deploy implementation, custom beacon, beacon proxy
    const ImplementationFactory = await ethers.getContractFactory("MyToken");
    const implementation = <string> await upgrades.deployImplementation(ImplementationFactory);

    const RBACBeaconFactory = await ethers.getContractFactory("RBACBeacon");
    const beacon = await RBACBeaconFactory.deploy(implementation);
    await beacon.deployed();

    let proxy = await upgrades.deployBeaconProxy(beacon.address, ImplementationFactory);
    await proxy.deployed();

    expect(await proxy.name()).to.equal("MyToken");
    expect(await proxy.version()).to.equal("1");


    // test upgrade
    const ImplementationV2Factory = await ethers.getContractFactory("MyTokenV2");
    await upgrades.upgradeBeacon(beacon.address, ImplementationV2Factory);

    // use implementation V2's ABI
    proxy = ImplementationV2Factory.attach(proxy.address);

    expect(await proxy.name()).to.equal("MyToken");
    expect(await proxy.version()).to.equal("2");


    // test beacon roles
    const [deployer, upgrader] = await ethers.getSigners();
    const UPGRADER_ROLE = keccak256(toUtf8Bytes("UPGRADER_ROLE"));
    await beacon.grantRole(UPGRADER_ROLE, upgrader.address);
    await beacon.revokeRole(UPGRADER_ROLE, deployer.address);

    // upgrade with deployer account: expect failure
    await expect(upgrades.upgradeBeacon(beacon.address, ImplementationFactory)).to.be.rejectedWith('missing role');

    // upgrade with upgrader account: expect succeess
    const ImplementationFactoryWithCustomSigner = await ethers.getContractFactory("MyToken", upgrader);
    await upgrades.upgradeBeacon(beacon.address, ImplementationFactoryWithCustomSigner);

    expect(await proxy.name()).to.equal("MyToken");
    expect(await proxy.version()).to.equal("1");

  });
});
