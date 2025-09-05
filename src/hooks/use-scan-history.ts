"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Scan } from '@/lib/types';
import { mockScanHistory } from '@/lib/mock-data';

const STORAGE_KEY = 'scanHistory';

export function useScanHistory() {
  const [scans, setScans] = useState<Scan[]>([]);

  useEffect(() => {
    try {
      const storedScans = localStorage.getItem(STORAGE_KEY);
      if (storedScans) {
        setScans(JSON.parse(storedScans));
      } else {
        // If no scans are in local storage, initialize with mock data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockScanHistory));
        setScans(mockScanHistory);
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback to mock data if localStorage is not available
      setScans(mockScanHistory);
    }
  }, []);

  const addScan = useCallback((newScan: Scan) => {
    setScans(prevScans => {
        const updatedScans = [newScan, ...prevScans];
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
        } catch (error) {
            console.error("Failed to save scan to localStorage:", error);
        }
        return updatedScans;
    });
  }, []);

  const updateScans = (newScans: Scan[]) => {
      setScans(newScans);
       try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newScans));
        } catch (error) {
            console.error("Failed to save scans to localStorage:", error);
        }
  }

  return { scans, addScan, setScans: updateScans };
}
