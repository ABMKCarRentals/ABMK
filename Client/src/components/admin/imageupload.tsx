import { UploadCloudIcon, XIcon, AlertCircle, CheckCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import React, { useState } from "react";
import { Button } from "../ui/button";
import axios from "axios";

// Type for image file slot
interface CarImageUploadFile {
  file?: File;
  url: string | null;
  alt?: string;
}

interface CarImageUploadProps {
  images: (CarImageUploadFile | null)[];
  setImages: React.Dispatch<
    React.SetStateAction<(CarImageUploadFile | null)[]>
  >;
  imageLoadingStates: boolean[];
  setImageLoadingStates: React.Dispatch<React.SetStateAction<boolean[]>>;
}

type ErrorsType = { [index: number]: string | null };
type DragActiveType = { [index: number]: boolean };

export default function CarImageUpload({
  images = [],
  setImages,
  imageLoadingStates = [],
  setImageLoadingStates,
}: CarImageUploadProps) {
  const [errors, setErrors] = useState<ErrorsType>({});
  const [dragActive, setDragActive] = useState<DragActiveType>({});

  // Get backend URL from environment variable
  const backendUrl = import.meta.env.VITE_PORT;

  function handleImageFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile, index);
    }
  }

  function validateAndSetFile(selectedFile: File, index: number) {
    // Reset previous errors
    setErrors((prev) => ({ ...prev, [index]: null }));

    // Validate file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [index]: "File size must be less than 5MB",
      }));
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setErrors((prev) => ({
        ...prev,
        [index]: "Only JPEG, PNG, and WebP images are allowed",
      }));
      return;
    }

    // Add file to the images array
    const newImages = [...images];
    newImages[index] = { file: selectedFile, url: null };
    setImages(newImages);

    // Start upload
    uploadImageToCloudinary(selectedFile, index);
  }

  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive((prev) => ({ ...prev, [index]: true }));
  }

  function handleDragLeave(
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive((prev) => ({ ...prev, [index]: false }));
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>, index: number) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive((prev) => ({ ...prev, [index]: false }));

    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile, index);
    }
  }

  function handleRemoveImage(index: number) {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);

    setErrors((prev) => ({ ...prev, [index]: null }));

    const newLoadingStates = [...imageLoadingStates];
    newLoadingStates[index] = false;
    setImageLoadingStates(newLoadingStates);
  }

  async function uploadImageToCloudinary(file: File, index: number) {
    if (!file) return;

    try {
      // Set loading state for this index
      const newLoadingStates = [...imageLoadingStates];
      newLoadingStates[index] = true;
      setImageLoadingStates(newLoadingStates);

      setErrors((prev) => ({ ...prev, [index]: null }));

      const formData = new FormData();
      formData.append("file", file);

      // Get auth token if needed
      const token =
        localStorage.getItem("adminToken") ||
        sessionStorage.getItem("adminToken");

      const response = await axios.post(
        `${backendUrl}/api/admin/cars/upload-image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      if (response?.data?.success) {
        // Update the image with the URL
        const newImages = [...images];
        newImages[index] = {
          file: file,
          url: response.data.result.url,
          alt: `Car image ${index + 1}`,
        };
        setImages(newImages);
        console.log("Upload successful:", response.data.result.url);
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
    } catch (error: unknown) {
      console.error("Upload error:", error);

      let errorMessage = "Failed to upload image. Please try again.";

      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as any).code === "ECONNABORTED"
      ) {
        errorMessage = "Upload timeout. Please try again.";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.status === 401
      ) {
        errorMessage = "Authentication failed. Please login again.";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.status === 413
      ) {
        errorMessage = "File too large. Maximum size is 5MB.";
      } else if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.data?.message
      ) {
        errorMessage = (error as any).response.data.message;
      }

      setErrors((prev) => ({ ...prev, [index]: errorMessage }));
    } finally {
      // Clear loading state for this index
      const newLoadingStates = [...imageLoadingStates];
      newLoadingStates[index] = false;
      setImageLoadingStates(newLoadingStates);
    }
  }

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Render multiple upload slots
  const renderImageSlot = (index: number) => {
    const image = images[index];
    const isLoading = imageLoadingStates[index];
    const error = errors[index];
    const isDragActive = dragActive[index];
    const isPrimary = index === 0;

    return (
      <div key={index} className="w-full">
        <Label className="text-sm font-medium text-gray-200 mb-3 block flex items-center gap-2">
          {isPrimary ? (
            <>
              <span>Primary Image</span>
              <span className="text-red-400 text-xs">*</span>
            </>
          ) : (
            `Additional Image ${index + 1}`
          )}
        </Label>

        <div
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={(e) => handleDragLeave(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          className={`
            relative border-2 border-dashed rounded-lg transition-all duration-200
            ${
              isDragActive
                ? "border-yellow-500 bg-yellow-500/10"
                : error
                ? "border-red-500 bg-red-500/5"
                : image?.url
                ? "border-green-500 bg-green-500/5"
                : "border-gray-600 hover:border-gray-500 bg-gray-800/50"
            }
          `}
        >
          <Input
            id={`image-upload-${index}`}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleImageFileChange(e, index)}
            aria-describedby={error ? `error-${index}` : undefined}
          />

          {!image?.url ? (
            <Label
              htmlFor={`image-upload-${index}`}
              className="flex flex-col items-center justify-center p-6 h-32 cursor-pointer group"
            >
              <UploadCloudIcon
                className={`w-8 h-8 mb-2 transition-colors ${
                  error
                    ? "text-red-400"
                    : isDragActive
                    ? "text-yellow-400"
                    : "text-gray-400 group-hover:text-gray-300"
                }`}
              />
              <span className="text-sm text-gray-300 text-center mb-1">
                {isDragActive
                  ? "Drop image here"
                  : isPrimary
                  ? "Upload primary image"
                  : "Upload additional image"}
              </span>
              <span className="text-xs text-gray-500 text-center">
                JPEG, PNG, WebP up to 5MB
              </span>
            </Label>
          ) : isLoading ? (
            <div className="p-6 h-32 flex items-center justify-center flex-col">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm text-gray-300">Uploading...</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1 mt-3">
                <div className="bg-yellow-500 h-1 rounded-full animate-pulse w-1/2"></div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={image.url!}
                      alt={`Car image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-600"
                    />
                    <CheckCircle className="absolute -top-2 -right-2 w-5 h-5 text-green-400 bg-gray-800 rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-200">
                      {isPrimary ? "Primary Image" : `Image ${index + 1}`}
                    </p>
                    {image.file && (
                      <>
                        <p className="text-xs text-gray-400 truncate max-w-[200px]">
                          {image.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(image.file.size)}
                        </p>
                      </>
                    )}
                    <div className="flex items-center gap-1 text-xs text-green-400">
                      <CheckCircle className="w-3 h-3" />
                      Upload complete
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <XIcon className="w-4 h-4" />
                  <span className="sr-only">Remove Image</span>
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div
              id={`error-${index}`}
              className="absolute bottom-2 left-2 right-2 flex items-center gap-2 text-xs text-red-400 bg-red-500/10 rounded px-2 py-1"
            >
              <AlertCircle className="w-3 h-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Render primary image (index 0) */}
      {renderImageSlot(0)}

      {/* Render additional image slots (indices 1-4) */}
      {[1, 2, 3, 4].map((index) => (
        <div key={index}>{renderImageSlot(index)}</div>
      ))}

      <div className="text-xs text-gray-500 mt-2">
        * Primary image is required. You can upload up to 5 images total.
      </div>
    </div>
  );
}
