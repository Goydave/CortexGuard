"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Scan } from '@/lib/types';

const STORAGE_KEY = 'scanHistory';

export function useScanHistory() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // This effect runs only on the client
    let initialScans: Scan[] = [];
    try {
      const storedScans = localStorage.getItem(STORAGE_KEY);
      if (storedScans) {
        initialScans = JSON.parse(storedScans);
      } else {
        // If no scans are in local storage, initialize with an empty array
        initialScans = [];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialScans));
      }
    } catch (error) {
      console.error("Failed to access localStorage:", error);
      // Fallback to empty array if localStorage is not available
      initialScans = [];
    }
    setScans(initialScans);
    setIsInitialized(true);
  }, []);

  const updateScansInStorage = (updatedScans: Scan[]) => {
    setScans(updatedScans);
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScans));
    } catch (error) {
        console.error("Failed to save scans to localStorage:", error);
    }
  };

  const addScan = useCallback((newScan: Scan) => {
    setScans(prevScans => {
        const updatedScans = [newScan, ...prevScans];
        updateScansInStorage(updatedScans);
        return updatedScans;
    });
  }, []);

  const clearScans = () => {
    updateScansInStorage([]);
  };

  return { scans, addScan, setScans: updateScansInStorage, clearScans, isInitialized };
}
