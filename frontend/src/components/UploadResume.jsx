import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

const UploadResume = ({ onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle'); // idle, uploading, success, error
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a valid PDF or DOCX file.');
      return false;
    }
    
    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
      setError('File size exceeds 5MB limit.');
      return false;
    }
    
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError('');
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setError('');
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setStatus('idle');
    setError('');
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/resumes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setStatus('success');
      if (onUploadSuccess) onUploadSuccess(response.data.data);
    } catch (err) {
      console.error(err);
      setStatus('error');
      setError(err.response?.data?.message || err.response?.data?.error || 'An error occurred during upload. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div 
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          ${file ? 'hidden' : 'block'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className="p-4 bg-white rounded-full shadow-sm">
            <UploadCloud className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-700">
              Drag & drop your resume here
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse files
            </p>
          </div>
          <div className="text-xs text-gray-400">
            Supported formats: PDF, DOCX (Max 5MB)
          </div>
        </div>
      </div>

      {error && status !== 'error' && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {file && (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <File className="w-6 h-6 text-blue-600" />
              </div>
              <div className="truncate">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            
            {status !== 'uploading' && status !== 'success' && (
              <button 
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            
            {status === 'success' && (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            )}
          </div>
          
          {status === 'error' && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          {status === 'idle' || status === 'error' ? (
            <button
              onClick={handleUpload}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
            >
              Upload Resume
            </button>
          ) : status === 'uploading' ? (
            <div className="w-full">
               <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                 <span>Uploading...</span>
               </div>
               <div className="w-full bg-gray-200 rounded-full h-2">
                 <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
               </div>
            </div>
          ) : (
             <button
              onClick={handleRemoveFile}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors"
            >
              Upload Another File
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadResume;
