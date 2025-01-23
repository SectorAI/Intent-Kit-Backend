export const StakeAbiInterface = [
  'event Staked(address indexed user, uint256 amount, uint256 index)',
  'event Unstaked(address indexed user, uint256 amount, uint256 index)',
  'event RewardPaid(address indexed user, uint256 reward)',
];

export enum StakeAbi {
  Staked = 'Staked(address,uint256,uint256)',
  Unstaked = 'Unstaked(address,uint256,uint256)',
  RewardPaid = 'RewardPaid(address,uint256)',
}
