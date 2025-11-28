import React, { useRef, useCallback, useState } from 'react';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState<string>("");
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    onImageChange(file || null);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
        onImageChange(file);
    }
  }, [onImageChange]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const guessMimeFromUrl = (url: string): string | undefined => {
    const ext = url.split('?')[0].split('#')[0].split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'webp':
        return 'image/webp';
      case 'gif':
        return 'image/gif';
      default:
        return undefined;
    }
  };

  const handleLoadFromUrl = async () => {
    setUrlError(null);
    const url = urlInput.trim();
    if (!url) {
      setUrlError('Please enter an image URL');
      return;
    }
    try {
      const res = await fetch(url, { mode: 'cors' });
      if (!res.ok) throw new Error('Failed to fetch');
      const blob = await res.blob();
      const mime = blob.type || guessMimeFromUrl(url) || 'image/jpeg';
      if (!mime.startsWith('image/')) throw new Error('Not an image');
      const name = url.split('/').pop() || 'remote-image';
      const file = new File([blob], name, { type: mime });
      onImageChange(file);
    } catch (e) {
      setUrlError('Unable to load image from URL');
    }
  };

  return (
    <div className="space-y-2">
        <div className="flex gap-2 items-center">
            <input
                type="radio"
                checked={!!previewUrl}
                readOnly
                className="text-blue-600"
            />
            <span className="text-sm text-gray-700">{previewUrl ? "Image loaded" : "No image selected"}</span>
        </div>

        <div
        className="w-full border border-gray-300 bg-white rounded-sm p-3 cursor-pointer hover:border-orange-400 transition-colors flex flex-col items-center justify-center min-h-[80px] text-center"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        >
        <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
        />
        
        {previewUrl ? (
            <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Ready to Analyze</span>
            </div>
        ) : (
            <>
                <span className="text-xs font-bold text-gray-600">UPLOAD IMAGE</span>
                <span className="text-[10px] text-gray-400">or drag & drop</span>
            </>
        )}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLoadFromUrl();
            }}
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-white border border-gray-300 rounded-sm px-2 py-1 text-xs focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={handleLoadFromUrl}
            className="text-xs bg-gray-100 border border-gray-200 hover:border-orange-400 text-gray-700 px-2 py-1 rounded"
          >
            Load URL
          </button>
        </div>
        {urlError && (
          <div className="text-xs text-red-600">{urlError}</div>
        )}
    </div>
  );
};
