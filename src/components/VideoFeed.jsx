import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Wifi, WifiOff, MapPin } from 'lucide-react';

const VideoFeed = ({ cameraId, isActive }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [detectionActive, setDetectionActive] = useState(false);

  const locations = {
    1: 'Highway 101 North',
    2: 'Main St & 5th Ave',
    3: 'Interstate 405 South',
    4: 'Downtown Bridge'
  };

  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        // Simulate occasional detection activity
        if (Math.random() < 0.1) {
          setDetectionActive(true);
          setTimeout(() => setDetectionActive(false), 2000);
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isActive]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`relative bg-black rounded-xl overflow-hidden border-2 transition-all duration-300 ${
        detectionActive ? 'border-red-500 pulse-animation' : 'border-gray-600'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Camera className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">Camera {cameraId}</span>
          </div>
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <div className={`w-2 h-2 rounded-full ${isActive && isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
          </div>
        </div>
        <div className="flex items-center space-x-1 mt-1">
          <MapPin className="w-3 h-3 text-gray-300" />
          <span className="text-gray-300 text-xs">{locations[cameraId]}</span>
        </div>
      </div>

      <div className="aspect-video bg-gray-900 relative">
        {isActive && isOnline ? (
          <img  className="w-full h-full object-cover" alt={`Traffic surveillance camera view of ${locations[cameraId]}`} src="https://images.unsplash.com/photo-1648949299693-87f25a2a1f4e" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Camera className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">
                {!isActive ? 'Camera Offline' : 'No Signal'}
              </p>
            </div>
          </div>
        )}

        {detectionActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-red-500/20 border-2 border-red-500"
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                ANOMALY DETECTED
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-300">
            {new Date().toLocaleTimeString()}
          </span>
          <span className={`font-medium ${isActive ? 'text-green-400' : 'text-red-400'}`}>
            {isActive ? 'MONITORING' : 'STANDBY'}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoFeed;