import { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database, getCurrentUserId } from '../../configs/FirebaseConfig';

export function useWaterLevel() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [waterDispenseCount, setWaterDispenseCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>(Array(7).fill(0));

  const fetchWaterLevel = async () => {
    try {
      const response = await fetch('https://blynk.cloud/external/api/get?token=NqXOR_TdkhVvJzSK4N6WxLGmZNoKu6Se&pin=V0'); // Replace with the correct pin for water level
      const data = await response.text();
      const level = parseFloat(data);

      if (!isNaN(level)) {
        const maxLevel = 20; // Replace with the max level value for water setup
        const progress = Math.max(0, Math.min(1, level / maxLevel));
        setWaterLevel(progress);
      } else {
        console.error('Invalid water level:', data);
      }
    } catch (error) {
      console.error('Error fetching water level:', error);
    }
  };

  const togglePump = async (value: boolean) => {
    try {
      setIsPumpOn(value);
      const pumpState = value ? '1' : '0';
      await fetch(`https://blynk.cloud/external/api/update?token=NqXOR_TdkhVvJzSK4N6WxLGmZNoKu6Se&pin=V1&value=${pumpState}`); // Replace with the correct pin for pump control

      // Record water dispense event to Firebase
      if (value) {
        await recordWaterDispense();
      }
    } catch (error) {
      console.error('Error toggling water pump:', error);
    }
  };

  const recordWaterDispense = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const dispenseRef = ref(database, `users/${userId}/waterDispenses/${Date.now()}`);
      await set(dispenseRef, {
        dispenseTime: Date.now(),
        waterCount: waterDispenseCount,
      });
      setWaterDispenseCount(waterDispenseCount + 1);
    } catch (error) {
      console.error('Error recording water dispense:', error);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const dispensesRef = ref(database, `users/${userId}/waterDispenses`);
      onValue(dispensesRef, (snapshot) => {
        const dispenses = snapshot.val() || {};
        const dailyCounts = Array(7).fill(0);
        Object.values(dispenses).forEach((dispense: any) => {
          if (dispense.dispenseTime >= weekAgo) {
            const dayIndex = Math.floor((Date.now() - dispense.dispenseTime) / (24 * 60 * 60 * 1000));
            dailyCounts[6 - dayIndex] += 1;
          }
        });
        setWeeklyData(dailyCounts.map((count) => Math.min(count, 20)));
      });
    } catch (error) {
      console.error('Error fetching weekly water dispenses:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchWaterLevel, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  return {
    waterLevel,
    isPumpOn,
    togglePump,
    weeklyData,
  };
}
