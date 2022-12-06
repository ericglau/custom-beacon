import { ethers, upgrades } from "hardhat";

async function main() {
  const ImplementationFactory = await ethers.getContractFactory("MyToken");
  const implementation = <string> await upgrades.deployImplementation(ImplementationFactory);
  console.log(`Implementation deployed to ${implementation}`);

  const CustomBeaconFactory = await ethers.getContractFactory("RBACBeacon");
  const beacon = await CustomBeaconFactory.deploy(implementation);
  await beacon.deployed();
  console.log(`Custom beacon deployed to ${beacon.address}`);

  const proxy = await upgrades.deployBeaconProxy(beacon.address, ImplementationFactory);
  await proxy.deployed();
  console.log(`Proxy deployed to ${proxy.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
