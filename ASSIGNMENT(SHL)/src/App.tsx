import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { Mic, StopCircle, Upload, AudioWaveform as Waveform } from 'lucide-react';

interface AnalysisResult {
  grammar_score: number;
}

function App() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const { status, startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({
    audio: true,
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await analyzeAudio(file);
    }
  };

  const handleStopRecording = async () => {
    stopRecording();
    if (mediaBlobUrl) {
      const response = await fetch(mediaBlobUrl);
      const blob = await response.blob();
      const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
      await analyzeAudio(file);
    }
  };

  const analyzeAudio = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze audio');
      }

      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error('Error analyzing audio:', error);
      alert('Failed to analyze audio. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-900 mb-4">Grammar Scoring Engine</h1>
          <p className="text-lg text-gray-600">Record or upload audio to analyze your grammar</p>
        </header>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col items-center gap-6">
            {status === 'recording' ? (
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                <StopCircle className="w-5 h-5" />
                Stop Recording
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Mic className="w-5 h-5" />
                Start Recording
              </button>
            )}

            <div className="relative">
              <input
                type="file"
                accept="audio/wav"
                onChange={handleFileUpload}
                className="hidden"
                id="audio-upload"
              />
              <label
                htmlFor="audio-upload"
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <Upload className="w-5 h-5" />
                Upload Audio File
              </label>
            </div>
          </div>
        </div>

        {isAnalyzing && (
          <div className="text-center p-8">
            <Waveform className="w-12 h-12 animate-pulse text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your audio...</p>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Grammar Score</h2>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-3xl font-bold text-indigo-600">{result.grammar_score}</span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-indigo-600 h-2.5 rounded-full"
                      style={{ width: `${(result.grammar_score/5)*100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;