import { useEffect, useState } from 'react';
import type { Equipment, Rates } from '../types';
import { calculateRates } from '../utils/calculations';

const STORAGE_KEY = 'phc-equipment-v1';

const defaultEquipment = (): Equipment[] => [
  {
    id: '1',
    name: 'Dropside',
    rates: calculateRates(5200),
    idleDays: [],
  },
];

const loadFromStorage = (): Equipment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultEquipment();
    const parsed = JSON.parse(raw) as Equipment[];
    return parsed.map((item) => ({
      ...item,
      idleDays: (item.idleDays || []).map((d) => new Date(d as unknown as string)),
    }));
  } catch {
    return defaultEquipment();
  }
};

const saveToStorage = (equipment: Equipment[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(equipment));
  } catch {
    // Storage unavailable (private browsing, quota exceeded) — fail silently
  }
};

export const useEquipmentManager = () => {
  const [equipment, setEquipment] = useState<Equipment[]>(() => defaultEquipment());
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);

  useEffect(() => {
    setEquipment(loadFromStorage());
    setHasLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedFromStorage) return;
    saveToStorage(equipment);
  }, [equipment, hasLoadedFromStorage]);

  const addEquipment = (name: string, rate: string) => {
    if (!name.trim() || !rate) return;
    const baseRate = parseFloat(rate);
    if (isNaN(baseRate) || baseRate <= 0) return;

    const newItem: Equipment = {
      id: Date.now().toString(),
      name: name.trim(),
      rates: calculateRates(baseRate),
      idleDays: [],
    };
    setEquipment((prev) => [...prev, newItem]);
  };

  const removeEquipment = (id: string) => {
    setEquipment((prev) => prev.filter((item) => item.id !== id));
  };

  const duplicateEquipment = (id: string) => {
    setEquipment((prev) => {
      const source = prev.find((item) => item.id === id);
      if (!source) return prev;

      const copy: Equipment = {
        ...source,
        id: Date.now().toString(),
        name: `${source.name} (Copy)`,
        idleDays: [],
      };

      const idx = prev.findIndex((item) => item.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, copy);
      return next;
    });
  };

  const updateIdleDays = (id: string, days: Date[]) => {
    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, idleDays: days } : item))
    );
  };

  const updateRates = (id: string, newRates: Rates) => {
    setEquipment((prev) =>
      prev.map((item) => (item.id === id ? { ...item, rates: newRates } : item))
    );
  };

  const clearMonthIdleDays = (month: Date) => {
    const year = month.getFullYear();
    const monthIndex = month.getMonth();
    setEquipment((prev) =>
      prev.map((item) => ({
        ...item,
        idleDays: item.idleDays.filter(
          (d) => !(d.getFullYear() === year && d.getMonth() === monthIndex)
        ),
      }))
    );
  };

  return {
    equipment,
    addEquipment,
    removeEquipment,
    duplicateEquipment,
    updateIdleDays,
    updateRates,
    clearMonthIdleDays,
  };
};
