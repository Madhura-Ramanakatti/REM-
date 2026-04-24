import { MOCK_PROPERTIES, MOCK_USERS, MOCK_INQUIRIES } from '../data/mockData';
import type { Property, User, Inquiry, PropertyFilters } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const propertyService = {
  async getAll(): Promise<Property[]> {
    await delay(600);
    return [...MOCK_PROPERTIES];
  },

  async getById(id: string): Promise<Property | null> {
    await delay(400);
    return MOCK_PROPERTIES.find(p => p.id === id) ?? null;
  },

  async getFeatured(): Promise<Property[]> {
    await delay(500);
    return MOCK_PROPERTIES.filter(p => p.isFeatured);
  },

  async search(filters: Partial<PropertyFilters>): Promise<Property[]> {
    await delay(500);
    return MOCK_PROPERTIES.filter(p => {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.city.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
      }
      if (filters.type && p.type !== filters.type) return false;
      if (filters.category && p.category !== filters.category) return false;
      if (filters.city && p.city !== filters.city) return false;
      if (filters.minPrice && p.price < filters.minPrice) return false;
      if (filters.maxPrice && p.price > filters.maxPrice) return false;
      if (filters.minBedrooms && p.bedrooms < filters.minBedrooms) return false;
      return true;
    });
  },

  async create(data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    await delay(700);
    const newProp: Property = { ...data, id: `p${Date.now()}`, createdAt: new Date().toISOString().split('T')[0] };
    MOCK_PROPERTIES.push(newProp);
    return newProp;
  },

  async update(id: string, data: Partial<Property>): Promise<Property | null> {
    await delay(600);
    const idx = MOCK_PROPERTIES.findIndex(p => p.id === id);
    if (idx === -1) return null;
    MOCK_PROPERTIES[idx] = { ...MOCK_PROPERTIES[idx], ...data };
    return MOCK_PROPERTIES[idx];
  },

  async delete(id: string): Promise<boolean> {
    await delay(500);
    const idx = MOCK_PROPERTIES.findIndex(p => p.id === id);
    if (idx === -1) return false;
    MOCK_PROPERTIES.splice(idx, 1);
    return true;
  },
};

export const userService = {
  async login(email: string, password: string): Promise<User | null> {
    await delay(800);
    return MOCK_USERS.find(u => u.email === email && u.password === password) ?? null;
  },

  async register(data: Pick<User, 'name' | 'email' | 'password' | 'phone'>): Promise<User> {
    await delay(800);
    const exists = MOCK_USERS.find(u => u.email === data.email);
    if (exists) throw new Error('Email already registered');
    const newUser: User = {
      ...data,
      id: `u${Date.now()}`,
      role: 'customer',
      avatar: `https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150`,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    MOCK_USERS.push(newUser);
    return newUser;
  },

  async getAll(): Promise<User[]> {
    await delay(500);
    return MOCK_USERS.map(u => ({ ...u, password: '***' })) as User[];
  },
};

export const inquiryService = {
  async getAll(): Promise<Inquiry[]> {
    await delay(500);
    return [...MOCK_INQUIRIES];
  },

  async getByUser(userId: string): Promise<Inquiry[]> {
    await delay(400);
    return MOCK_INQUIRIES.filter(i => i.userId === userId);
  },

  async getByAgent(agentId: string): Promise<Inquiry[]> {
    await delay(400);
    const agentPropertyIds = MOCK_PROPERTIES.filter(p => p.agentId === agentId).map(p => p.id);
    return MOCK_INQUIRIES.filter(i => agentPropertyIds.includes(i.propertyId));
  },

  async create(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> {
    await delay(700);
    const newInquiry: Inquiry = {
      ...data,
      id: `i${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    MOCK_INQUIRIES.push(newInquiry);
    return newInquiry;
  },

  async updateStatus(id: string, status: Inquiry['status']): Promise<Inquiry | null> {
    await delay(500);
    const idx = MOCK_INQUIRIES.findIndex(i => i.id === id);
    if (idx === -1) return null;
    MOCK_INQUIRIES[idx] = { ...MOCK_INQUIRIES[idx], status };
    return MOCK_INQUIRIES[idx];
  },
};
