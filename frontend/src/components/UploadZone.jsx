import { useRef, useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const ACCEPTED_TYPES = ['.log', '.txt', '.json'];

export default function UploadZone({ onFileSelected, isUploading }) {
  const [dragActive, setDragActive] = useState(false);
  const [localFileName, setLocalFileName] = useState('');
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (!files?.length) return;
    const file = files[0];
    const match = file.name.match(/\.[^.]+$/);
    const extension = match ? match[0].toLowerCase() : '';
    if (!ACCEPTED_TYPES.includes(extension)) {
      alert(`Unsupported file type: ${extension}`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File exceeds 5MB limit.');
      return;
    }
    setLocalFileName(file.name);
    onFileSelected(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
        dragActive ? 'border-primary bg-primary/10' : 'border-slate-700 bg-slate-900/40'
      }`}
    >
      <FiUploadCloud className="mx-auto mb-4 text-4xl text-primary" />
      <p className="text-lg font-semibold">Drag & Drop your log file</p>
      <p className="text-sm text-slate-400">Supported: .log, .txt, .json (max 5MB)</p>

      <button
        type="button"
        className="mt-6 rounded-lg bg-primary px-6 py-2 font-semibold text-white hover:bg-primary/90 disabled:opacity-60"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Choose File'}
      </button>
      {localFileName && <p className="mt-4 text-sm text-slate-300">{localFileName}</p>}

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={ACCEPTED_TYPES.join(',')}
        onChange={(event) => handleFiles(event.target.files)}
      />
    </div>
  );
}

