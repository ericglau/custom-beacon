// SPDX-License-Identifier: MIT
// This contract is provided as an example only.

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract RBACBeacon is IBeacon, AccessControl {
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    address private _implementation;

    /**
     * @dev Emitted when the implementation returned by the beacon is changed.
     */
    event Upgraded(address indexed implementation);

    /**
     * @dev Sets the address of the initial implementation, an account for the default admin role,
     * and an account with role that can upgrade the beacon.
     */
    constructor(address implementation_, address default_admin, address upgrader) {
        _grantRole(DEFAULT_ADMIN_ROLE, default_admin);
        _grantRole(UPGRADER_ROLE, upgrader);
        _setImplementation(implementation_);
    }

    /**
     * @dev Returns the current implementation address.
     */
    function implementation() public view virtual override returns (address) {
        return _implementation;
    }

    /**
     * @dev Upgrades the beacon to a new implementation.
     *
     * Emits an {Upgraded} event.
     *
     * Requirements:
     *
     * - msg.sender must have the role that can upgrade the beacon.
     * - `newImplementation` must be a contract.
     */
    function upgradeTo(address newImplementation) public virtual onlyRole(UPGRADER_ROLE) {
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    /**
     * @dev Sets the implementation contract address for this beacon
     *
     * Requirements:
     *
     * - `newImplementation` must be a contract.
     */
    function _setImplementation(address newImplementation) private {
        require(Address.isContract(newImplementation), "UpgradeableBeacon: implementation is not a contract");
        _implementation = newImplementation;
    }
}