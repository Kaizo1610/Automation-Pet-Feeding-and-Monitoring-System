import { useState, useEffect } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../configs/FirebaseConfig';

export function useWaterLevel() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [waterDispenseCount, setWaterDispenseCount] = useState(0);

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
      const dispenseRef = ref(database, 'waterDispenses/' + Date.now());
      await set(dispenseRef, {
        dispenseTime: Date.now(),
        waterCount: waterDispenseCount,
      });
      setWaterDispenseCount(waterDispenseCount + 1);
    } catch (error) {
      console.error('Error recording water dispense:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchWaterLevel, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    waterLevel,
    isPumpOn,
    togglePump,
  };
}
