// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEpochManager {
    function currentEpochId() external view returns (uint256);
}

contract TemporalisTreasury {

    address public admin;
    IEpochManager public epochManager;

    uint256 public totalTVL;

    mapping(uint256 => uint256) public strategyCapital;
    mapping(address => uint256) public userDeposits;

    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event Allocated(uint256 indexed strategyId, uint256 amount);
    event Deallocated(uint256 indexed strategyId, uint256 amount);

    modifier onlyAdmin() {
        require(msg.sender == admin, "NOT_ADMIN");
        _;
    }

    constructor(address _epochManager) {
        admin = msg.sender;
        epochManager = IEpochManager(_epochManager);
    }

    receive() external payable {
        deposit();
    }

    function deposit() public payable {
        require(msg.value > 0, "ZERO");

        userDeposits[msg.sender] += msg.value;
        totalTVL += msg.value;

        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) external {
        require(userDeposits[msg.sender] >= amount, "INSUFFICIENT");

        userDeposits[msg.sender] -= amount;
        totalTVL -= amount;

        payable(msg.sender).transfer(amount);

        emit Withdrawn(msg.sender, amount);
    }

    function allocateToStrategy(uint256 strategyId, uint256 amount) external onlyAdmin {
        require(amount <= totalTVL, "EXCEEDS_TVL");

        strategyCapital[strategyId] += amount;

        emit Allocated(strategyId, amount);
    }

    function deallocateFromStrategy(uint256 strategyId, uint256 amount) external onlyAdmin {
        require(strategyCapital[strategyId] >= amount, "NOT_ALLOCATED");

        strategyCapital[strategyId] -= amount;

        emit Deallocated(strategyId, amount);
    }

    function capitalOf(uint256 strategyId) external view returns (uint256) {
        return strategyCapital[strategyId];
    }

    function exposureBps(uint256 strategyId) external view returns (uint256) {
        if (totalTVL == 0) return 0;
        return (strategyCapital[strategyId] * 10000) / totalTVL;
    }
}