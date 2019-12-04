pragma solidity ^0.5.8;

contract RevocationRegistry {

    mapping(bytes32 => mapping(address => uint)) private revocations;

    modifier onlyOnce(bytes32 digest) {
        require (revocations[digest][msg.sender] == 0);
        _;
    }

    function revoke(bytes32 digest) public onlyOnce(digest) {
        revocations[digest][msg.sender] = block.number;
        emit Revoked(msg.sender, digest);
    }

    function revoked(address issuer, bytes32 digest) public view returns (uint) {
        return revocations[digest][issuer];
    }

    event Revoked(address issuer, bytes32 digest);
}