const RevocationRegistry = artifacts.require("./RevocationRegistry.sol");

contract('RevocationRegistry', function(accounts) {

  let registryInstance;

  beforeEach(async () => {
    registryInstance = await RevocationRegistry.new()
  })

  describe("revoked", () => {
    it("Should throw an invalid value when digest input longer than 32 bytes", async () => {
      const digest = "0xaabbccddeeff00112233445566778899aabbccddeeff0011223344556677889900"
      try {
        await registryInstance.revoked.call( accounts[0], digest )
      } catch (e) {
        assert.equal( e.message,
                      'invalid bytes32 value (arg="digest", coderType="bytes32", value="0xaabbccddeeff00112233445566778899aabbccddeeff0011223344556677889900")'
        );
        return
      }

      expect.fail("should have failed with an error")
    });

    it("Should throw an invalid value when digest is not a byte array", async () => {
      try {
        await registryInstance.revoked.call( accounts[0], "some non hex string" )
      } catch (e) {
        assert.equal( e.message,
                      'invalid bytes32 value (arg="digest", coderType="bytes32", value="some non hex string")'
        );
        return
      }
      expect.fail("should have failed with an error")
    });

    it("Should return 0 for non revoked digest", async () => {
      const digest = "0xaabbccddeeff00112233445566778899aabbccddeeff00112233445566778899"
      let result = await registryInstance.revoked.call( accounts[0], digest )
      assert.equal(result.toNumber(), 0)
    });

    it("Should return block number for revoked digest", async () => {
      const digest = "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
      let tx = await registryInstance.revoke(digest,
        {
          from: accounts[0]
        })

      let result = await registryInstance.revoked.call( accounts[0], digest )
      assert.isAbove(result.toNumber(), 0)
    });

    it("Should create an event during revocation", async () => {
      const digest = "0xabcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789"
      let tx = await registryInstance.revoke(digest, { from: accounts[0] })
      let event = tx.logs[0]

      assert.equal(event.event, "Revoked");
      assert.equal(event.args.issuer, accounts[0]);
      assert.equal(event.args.digest, digest);
    });

    it("Should not revoke same digest twice", async () => {
      const digest = "0xabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd"
      await registryInstance.revoke( digest, { from: accounts[0] })
      try {
        await registryInstance.revoke( digest, { from: accounts[0] })
      } catch (e) {
        assert.equal( e.message, 'Returned error: VM Exception while processing transaction: revert' );
        return
      }
      expect.fail("second transaction went through when it should have been rejected")
    });

  })

});