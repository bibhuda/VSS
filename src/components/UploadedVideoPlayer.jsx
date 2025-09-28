import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, Play, Pause, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

const UploadedVideoPlayer = ({ onDetect }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const videoRef = useRef(null);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setIsPlaying(false);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please select a valid video file.",
        variant: "destructive",
      });
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    const duration = 10000; // 10 seconds simulation
    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          toast({
            title: "Analysis Complete",
            description: "An anomaly was detected in the video.",
          });
          onDetect({
            location: 'Uploaded Video Analysis',
            severity: 'High',
            type: 'Vehicle Rollover',
            camera: videoFile.name,
            confidence: 95
          });
          return 100;
        }
        return prev + 1;
      });
    }, duration / 100);
  };
  
  const handleRemoveVideo = () => {
    setVideoFile(null);
    setVideoUrl(null);
    setIsPlaying(false);
    setIsAnalyzing(false);
    setAnalysisProgress(0);
    if(videoUrl) URL.revokeObjectURL(videoUrl);
  };

  return (
    <div className="space-y-4">
      {!videoUrl ? (
        <label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-500 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-400">
              <span className="font-semibold text-blue-400">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">MP4, AVI, MOV, etc. (MAX. 500MB)</p>
          </div>
          <input id="video-upload" type="file" className="hidden" accept="video/*" onChange={handleFileChange} />
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            <div className="absolute top-2 right-2">
               <Button variant="destructive" size="icon" onClick={handleRemoveVideo}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button onClick={handlePlayPause}>
                {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button onClick={handleAnalyze} disabled={isAnalyzing}>
                <Search className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Analyze for Anomalies'}
              </Button>
            </div>
            <p className="text-sm text-gray-300 truncate max-w-xs">{videoFile?.name}</p>
          </div>
          
          {isAnalyzing && (
            <div className="space-y-2">
              <p className="text-sm text-blue-300">AI analysis in progress...</p>
              <Progress value={analysisProgress} className="w-full" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadedVideoPlayer;