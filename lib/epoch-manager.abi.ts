export const EPOCH_MANAGER_ABI = [
  // -------- Views --------
  {
    type: "function",
    name: "currentEpochId",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "epochEnd",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "timeLeft",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "riskMetrics",
    stateMutability: "view",
    inputs: [
      { name: "", type: "uint256" },
      { name: "", type: "uint256" }
    ],
    outputs: [
      { name: "weeklyDrawdownBps", type: "uint256" },
      { name: "exposurePerPoolBps", type: "uint256" },
      { name: "exposurePerChainBps", type: "uint256" },
      { name: "execSuccessBps", type: "uint256" },
      { name: "gasCostBps", type: "uint256" },
      { name: "breachDrawdown", type: "bool" },
      { name: "breachExposure", type: "bool" }
    ],
  },

  // -------- Event --------
  {
    type: "event",
    name: "ProofScored",
    anonymous: false,
    inputs: [
      { indexed: true, name: "epochId", type: "uint256" },
      { indexed: true, name: "strategyId", type: "uint256" },
      { indexed: false, name: "score", type: "uint256" }
    ]
  }
] as const;