# Whitelist dApp

Web descentralized application to give early supporters of a new NFT Colletion access to a whitelist.

## Installation

2. Go to both the `hardhat` and `whitelist-website` directories and install their npm dependencies.
```bash
npm i
```

## Smart Contract configuration and deployment

Go into the `hardhat` directory. Once there, do as following steps indicate. 

1. Create an Alchemy node in the Rinkeby network
    * Sign up to the [Alchemy](https://www.alchemyapi.io) service and create a new app using the Rinkeby network

2. Configure environment variables
    * Create a '.env' as a copy of the [.envtemplate](.envtemplate) file and replace the values of the indicated variables.
    * **PRIVATE_KEY** is the private key for your account on the Rinkeby Network. You can use Metamask for this.
    * **ALCHEMY_URL** is the URL with the API Key that Alchemy provides on the dashboard for your new app (the one created on the previous step).
```
PRIVATE_KEY=<Here goes the private key for your Rinkeby Account>
ALCHEMY_URL=<Replace this with your Alchemy node URL>
```

3. Run the `deploy` npm command to compile and deploy the smart contract

```bash
cd hardhat
npm run deploy
```

Inside the [HardHat config](hardhat.config.js) file, a network called 'rinkeby' was created using the information provided through the environment variables.

## Next.js server start

To start the Next.js dev server, execute the following command inside the `whitelist-website` directory:

```bash
npm run dev
```