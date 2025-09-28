import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bluetooth, X, CheckCircle, Loader, Wifi } from 'lucide-react';

const CCTV_DEVICES = [
  { id: 'CCTV-0A1B', name: 'Main St Cam 1', signal: -45 },
  { id: 'CCTV-F29A', name: 'Highway 101 Cam', signal: -62 },
  { id: 'CCTV-3B4C', name: 'Downtown Bridge Cam', signal: -78 },
  { id: 'CCTV-9D8E', name: 'Parking Lot Cam', signal: -55 },
];

const BluetoothCCTVModal = ({ isOpen, setIsOpen, setSystemStats }) => {
  const [step, setStep] = useState('scanning'); // scanning, found, connecting, connected
  const [foundDevices, setFoundDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setStep('scanning');
      setFoundDevices([]);
      setSelectedDevice(null);
      
      const scanTimer = setTimeout(() => {
        setFoundDevices(CCTV_DEVICES);
        setStep('found');
      }, 3000);

      return () => clearTimeout(scanTimer);
    }
  }, [isOpen]);

  const handleConnect = (device) => {
    setSelectedDevice(device);
    setStep('connecting');
    setTimeout(() => {
      setStep('connected');
      setSystemStats(prev => ({
        ...prev,
        totalCameras: prev.totalCameras + 1,
        camerasOnline: prev.camerasOnline + 1,
      }));
    }, 2000);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const renderContent = () => {
    switch (step) {
      case 'scanning':
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-12 h-12 mb-4" />
            </motion.div>
            <p className="text-lg font-medium">Scanning for nearby CCTV devices...</p>
            <p className="text-sm text-gray-400">Please ensure devices are in pairing mode.</p>
          </div>
        );
      case 'found':
        return (
          <div>
            <DialogDescription className="mb-4 text-gray-300">
              Found {foundDevices.length} devices. Select a device to connect.
            </DialogDescription>
            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
              {foundDevices.map((device, index) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Wifi className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="font-semibold text-white">{device.name}</p>
                        <p className="text-xs text-gray-400">{device.id}</p>
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleConnect(device)}>Connect</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'connecting':
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-12 h-12 mb-4 text-blue-400" />
            </motion.div>
            <p className="text-lg font-medium">Connecting to {selectedDevice?.name}...</p>
          </div>
        );
      case 'connected':
        return (
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <CheckCircle className="w-16 h-16 mb-4 text-green-400" />
            </motion.div>
            <p className="text-xl font-bold">Successfully Connected!</p>
            <p className="text-gray-300">{selectedDevice?.name} is now online.</p>
            <Button onClick={handleClose} className="mt-6">Done</Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="glass-effect text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Bluetooth className="w-6 h-6 mr-2 text-blue-400" />
            Connect Bluetooth CCTV
          </DialogTitle>
        </DialogHeader>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default BluetoothCCTVModal;