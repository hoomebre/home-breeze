"use client";

import { useState, useRef } from 'react';
import { Upload, X, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  aspectRatio: number; // e.g., 16/9 or 4/5
  recommendedSize?: string; // e.g., "1080 x 1350 px"
  label: string;
  bucket?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onRemove,
  aspectRatio,
  recommendedSize,
  label,
  bucket = 'saintry'
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checkAspectRatio = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const width = img.width;
        const height = img.height;
        const currentRatio = width / height;
        
        // Allow for a tiny margin of error (0.05)
        const isCorrectRatio = Math.abs(currentRatio - aspectRatio) < 0.05;
        
        if (!isCorrectRatio) {
          const targetText = recommendedSize || (aspectRatio > 1 
            ? `${Math.round(aspectRatio * 100) / 100}:1` 
            : `1:${Math.round((1/aspectRatio) * 100) / 100}`);
            
          setError(`Resolution mismatch. Required: ${targetText}. Your image: ${width}x${height}`);
          resolve(false);
        } else {
          setError(null);
          resolve(true);
        }
      };
    });
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      setError(null);

      const isValid = await checkAspectRatio(file);
      if (!isValid) {
        setIsUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${label.toLowerCase().replace(/\s+/g, '-')}/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onChange(publicUrl);
    } catch (err: any) {
      setError(err.message || 'Error uploading image');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[13px] font-semibold text-gray-900 tracking-tight">{label}</label>
        {value && (
          <button 
            onClick={onRemove}
            className="text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Remove
          </button>
        )}
      </div>

      <div className="relative group">
        {value ? (
          <div 
            className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm transition-all group-hover:border-primary/20"
            style={{ aspectRatio: `${aspectRatio}` }}
          >
            <Image 
              src={value} 
              alt={label} 
              fill 
              className="object-cover"
            />
          </div>
        ) : (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className={`
              w-full flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-all
              ${error ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 hover:border-primary/30'}
              disabled:opacity-50 disabled:cursor-not-allowed min-h-[140px]
            `}
            style={{ aspectRatio: `${aspectRatio}` }}
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-gray-400" />
                </div>
                <span className="text-xs text-gray-900 font-semibold mb-1">Upload Image</span>
                {recommendedSize && (
                  <span className="text-[10px] text-gray-400 font-medium">Rec: {recommendedSize}</span>
                )}
              </>
            )}
          </button>
        )}
        
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={onUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {error && (
        <div className="flex items-start gap-2 text-[11px] text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span className="leading-tight">{error}</span>
        </div>
      )}
    </div>
  );
}

