import { supabase } from '../lib/supabase';
import type { Property, User, Inquiry, PropertyFilters, Review, Message } from '../types';

export const propertyService = {
  async getAll(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(p => this.mapProperty(p));
  },

  async getById(id: string): Promise<Property | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return this.mapProperty(data);
  },

  async getFeatured(): Promise<Property[]> {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true);
    
    if (error) throw error;
    return (data || []).map(p => this.mapProperty(p));
  },

  async search(filters: Partial<PropertyFilters>): Promise<Property[]> {
    let query = supabase.from('properties').select('*');

    if (filters.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }
    if (filters.city) {
      query = query.eq('city', filters.city);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.category) {
      query = query.eq('category', filters.category);
    }
    if (filters.minPrice) {
      query = query.gte('price', filters.minPrice);
    }
    if (filters.maxPrice) {
      query = query.lte('price', filters.maxPrice);
    }
    if (filters.minBedrooms) {
      query = query.gte('bedrooms', filters.minBedrooms);
    }

    const { data, error } = await query;
    if (error) throw error;
    return (data || []).map(p => this.mapProperty(p));
  },

  async create(data: Omit<Property, 'id' | 'createdAt'>): Promise<Property> {
    const { data: result, error } = await supabase
      .from('properties')
      .insert({
        title: data.title,
        description: data.description,
        price: data.price,
        type: data.type,
        category: data.category,
        location: data.location,
        city: data.city,
        state: data.state,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        year_built: data.yearBuilt,
        images: data.images,
        features: data.features,
        agent_id: data.agentId,
        is_featured: data.isFeatured,
        status: data.status,
      })
      .select()
      .single();
    
    if (error) throw error;
    return this.mapProperty(result);
  },

  async update(id: string, data: Partial<Property>): Promise<Property | null> {
    const updateData: any = {};
    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.price) updateData.price = data.price;
    if (data.status) updateData.status = data.status;
    if (data.isFeatured !== undefined) updateData.is_featured = data.isFeatured;

    const { data: result, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return this.mapProperty(result);
  },

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) return false;
    return true;
  },

  async uploadImage(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('property-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('property-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  mapProperty(p: any): Property {
    return {
      id: p.id,
      title: p.title,
      description: p.description,
      price: Number(p.price),
      type: p.type,
      category: p.category,
      location: p.location,
      city: p.city,
      state: p.state,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      area: p.area,
      yearBuilt: p.year_built,
      images: p.images,
      features: p.features,
      agentId: p.agent_id,
      agentName: 'Agent', // To be fetched via join if needed
      agentPhone: '',
      agentEmail: '',
      agentAvatar: '',
      isFeatured: p.is_featured,
      createdAt: p.created_at,
      status: p.status,
    };
  }
};

export const userService = {
  async getAll(): Promise<User[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*');
    
    if (error) throw error;
    return (data || []).map(p => ({
      id: p.id,
      name: p.name,
      email: p.email,
      role: p.role,
      avatar: p.avatar_url,
      phone: '',
      joinedAt: p.joined_at,
      password: '***',
    }));
  }
};

export const inquiryService = {
  async getAll(): Promise<Inquiry[]> {
    const { data, error } = await supabase
      .from('enquiries')
      .select('*, properties(title)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return (data || []).map(i => ({
      id: i.id,
      propertyId: i.property_id,
      propertyTitle: (i.properties as any)?.title || 'Unknown Property',
      userId: i.user_id,
      userName: i.name,
      userEmail: i.email,
      userPhone: i.phone,
      message: i.message,
      status: i.status === 'pending' ? 'pending' : 'responded',
      createdAt: i.created_at,
    }));
  },

  async create(data: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Promise<Inquiry> {
    const { data: result, error } = await supabase
      .from('enquiries')
      .insert({
        property_id: data.propertyId,
        user_id: data.userId,
        name: data.userName,
        email: data.userEmail,
        phone: data.userPhone,
        message: data.message,
        status: 'pending',
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      id: result.id,
      status: 'pending',
      createdAt: result.created_at,
    };
  }
};

export const reviewService = {
  async getByProperty(propertyId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(name, avatar_url)')
      .eq('property_id', propertyId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return (data || []).map(r => ({
      id: r.id,
      userId: r.user_id,
      userName: (r.profiles as any)?.name || 'Anonymous',
      userAvatar: (r.profiles as any)?.avatar_url || '',
      propertyId: r.property_id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.created_at,
    }));
  },

  async addReview(data: Omit<Review, 'id' | 'createdAt' | 'userName' | 'userAvatar'>): Promise<Review> {
    const { data: result, error } = await supabase
      .from('reviews')
      .insert({
        user_id: data.userId,
        property_id: data.propertyId,
        rating: data.rating,
        comment: data.comment,
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      ...data,
      id: result.id,
      userName: 'You',
      userAvatar: '',
      createdAt: result.created_at,
    };
  }
};

export const messageService = {
  async getChat(user1: string, user2: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user1},receiver_id.eq.${user2}),and(sender_id.eq.${user2},receiver_id.eq.${user1})`)
      .order('created_at', { ascending: true });
    
    if (error) return [];
    return (data || []).map(m => ({
      id: m.id,
      senderId: m.sender_id,
      receiverId: m.receiver_id,
      message: m.message,
      timestamp: m.created_at,
      isRead: m.is_read,
    }));
  },

  async sendMessage(senderId: string, receiverId: string, text: string): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        message: text,
      })
      .select()
      .single();
    
    if (error) throw error;
    return {
      id: data.id,
      senderId: data.sender_id,
      receiverId: data.receiver_id,
      message: data.message,
      timestamp: data.created_at,
      isRead: false,
    };
  }
};
