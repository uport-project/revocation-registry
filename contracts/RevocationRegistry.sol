pragma solidity ^0.5.8;

contract RevocationRegistry {

    mapping(bytes32 => mapping(address => uint)) private revocations;

    event Revoked(address issuer, bytes32 digest);

    function revoke(bytes32 digest) public {
        require(revocations[digest][msg.sender] == 0);
        revocations[digest][msg.sender] = block.number;
        emit Revoked(msg.sender, digest);
    }

    function revoked(address issuer, bytes32 digest) public view returns (uint) {
        return revocations[digest][issuer];
    }

}