import React, { useState, useEffect } from 'react'
import { Upload, FileType, Info, X, Bug, ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react'

interface UploadProps {
  file: File | null;
  isUploading: boolean;
  isParsing: boolean;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'text/plain'];
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.doc', '.txt'];

const UploadComponent = ({ file, isUploading, isParsing, handleFileChange, handleUpload }: UploadProps) => {
  const [debugMode, setDebugMode] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [fileInfo, setFileInfo] = useState<{
    size: string;
    type: string;
    lastModified: string;
    isValid: boolean;
    errors: string[];
  } | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Debug logging
  useEffect(() => {
    if (debugMode) {
      console.log('🔍 [UPLOAD DEBUG] Component State:', {
        file: file ? {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: new Date(file.lastModified).toISOString()
        } : null,
        isUploading,
        isParsing,
        dragActive,
        fileInfo
      });
    }
  }, [file, isUploading, isParsing, dragActive, fileInfo, debugMode]);

  // Validate and analyze file
  useEffect(() => {
    if (file) {
      const errors: string[] = [];
      let isValid = true;

      // Size validation
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(MAX_FILE_SIZE)})`);
        isValid = false;
      }

      // Type validation
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(fileExtension) && !ALLOWED_TYPES.includes(file.type)) {
        errors.push(`File type (${file.type || 'unknown'}) is not supported. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`);
        isValid = false;
      }

      setFileInfo({
        size: formatFileSize(file.size),
        type: file.type || 'Unknown',
        lastModified: new Date(file.lastModified).toLocaleString(),
        isValid,
        errors
      });

      if (debugMode) {
        console.log('📄 [UPLOAD DEBUG] File Analysis:', {
          name: file.name,
          size: file.size,
          formattedSize: formatFileSize(file.size),
          type: file.type,
          extension: fileExtension,
          lastModified: new Date(file.lastModified).toISOString(),
          isValid,
          errors
        });
      }
    } else {
      setFileInfo(null);
    }
  }, [file, debugMode]);

  // Simulate upload progress
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      setUploadProgress(0);
    }
  }, [isUploading]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
      if (debugMode) console.log('🖱️ [UPLOAD DEBUG] Drag enter/over');
    } else if (e.type === 'dragleave') {
      setDragActive(false);
      if (debugMode) console.log('🖱️ [UPLOAD DEBUG] Drag leave');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (debugMode) console.log('📥 [UPLOAD DEBUG] File dropped:', e.dataTransfer.files);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      // Create a synthetic event to reuse handleFileChange
      const syntheticEvent = {
        target: {
          files: [droppedFile]
        }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(syntheticEvent);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debugMode) {
      console.log('📁 [UPLOAD DEBUG] File selected:', e.target.files);
    }
    handleFileChange(e);
  };

  const handleUploadClick = () => {
    if (debugMode) {
      console.log('🚀 [UPLOAD DEBUG] Upload initiated:', {
        fileName: file?.name,
        fileSize: file?.size,
        fileType: file?.type,
        isValid: fileInfo?.isValid
      });
    }
    handleUpload();
  };

  const clearFile = () => {
    if (debugMode) console.log('🗑️ [UPLOAD DEBUG] File cleared');
    setFileInfo(null);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.value = '';
    handleFileChange({ target: { files: null } } as any);
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-8 mb-8">
      {/* Debug Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => {
            setDebugMode(!debugMode);
            console.log('🐛 [UPLOAD DEBUG] Debug mode:', !debugMode);
          }}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            debugMode 
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
          }`}
        >
          <Bug size={16} />
          <span>Debug {debugMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center">
          <Upload size={40} className="text-blue-400" />
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
          <p className="text-gray-400 mb-6">Supported formats: PDF, DOCX, TXT (Max {formatFileSize(MAX_FILE_SIZE)})</p>
        </div>
        
        {/* Drag and Drop Area */}
        <div
          className={`w-full border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive 
              ? 'border-blue-500 bg-blue-500/10' 
              : 'border-gray-600 hover:border-gray-500'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <label className="relative cursor-pointer flex flex-col items-center justify-center space-y-4">
            <div className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors">
              <span>Choose File or Drag & Drop</span>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.docx,.doc,.txt" 
              onChange={handleFileSelect}
              disabled={isUploading || isParsing}
            />
            <p className="text-gray-400 text-sm">Click to browse or drag file here</p>
          </label>
        </div>
        
        {/* File Info Display */}
        {file && fileInfo && (
          <div className="w-full bg-gray-700 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-300">
                <FileType size={20} />
                <span className="font-medium">{file.name}</span>
              </div>
              <button
                onClick={clearFile}
                className="text-gray-400 hover:text-red-400 transition-colors"
                disabled={isUploading || isParsing}
              >
                <X size={18} />
              </button>
            </div>

            {/* Validation Status */}
            <div className={`flex items-center space-x-2 ${fileInfo.isValid ? 'text-green-400' : 'text-red-400'}`}>
              {fileInfo.isValid ? (
                <>
                  <CheckCircle2 size={16} />
                  <span className="text-sm">File is valid</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} />
                  <span className="text-sm">File validation failed</span>
                </>
              )}
            </div>

            {/* File Details */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
              <div>
                <span className="font-medium">Size:</span> {fileInfo.size}
              </div>
              <div>
                <span className="font-medium">Type:</span> {fileInfo.type || 'Unknown'}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Last Modified:</span> {fileInfo.lastModified}
              </div>
            </div>

            {/* Validation Errors */}
            {fileInfo.errors.length > 0 && (
              <div className="bg-red-900/30 border border-red-500 rounded p-3 space-y-1">
                <p className="text-red-400 text-sm font-medium">Validation Errors:</p>
                {fileInfo.errors.map((error, idx) => (
                  <p key={idx} className="text-red-300 text-xs">• {error}</p>
                ))}
              </div>
            )}

            {/* Debug Info Toggle */}
            {debugMode && (
              <button
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                className="flex items-center justify-between w-full text-left text-xs text-gray-400 hover:text-gray-300 transition-colors"
              >
                <span className="flex items-center space-x-1">
                  <Info size={14} />
                  <span>Debug Information</span>
                </span>
                {showDebugInfo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}

            {/* Expanded Debug Info */}
            {debugMode && showDebugInfo && (
              <div className="bg-gray-900 rounded p-3 text-xs font-mono text-gray-400 space-y-1 overflow-auto max-h-40">
                <div><span className="text-blue-400">File Name:</span> {file.name}</div>
                <div><span className="text-blue-400">File Size (bytes):</span> {file.size}</div>
                <div><span className="text-blue-400">MIME Type:</span> {file.type || 'N/A'}</div>
                <div><span className="text-blue-400">Last Modified (timestamp):</span> {file.lastModified}</div>
                <div><span className="text-blue-400">Is Valid:</span> {fileInfo.isValid ? 'true' : 'false'}</div>
                <div><span className="text-blue-400">Upload State:</span> {isUploading ? 'Uploading' : isParsing ? 'Parsing' : 'Ready'}</div>
              </div>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && uploadProgress > 0 && (
          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Uploading...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <button
          className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
            file && fileInfo?.isValid && !isUploading && !isParsing
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'
          }`}
          onClick={handleUploadClick}
          disabled={!file || !fileInfo?.isValid || isUploading || isParsing}
        >
          {isUploading 
            ? `Uploading... ${Math.round(uploadProgress)}%` 
            : isParsing 
            ? 'Parsing Resume...' 
            : 'Upload & Parse Resume'
          }
        </button>

        {/* Debug Console Output */}
        {debugMode && (
          <div className="w-full bg-gray-900 rounded-lg p-4 text-xs font-mono text-gray-400">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400">🐛 Debug Console</span>
              <span className="text-gray-500">Check browser console for detailed logs</span>
            </div>
            <div className="space-y-1 text-gray-500">
              <div>• File selection events logged</div>
              <div>• Drag & drop events logged</div>
              <div>• File validation details logged</div>
              <div>• Upload state changes logged</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadComponent