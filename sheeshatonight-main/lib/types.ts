export interface Order {
  id: string;
  orderNumber: string;
  venue: string;
  status: 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Active Rental';
  progress: number; // 0-100
  total: string;
  rentalDate?: string;
  estimatedDelivery?: string;
}

export interface Vendor {
  id: string;
  name: string;
  tier: 'SOLO' | 'MASTER' | 'ADVANCED';
  activeUnits: number;
  settlement: string;
  isActive: boolean;
}

export interface BookingRequest {
  id: string;
  customerName: string;
  productName: string;
  rentalDate: string;
  quantity: number;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface MetricCard {
  label: string;
  value: string;
  trend?: string;
  icon?: string;
}

export interface VendorKYC {
  vendorId: string;
  vendorName: string;
  license: string;
  identity: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
}
