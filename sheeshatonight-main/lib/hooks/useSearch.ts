'use client';

import { useState } from 'react';
import { api, Lounge, Product } from '@/lib/api';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lounges, setLounges] = useState<Lounge[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  const searchLounges = async (lat = 25.2048, lng = 55.2708, radius = 10) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.marketplace.search(lat, lng, radius);
      if (res.success) {
        setLounges(res.data);
        return res.data;
      } else {
        throw new Error('Search failed');
      }
    } catch (err: any) {
      setError(err.message || 'Lounges search failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getProductDetail = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.marketplace.getProduct(id);
      if (res.success) {
        setProduct(res.data);
        return res.data;
      } else {
        throw new Error('Could not fetch product');
      }
    } catch (err: any) {
      setError(err.message || 'Product detail fetch failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    lounges,
    product,
    searchLounges,
    getProductDetail,
  };
};
