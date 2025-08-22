import React, { useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Image {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

interface ImageGalleryProps {
  images: Image[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // For modal navigation, so it doesn't change selectedImage in main gallery
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const modalNext = () =>
    setModalImageIndex((prev) => (prev + 1) % images.length);
  const modalPrev = () =>
    setModalImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div
          className="relative cursor-zoom-in"
          onClick={() => openModal(selectedImage)}
        >
          <img
            src={images[selectedImage]?.url || "/api/placeholder/800/400"}
            alt={images[selectedImage]?.alt || "Car image"}
            className="w-full h-64 md:h-96 object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.src = "/api/placeholder/800/400";
            }}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Images */}
        {images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {images.map((image, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                  index === selectedImage
                    ? "border-yellow-400 ring-2 ring-yellow-400"
                    : "border-gray-600 hover:border-gray-500"
                }`}
                style={{
                  boxShadow:
                    index === selectedImage
                      ? "0 0 0 2px rgba(253, 224, 71, 0.6)"
                      : undefined,
                  outline: "none",
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(index);
                  }}
                  onError={(e) => {
                    e.currentTarget.src = "/api/placeholder/64/64";
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative max-w-3xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={images[modalImageIndex]?.url || "/api/placeholder/800/400"}
              alt={images[modalImageIndex]?.alt || "Car image"}
              className="w-full h-[50vh] md:h-[70vh] object-contain rounded-lg bg-black"
              onError={(e) => {
                e.currentTarget.src = "/api/placeholder/800/400";
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={modalPrev}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={modalNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {/* Modal thumbnails */}
            {images.length > 1 && (
              <div className="flex space-x-2 mt-4 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setModalImageIndex(idx)}
                    className={`w-14 h-14 rounded overflow-hidden border-2 transition-colors ${
                      idx === modalImageIndex
                        ? "border-yellow-400 ring-2 ring-yellow-400"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/api/placeholder/64/64";
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
