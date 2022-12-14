import { ethers, upgrades } from "hardhat";

async function main() {

  // TODO set these to the addresses that will receive the default admin and upgrader roles, respectively
  // const DEFAULT_ADMIN_ADDRESS = 
  // const UPGRADER_ADDRESS = 

  // Use Hardhat Upgrades plugin to validate and deploy the implementation
  const ImplementationFactory = await ethers.getContractFactory("MyToken");
  const implementation = <string> await upgrades.deployImplementation(ImplementationFactory);
  console.log(`Implementation deployed to ${implementation}`);

  // Deploy the custom beacon directly
  const CustomBeaconFactory = await ethers.getContractFactory("RBACBeacon");
  const beacon = await CustomBeaconFactory.deploy(implementation, DEFAULT_ADMIN_ADDRESS, UPGRADER_ADDRESS);
  await beacon.deployed();
  console.log(`Custom beacon deployed to ${beacon.address}`);

  // Use Hardhat Upgrades plugin to deploy the beacon proxy
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
