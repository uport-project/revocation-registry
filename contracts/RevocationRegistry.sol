pragma solidity ^0.5.8;

contract RevocationRegistry {

    mapping(bytes32 => mapping(address => uint)) private revocations;

    function revoke(bytes32 digest) public returns (bool) {
        if (revocations[digest][msg.sender] == 0) {
            revocations[digest][msg.sender] = block.number;
            emit Revoked(msg.sender, digest);
            return true;
        } else {
            return false;
        }
    }

    function revoked(address party, bytes32 digest) public view returns (uint) {
        return revocations[digest][party];
    }

    event Revoked(address revoker, bytes32 digest);
}