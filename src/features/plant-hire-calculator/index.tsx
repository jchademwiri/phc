'use client';

import React, { useEffect, useState } from 'react';
import {
  EquipmentCard,
  AddEquipmentForm,
  GrandTotalFooter,
  EmptyState,
  CalculationRules,
} from './components';
import { useEquipmentManager, useGrandTotal } from './hooks';
import { EQUIPMENT_PRESETS } from './utils/constants';
import type { EquipmentPreset } from './types';

const PlantHireCalculator: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [hasLoadedMonthFromStorage, setHasLoadedMonthFromStorage] = useState(false);
  const [newEquipmentName, setNewEquipmentName] = useState('');
  const [newDailyRate, setNewDailyRate] = useState('');

  const {
    equipment,
    addEquipment,
    removeEquipment,
    duplicateEquipment,
    updateIdleDays,
    updateRates,
    clearMonthIdleDays,
  } = useEquipmentManager();

  useEffect(() => {
    try {
      const saved = localStorage.getItem('phc-month-v1');
      if (saved) {
        const d = new Date(saved);
        if (!isNaN(d.getTime())) {
          setCurrentMonth(d);
        }
      }
    } catch {
      // ignore
    } finally {
      setHasLoadedMonthFromStorage(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedMonthFromStorage) return;
    try {
      localStorage.setItem('phc-month-v1', currentMonth.toISOString());
    } catch {
      // ignore
    }
  }, [currentMonth, hasLoadedMonthFromStorage]);

  const grandTotal = useGrandTotal(equipment, currentMonth);

  const handleAddEquipment = (e: React.FormEvent) => {
    e?.preventDefault();
    addEquipment(newEquipmentName, newDailyRate);
    setNewEquipmentName('');
    setNewDailyRate('');
  };

  const handlePresetSelect = (preset: EquipmentPreset) => {
    setNewEquipmentName(preset.name);
    setNewDailyRate(preset.rate.toString());
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-slate-50 to-teal-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-emerald-700 to-teal-600 mb-2">
              Plant Hire Calculator
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Strict period discounting · South Africa
              <span className="ml-3 inline-flex items-center gap-1.5 text-emerald-600 text-xs font-semibold">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Auto-saved
              </span>
            </p>
          </div>
        </div>

        {/* Add Equipment Form */}
        <AddEquipmentForm
          equipmentName={newEquipmentName}
          dailyRate={newDailyRate}
          presets={EQUIPMENT_PRESETS}
          onEquipmentNameChange={setNewEquipmentName}
          onDailyRateChange={setNewDailyRate}
          onSubmit={handleAddEquipment}
          onPresetSelect={handlePresetSelect}
        />

        {/* Equipment List */}
        <div className="space-y-4">
          {equipment.length === 0 ? (
            <EmptyState />
          ) : (
            equipment.map((item) => (
              <EquipmentCard 
                key={item.id} 
                item={item} 
                currentMonth={currentMonth}
                onRemove={() => removeEquipment(item.id)}
                onUpdateIdleDays={(days) => updateIdleDays(item.id, days)}
                onUpdateRates={(newRates) => updateRates(item.id, newRates)}
                onMonthChange={setCurrentMonth}
              />
            ))
          )}
        </div>

        {/* Grand Total Footer */}
        {equipment.length > 0 && (
          <GrandTotalFooter 
            total={grandTotal}
            equipmentCount={equipment.length}
            currentMonth={currentMonth}
          />
        )}

        {/* Calculation Rules */}
        <CalculationRules />

      </div>
    </div>
  );
};

export default PlantHireCalculator;
