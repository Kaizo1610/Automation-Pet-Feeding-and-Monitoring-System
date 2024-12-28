// FoodLevelLogic.ts
import { useState, useEffect } from 'react';
import { ref, set, onValue } from 'firebase/database';
import { database, getCurrentUserId } from '../../configs/FirebaseConfig';

export function useFoodLevel() {
  const [foodLevel, setFoodLevel] = useState(0);
  const [isServoOn, setIsServoOn] = useState(false);
  const [timerValue, setTimerValue] = useState('');
  const [foodDispenseCount, setFoodDispenseCount] = useState(0);
  const [weeklyData, setWeeklyData] = useState<number[]>(Array(7).fill(0));

  const fetchFoodLevel = async () => {
    try {
      const response = await fetch('https://blynk.cloud/external/api/get?token=NqXOR_TdkhVvJzSK4N6WxLGmZNoKu6Se&pin=V2');
      const data = await response.text();
      const level = parseFloat(data);

      if (!isNaN(level)) {
        const maxLevel = 20; // Replace with the max level value from your setup
        const progress = Math.max(0, Math.min(1, level / maxLevel));
        setFoodLevel(progress);
      } else {
        console.error('Invalid food level:', data);
      }
    } catch (error) {
      console.error('Error fetching food level:', error);
    }
  };

  const toggleServo = async (value: boolean) => {
    try {
      setIsServoOn(value);
      const servoState = value ? '1' : '0';
      await fetch(`https://blynk.cloud/external/api/update?token=NqXOR_TdkhVvJzSK4N6WxLGmZNoKu6Se&pin=V4&value=${servoState}`);

      // Record food dispense event to Firebase
      if (value) {
        await recordFoodDispense();
      }
    } catch (error) {
      console.error('Error toggling servo motor:', error);
    }
  };

  const recordFoodDispense = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const dispenseRef = ref(database, `users/${userId}/foodDispenses/${Date.now()}`);
      await set(dispenseRef, {
        dispenseTime: Date.now(),
        foodCount: foodDispenseCount,
      });
      setFoodDispenseCount(foodDispenseCount + 1);
    } catch (error) {
      console.error('Error recording dispense:', error);
    }
  };

  const updateTimerValue = async () => {
    const minutes = parseInt(timerValue);
    if (isNaN(minutes) || minutes <= 0) {
      alert('Please enter a valid timer value (in minutes)');
      return;
    }

    try {
      await fetch(`https://blynk.cloud/external/api/update?token=NqXOR_TdkhVvJzSK4N6WxLGmZNoKu6Se&pin=V3&value=${minutes}`);
    } catch (error) {
      console.error('Error updating timer value:', error);
    }
  };

  const fetchWeeklyData = async () => {
    try {
      const userId = getCurrentUserId();
      if (!userId) throw new Error("User not authenticated");

      const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const dispensesRef = ref(database, `users/${userId}/foodDispenses`);
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
      console.error('Error fetching weekly food dispenses:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchFoodLevel, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  return {
    foodLevel,
    isServoOn,
    timerValue,
    setTimerValue,
    toggleServo,
    updateTimerValue,
    weeklyData,
  };
}
