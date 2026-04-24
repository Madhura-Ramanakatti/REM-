export type PropertyType = 'sale' | 'rent';
export type PropertyCategory = 'house' | 'apartment' | 'condo' | 'villa' | 'townhouse' | 'studio';
export type UserRole = 'admin' | 'user';
export type InquiryStatus = 'pending' | 'responded' | 'closed';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  category: PropertyCategory;
  location: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  yearBuilt: number;
  images: string[];
  features: string[];
  agentId: string;
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentAvatar: string;
  isFeatured: boolean;
  createdAt: string;
  status: 'active' | 'sold' | 'rented';
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string;
  phone: string;
  joinedAt: string;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface PropertyFilters {
  search: string;
  type: '' | PropertyType;
  category: '' | PropertyCategory;
  city: string;
  minPrice: number;
  maxPrice: number;
  minBedrooms: number;
  minArea: number;
  maxArea: number;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  propertyId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

