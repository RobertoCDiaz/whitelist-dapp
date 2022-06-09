// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Whitelist {
    // max capacity of whitelist
    uint8 public maxCapacity;

    // whitelisted addresses
    // a false value indicates that said address is not currently whitelisted
    mapping(address => bool) public whitelisted;

    // a state variable that keeps track of how many addresses are currently whitelisted
    uint public whitelistedCount;

    // sets the maximum capacity based on the parameter provided on deploy
    constructor(uint8 capacity) {
        maxCapacity = capacity;
    }

    // adds `user` address to the list of whitelisted addresses
    // only if it is not already whitelisted and maximum capacity is not yet reached
    function addAddress() public {
        address user = msg.sender;

        require(!whitelisted[user], "User is already whitelisted");
        require(whitelistedCount <= maxCapacity, "Max amount of whitelisted addresses reached");
        
        whitelisted[user] = true;
        whitelistedCount  += 1;
    }

    // checks if the function caller address is already in the whitelist
    // return true if it is, false otherwise
    function isInWhitelist() public view returns (bool) {
        return whitelisted[msg.sender];
    }


}