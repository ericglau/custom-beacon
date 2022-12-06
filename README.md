# Hardhat Upgrades with Custom Beacon

This project demonstrates how to use a custom beacon with [OpenZeppelin Hardhat Upgrades](https://docs.openzeppelin.com/upgrades-plugins/1.x/hardhat-upgrades). It comes with some example contracts, a test case, and a deployment script.

The custom beacon used in this example is an upgradeable beacon with role-based access control.

## Overview

In this scenario, OpenZeppelin Hardhat Upgrades handles validations and deployment of implementation contracts, beacon proxies, and upgrades, with a custom beacon that is deployed directly.

The steps are:
1. Use [`deployImplementation`](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#deploy-implementation) to validate and deploy the implementation.
2. Deploy the custom beacon contract directly using the `deploy` function from the ethers contract factory.
3. Use [`deployBeaconProxy`](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#deploy-beacon-proxy) to deploy a beacon proxy, and/or use [`upgradeBeacon`](https://docs.openzeppelin.com/upgrades-plugins/1.x/api-hardhat-upgrades#upgrade-beacon) to validate and upgrade the implementation to a new version.

## Installing dependencies

```
npm install
```

## Testing

See [test/test.ts](test/test.ts) for an example test case.

Run tests with:
```
npm test
```

## Deploying

See [scripts/deploy.ts](scripts/deploy.ts) for an example deployment script.

Set the `DEFAULT_ADMIN_ADDRESS` and `UPGRADER_ADDRESS` constants in the script.

Run the script to target any network from your Hardhat config using:
```
npx hardhat run --network <network-name> scripts/deploy.ts
```
