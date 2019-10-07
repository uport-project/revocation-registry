pragma solidity ^0.5.8;

contract RevocationRegistry {

    mapping(bytes32 => mapping(address => uint)) public revocations;

    function revoke(bytes32 digest) public returns (bool) {
        revocations[digest][msg.sender] = block.number;
        emit Revoked(msg.sender, digest);
        return true;
    }

    function revoked(address party, bytes32 digest) public view returns (bool) {
        return revocations[digest][party] > 0;
    }

    event Revoked(address revoker, bytes32 digest);
}