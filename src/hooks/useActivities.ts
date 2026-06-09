import { useState, useEffect, useCallback } from 'react';
import type { Activity, Category } from '../types';
import { calculateEmission } from '../services/emissionFactors';
import { sanitizeText } from '../utils/validators';
import { useAuth } from '../context/AuthContext';
import { queryDocuments, createDocument, deleteDocument } from '../lib/firestore';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const loadActivities = useCallback(async () => {
    if (!currentUser) {
      setActivities([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await queryDocuments<Activity>(
        `users/${currentUser.uid}/activities`,
        'timestamp',
        500
      );
      setActivities(data);
    } catch (err) {
      console.error('Failed to load activities', err);
      setError('Failed to load activities. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  async function addActivity(params: {
    category: Category;
    subType: string;
    quantity: number;
    unit: string;
    note: string;
  }) {
    if (!currentUser) return;
    const co2e_kg = calculateEmission(params.category, params.subType, params.quantity);
    const activity: Activity = {
      id: generateId(),
      userId: currentUser.uid,
      category: params.category,
      subType: params.subType,
      quantity: params.quantity,
      unit: params.unit,
      co2e_kg,
      timestamp: new Date().toISOString(),
      note: sanitizeText(params.note),
    };

    setActivities(prev => [activity, ...prev]);

    try {
      await createDocument(`users/${currentUser.uid}/activities`, activity.id, activity);
    } catch (err) {
      console.error('Failed to save activity to Firestore', err);
      setActivities(prev => prev.filter(a => a.id !== activity.id));
      throw new Error('Failed to save activity. Please try again.');
    }
  }

  async function removeActivity(id: string) {
    if (!currentUser) return;
    const previous = [...activities];
    setActivities(prev => prev.filter(a => a.id !== id));

    try {
      await deleteDocument(`users/${currentUser.uid}/activities`, id);
    } catch (err) {
      console.error('Failed to delete activity from Firestore', err);
      setActivities(previous);
      throw new Error('Failed to delete activity. Please try again.');
    }
  }

  return { activities, loading, error, addActivity, deleteActivity: removeActivity, reload: loadActivities };
}
