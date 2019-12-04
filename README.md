# revocation-registry

Contract backing the `EthrStatusRegistry2019` verifiable credential status method

## Usage

This is a very simple contract that can be used to timestamp data on-chain.
The first use of this is for marking verifiable credentials as revoked, but it can be used for committing any
32 byte digest of data to chain.

**Anyone can revoke anything**, it is up to potential verifiers to check if the parties they care about have revoked
the credentials that they are verifying.

To mark a credential to the registry:

```javascript
const issuer = "0xYourEthereumAddress"
const credential = "some verifiable credential (JWT issued by `issuer`) but it can be any data since it gets hashed."
const digest = sha3(credential).toString('hex')

const tx = revocationRegistry.revoke(digest, { from: issuer })

```

Then, to check if it has been marked:
```javascript
const issuer = "0xSomeEthereumAddress"
const credential = "some verifiable credential (JWT issued by `issuer`) but it can be any data since it gets hashed."
const digest = sha3(credential).toString('hex')

const revoked = revocationRegistry.revoked.call(issuer, digest)

const blockNumber = revoked.toNumber() // block number when it was revoked by `issuer`, or 0 if it was not
```

## Deployments

Rinkeby: 0x97fd27892cdcD035dAe1fe71235c636044B59348

## Contributions

Pull requests are welcome.
Please open an issue first to discuss what you would like to change.
And, of course, please make sure to update tests as appropriate.

## License

https://choosealicense.com/licenses/apache-2.0/
