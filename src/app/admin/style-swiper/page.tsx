'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, Trash2, Eye, Loader2, FolderOpen } from 'lucide-react';
import { StyleSwiperImage } from '@/lib/types';

const CATEGORIES = [
  { value: 'suits', label: 'Suits & Tuxedos' },
  { value: 'shirts', label: 'Shirts' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'shoes', label: 'Shoes' },
  { value: 'trending', label: 'Trending' },
  { value: 'seasonal', label: 'Seasonal' },
];

export default function StyleSwiperAdminPage() {
  const [images, setImages] = useState<StyleSwiperImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch images on component mount and category change
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/style-swiper/images?category=${selectedCategory}`);
      const data = await response.json();
      if (data.success) {
        setImages(data.images);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  // Handle file upload
  const handleUpload = async (files: FileList | File[]) => {
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', selectedCategory === 'all' ? 'general' : selectedCategory);

      try {
        const response = await fetch('/api/style-swiper/upload', {
          method: 'POST',
          body: formData,
        });
        return await response.json();
      } catch (error) {
        console.error('Upload error:', error);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successful = results.filter(r => r?.success);
    
    if (successful.length > 0) {
      await fetchImages();
    }
    
    setUploading(false);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files);
    }
  };

  // Delete image
  const handleDelete = async (key: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch('/api/style-swiper/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        await fetchImages();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  // Load images when component mounts or category changes
  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Style Swiper Image Manager</h1>
          <p className="text-gray-600">Upload and manage images for the Style Swiper feature</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Upload Section */}
        <div
          className={`mb-8 border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
            dragActive ? 'border-amber-500 bg-amber-50' : 'border-gray-300 bg-white'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
          />
          
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex flex-col items-center"
          >
            {uploading ? (
              <Loader2 className="w-12 h-12 text-amber-600 animate-spin mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
            )}
            
            <span className="text-lg font-medium text-gray-900">
              {uploading ? 'Uploading...' : 'Drop images here or click to upload'}
            </span>
            <span className="text-sm text-gray-500 mt-1">
              PNG, JPG, WebP up to 10MB
            </span>
          </label>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Loading...' : `${images.length} Images`}
            </h2>
            <button
              onClick={fetchImages}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No images found. Upload some to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image) => (
                <div
                  key={image.key}
                  className="group relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt={image.key}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end justify-center opacity-0 group-hover:opacity-100">
                    <div className="p-3 flex gap-2">
                      <a
                        href={image.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Eye className="w-4 h-4 text-gray-700" />
                      </a>
                      <button
                        onClick={() => handleDelete(image.key)}
                        className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Category badge */}
                  {image.category && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded-full">
                        {image.category}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}