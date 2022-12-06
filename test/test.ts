import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

describe("MyToken", function () {
  it("Test contract", async function () {

    // get test accounts
    const [deployer, default_admin, upgrader, new_upgrader] = await ethers.getSigners();


    // test deploy implementation, custom beacon, beacon proxy
    const ImplementationFactory = await ethers.getContractFactory("MyToken");
    const implementation = <string> await upgrades.deployImplementation(ImplementationFactory);

    const RBACBeaconFactory = await ethers.getContractFactory("RBACBeacon");
    const beacon = await RBACBeaconFactory.deploy(implementation, default_admin.address, upgrader.address);
    await beacon.deployed();

    let proxy = await upgrades.deployBeaconProxy(beacon.address, ImplementationFactory);
    await proxy.deployed();

    expect(await proxy.name()).to.equal("MyToken");
    expect(await proxy.version()).to.equal("1");


    // test upgrade without role: expect failure
    const ImplementationV2Factory = await ethers.getContractFactory("MyTokenV2");
    await expect(upgrades.upgradeBeacon(beacon.address, ImplementationV2Factory)).to.be.rejectedWith('missing role');

    // test upgrade with role
    const ImplementationV2FactoryWithUpgrader = await ethers.getContractFactory("MyTokenV2", upgrader);
    await upgrades.upgradeBeacon(beacon.address, ImplementationV2FactoryWithUpgrader);

    // use implementation V2's ABI
    proxy = ImplementationV2FactoryWithUpgrader.attach(proxy.address);

    expect(await proxy.name()).to.equal("MyToken");
    expect(await proxy.version()).to.equal("2");


    // test changing roles
    const UPGRADER_ROLE = keccak256(toUtf8Bytes("UPGRADER_ROLE"));
    const RBACBeaconFactoryWithDefaultAdmin = await ethers.getContractFactory("RBACBeacon", default_admin);
    const beaconWithDefaultAdmin = RBACBeaconFactoryWithDefaultAdmin.attach(beacon.address);
    await beaconWithDefaultAdmin.revokeRole(UPGRADER_ROLE, upgrader.address);
    await beaconWithDefaultAdmin.grantRole(UPGRADER_ROLE, new_upgrader.address);

    // test upgrade without role: expect failure
    const ImplementationFactoryWithUpgrader = await ethers.getContractFactory("MyToken", upgrader);
    await expect(upgrades.upgradeBeacon(beacon.address, ImplementationFactoryWithUpgrader)).to.be.rejectedWith('missing role');

    // test upgrade with role
    const ImplementationFactoryWithNewUpgrader = await ethers.getContractFactory("MyToken", new_upgrader);
    await upgrades.upgradeBeacon(beacon.address, ImplementationFactoryWithNewUpgrader);

    expect(await proxy.name()).to.equal("MyToken");
    expect(await proxy.version()).to.equal("1");

  });
});
