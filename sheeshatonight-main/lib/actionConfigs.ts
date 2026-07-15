/**
 * Action Configurations
 * Centralized definitions for common actions across the platform
 */

export type ActionType = 
  | 'approve' 
  | 'reject' 
  | 'delete' 
  | 'accept' 
  | 'decline' 
  | 'toggle-active' 
  | 'cancel' 
  | 'feature' 
  | 'unfeature'
  | 'activate'
  | 'deactivate'
  | 'ship'
  | 'deliver'
  | 'approve-kyc'
  | 'reject-kyc';

export interface ActionConfig {
  title: string;
  message: string;
  confirmText?: string;
  isDangerous: boolean;
  icon?: string;
  color: 'green' | 'red' | 'yellow' | 'blue' | 'purple';
}

export const ACTION_CONFIGS: Record<ActionType, ActionConfig> = {
  approve: {
    title: 'Approve Item',
    message: 'Are you sure you want to approve this item?',
    confirmText: 'Approve',
    isDangerous: false,
    color: 'green',
  },
  'reject': {
    title: 'Reject Item',
    message: 'Are you sure you want to reject this item?',
    confirmText: 'Reject',
    isDangerous: true,
    color: 'red',
  },
  delete: {
    title: 'Delete Item',
    message: 'This action cannot be undone. Are you sure you want to delete this item?',
    confirmText: 'Delete',
    isDangerous: true,
    color: 'red',
  },
  accept: {
    title: 'Accept Order',
    message: 'Are you sure you want to accept this order?',
    confirmText: 'Accept',
    isDangerous: false,
    color: 'green',
  },
  decline: {
    title: 'Decline Order',
    message: 'Are you sure you want to decline this order?',
    confirmText: 'Decline',
    isDangerous: true,
    color: 'red',
  },
  'toggle-active': {
    title: 'Toggle Status',
    message: 'Are you sure you want to toggle this item\'s status?',
    confirmText: 'Toggle',
    isDangerous: false,
    color: 'blue',
  },
  cancel: {
    title: 'Cancel Order',
    message: 'Are you sure you want to cancel this order?',
    confirmText: 'Cancel',
    isDangerous: true,
    color: 'red',
  },
  feature: {
    title: 'Feature Item',
    message: 'Are you sure you want to feature this item?',
    confirmText: 'Feature',
    isDangerous: false,
    color: 'blue',
  },
  unfeature: {
    title: 'Unfeature Item',
    message: 'Are you sure you want to remove this item from featured?',
    confirmText: 'Unfeature',
    isDangerous: false,
    color: 'yellow',
  },
  activate: {
    title: 'Activate Item',
    message: 'Are you sure you want to activate this item?',
    confirmText: 'Activate',
    isDangerous: false,
    color: 'green',
  },
  deactivate: {
    title: 'Deactivate Item',
    message: 'Are you sure you want to deactivate this item?',
    confirmText: 'Deactivate',
    isDangerous: true,
    color: 'yellow',
  },
  ship: {
    title: 'Ship Order',
    message: 'Are you sure you want to mark this order as shipped?',
    confirmText: 'Ship',
    isDangerous: false,
    color: 'blue',
  },
  deliver: {
    title: 'Deliver Order',
    message: 'Are you sure you want to mark this order as delivered?',
    confirmText: 'Deliver',
    isDangerous: false,
    color: 'green',
  },
  'approve-kyc': {
    title: 'Approve KYC',
    message: 'Are you sure you want to approve this user\'s KYC?',
    confirmText: 'Approve',
    isDangerous: false,
    color: 'green',
  },
  'reject-kyc': {
    title: 'Reject KYC',
    message: 'Are you sure you want to reject this user\'s KYC?',
    confirmText: 'Reject',
    isDangerous: true,
    color: 'red',
  },
};

/**
 * Get color class for button based on action type
 */
export const getActionButtonClass = (actionType: ActionType): string => {
  const config = ACTION_CONFIGS[actionType];
  if (!config) {
    return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
  }
  const colorMap: Record<string, string> = {
    green: 'bg-green-100 text-green-600 hover:bg-green-200',
    red: 'bg-red-100 text-red-600 hover:bg-red-200',
    yellow: 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
    blue: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    purple: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
  };
  return colorMap[config.color] || 'bg-gray-100 text-gray-600 hover:bg-gray-200';
};

/**
 * Get status-specific actions
 */
export interface StatusActions {
  status: string;
  actions: ActionType[];
}

export const VENDOR_ACTIONS: StatusActions[] = [
  { status: 'Pending', actions: ['approve', 'reject'] },
  { status: 'Verified', actions: ['deactivate', 'delete'] },
  { status: 'Rejected', actions: ['activate'] },
];

export const PRODUCT_ACTIONS_ADMIN: StatusActions[] = [
  { status: 'Pending', actions: ['approve', 'reject', 'delete'] },
  { status: 'Approved', actions: ['feature', 'delete'] },
];

export const PRODUCT_ACTIONS_VENDOR: StatusActions[] = [
  { status: 'Active', actions: ['toggle-active', 'delete'] },
  { status: 'Paused', actions: ['toggle-active', 'delete'] },
];

export const ORDER_ACTIONS: StatusActions[] = [
  { status: 'Pending', actions: ['accept', 'decline', 'cancel'] },
  { status: 'Preparing', actions: ['ship', 'cancel'] },
  { status: 'Shipped', actions: ['deliver'] },
  { status: 'Delivered', actions: [] },
  { status: 'Cancelled', actions: [] },
];

/**
 * Get available actions for a specific status
 */
export const getActionsForStatus = (
  status: string,
  actionMap: StatusActions[]
): ActionType[] => {
  const config = actionMap.find(a => a.status === status);
  return config?.actions || [];
};
