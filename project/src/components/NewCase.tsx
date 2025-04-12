import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { Camera, Fingerprint, Mic, Eye, FileVideo, Upload, Check } from 'lucide-react';

const NewCase = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState({
    photo: null,
    video: null,
    fingerprint: null,
    voice: null,
    iris: null,
  });
  const [submitted, setSubmitted] = useState(false);

  const onDrop = useCallback((acceptedFiles, type) => {
    setFiles(prev => ({
      ...prev,
      [type]: acceptedFiles[0]
    }));
  }, []);

  const evidenceTypes = [
    { type: 'photo', icon: Camera, label: 'Face/Photo', accept: 'image/*' },
    { type: 'video', icon: FileVideo, label: 'Video Footage', accept: 'video/*' },
    { type: 'fingerprint', icon: Fingerprint, label: 'Fingerprint Scan', accept: 'image/*' },
    { type: 'voice', icon: Mic, label: 'Voice Recording', accept: 'audio/*' },
    { type: 'iris', icon: Eye, label: 'Iris Image', accept: 'image/*' },
  ];

  // Create dropzone configurations outside of the render loop
  const dropzones = evidenceTypes.map(({ type, accept }) => 
    useDropzone({
      onDrop: (files) => onDrop(files, type),
      accept: { [accept]: [] },
      maxFiles: 1,
    })
  );

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-8">Add New Case</h1>
      
      {!submitted ? (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Upload Crime Scene Evidence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {evidenceTypes.map(({ type, icon: Icon, label }, index) => (
              <div key={type} className="relative">
                <div
                  {...dropzones[index].getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-6 hover:border-blue-500 transition-colors
                    ${files[type] ? 'border-green-500 bg-green-50' : 'border-slate-300'}`}
                >
                  <input {...dropzones[index].getInputProps()} />
                  <div className="flex flex-col items-center text-center">
                    <Icon className={`w-8 h-8 mb-2 ${files[type] ? 'text-green-500' : 'text-slate-400'}`} />
                    <p className="font-medium text-slate-700">{label}</p>
                    {files[type] ? (
                      <p className="text-sm text-green-600 mt-2">File uploaded successfully</p>
                    ) : (
                      <p className="text-sm text-slate-500 mt-2">Drag & drop or click to upload</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Upload className="w-5 h-5 mr-2" />
            Submit Evidence
          </button>
        </div>
      ) : (
  <div className="bg-white rounded-xl p-6 shadow-sm text-center">
    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Check className="w-8 h-8 text-green-500" />
    </div>
    <h2 className="text-xl font-semibold text-slate-800 mb-2">Evidence Stored Successfully</h2>
    <p className="text-slate-600 mb-6">The uploaded evidence has been securely stored.</p>

    <div className="flex flex-wrap justify-center gap-4 mb-6">
      {files.fingerprint && (
        <button
          onClick={() => navigate('/match-fingerprint')}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          Match Fingerprint
        </button>
      )}

      {files.voice && (
        <button
          onClick={() => navigate('/match-voice')}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          Match Voice
        </button>
      )}

      {files.photo && (
        <button
          onClick={() => navigate('/match-face')}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          Match Face
        </button>
      )}
    </div>

    <button
      onClick={() => navigate('/add-suspect')}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
    >
      Proceed to Suspect Matching
    </button>
  </div>
)}
    </div>
  );
};

export default NewCase;