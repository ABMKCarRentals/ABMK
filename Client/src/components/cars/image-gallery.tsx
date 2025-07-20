import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Button } from "../ui/button";

const ImageGallery = ({ images = [] }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handlePrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageError = (e) => {
    e.target.src = "/placeholder-car.jpg";
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">No images available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <img
          src={images[selectedImage]?.url || "/placeholder-car.jpg"}
          alt={images[selectedImage]?.alt || "Car image"}
          className="w-full h-96 object-cover rounded-lg"
          onError={handleImageError}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Fullscreen Button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-4 right-4 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full flex items-center justify-center transition-all duration-200"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                selectedImage === index
                  ? "border-yellow-600"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <img
                src={image.url || "/placeholder-car.jpg"}
                alt={image.alt || `Car image ${index + 1}`}
                className="w-full h-full object-cover"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <img
              src={images[selectedImage]?.url || "/placeholder-car.jpg"}
              alt={images[selectedImage]?.alt || "Car image"}
              className="max-w-full max-h-full object-contain"
              onError={handleImageError}
            />

            {/* Close Button */}
            <button
              onClick={() => setIsFullscreen(false)}
              className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center transition-all duration-200"
            >
              ×
            </button>

            {/* Navigation in Fullscreen */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full flex items-center justify-center transition-all duration-200"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
