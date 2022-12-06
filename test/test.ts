import { expect } from "chai";
import { ethers, upgrades } from "hardhat";

describe("MyToken", function () {
  it("Test contract", async function () {
    const ImplementationFactory = await ethers.getContractFactory("MyToken");
    const implementation = <string> await upgrades.deployImplementation(ImplementationFactory);

    const RBACBeaconFactory = await ethers.getContractFactory("RBACBeacon");
    const beacon = await RBACBeaconFactory.deploy(implementation);
    await beacon.deployed();

    const proxy = await upgrades.deployBeaconProxy(beacon.address, ImplementationFactory);
    await proxy.deployed();

    expect(await proxy.name()).to.equal("MyToken");
  });
});
