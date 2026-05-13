export interface DailyEntry {
  id: string;
  date: string; // ISO format
  openingBalance: number;
  sales: number;
  purchase: number;
  expense: number;
  closingBalance: number;
  notes: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Bill {
  id: string;
  billNumber: string;
  customerName: string;
  customerMobile: string;
  products: Product[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'cash' | 'online' | 'udhar';
  date: string; // ISO format
  gst?: number;
}

export interface UdharAccount {
  id: string;
  customerName: string;
  mobile: string;
  totalUdhar: number;
  paidAmount: number;
  remainingAmount: number;
  history: UdharPayment[];
}

export interface UdharPayment {
  id: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit'; // debit = added udhar, credit = paid back
  note: string;
}

export interface UserSettings {
  language: 'hi' | 'en';
  darkMode: boolean;
  mobileNumber?: string;
  shopName?: string;
}

export interface AppState {
  entries: DailyEntry[];
  bills: Bill[];
  udharAccounts: UdharAccount[];
  settings: UserSettings;
  isLoading: boolean;
  user: any | null;
}
