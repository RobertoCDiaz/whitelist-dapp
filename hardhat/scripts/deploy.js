const { ethers } = require("hardhat");

const main = async () => {
    const contract = await ethers.getContractFactory("Whitelist");

    // deploy whitelist contract using 15 as the contructor parameter
    // meaning the maximum capacity of the whitelist will be of 15 addresses
    const deployedContract = await contract.deploy(15);
    await deployedContract.deployed();

    console.log('contract address: ', deployedContract.address);
}

main().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
})