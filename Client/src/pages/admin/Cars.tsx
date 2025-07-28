import React, { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";

import { addCarFormElements } from "@/config";
import CarImageUpload from "@/components/admin/imageupload";
import AdminCarTile from "@/components/admin/car-tile";

import { useToast } from "@/hooks/use-toast";
import { useAdminCars } from "@/hooks/useAdmincars";
import type { Car } from "@/types/Car";

const initialFormData: Car = {
  _id: "",
  name: "",
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  category: "",
  transmission: "Automatic",
  fuelType: "Petrol",
  seats: 5,
  location: "Business Bay, Dubai",
  description: "",
  features: [],
  specifications: {
    engine: "",
    horsepower: undefined,
    topSpeed: undefined,
    acceleration: "",
    mileage: "",
    color: "",
    interiorColor: "",
  },
  metaTitle: "",
  metaDescription: "",
  isFeatured: false,
  isActive: true,
  isAvailable: true,
  images: [],
  slug: "",
  viewCount: 0,
  bookingCount: 0,
  status: "",
  createdAt: "",
  updatedAt: "",
  createdBy: "",
  updatedBy: "",
};

function AdminCars() {
  const { toast } = useToast();

  const {
    carList,
    carStats,
    isLoading,
    error,
    getAllCars,
    createCar,
    updateCar,
    removeCar,
    toggleAvailability,
    fetchStats,
    clearAllCarErrors,
  } = useAdminCars();

  const [openCreateCarDialog, setOpenCreateCarDialog] = useState(false);
  const [formData, setFormData] = useState<Car>(initialFormData);
  const [carImages, setCarImages] = useState<any[]>([]);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  const [filters, setFilters] = useState<{
    search: string;
    brand: string;
    category: string;
    status: string;
    isActive: string;
    isFeatured: string;
    [key: string]: string;
  }>({
    search: "",
    brand: "all",
    category: "all",
    status: "all",
    isActive: "all",
    isFeatured: "all",
  });
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);

  useEffect(() => {
    getAllCars();
    fetchStats();
  }, [getAllCars, fetchStats]);

  useEffect(() => {
    if (carList && carList.length > 0) {
      applyFilters();
    } else {
      setFilteredCars([]);
    }
  }, [carList, filters]);

  useEffect(() => {
    clearAllCarErrors();
  }, [clearAllCarErrors]);

  const resetForm = () => {
    setFormData(initialFormData);
    setCarImages([]);
    setCurrentEditedId(null);
    setImageLoadingStates([]);
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      brand: "all",
      category: "all",
      status: "all",
      isActive: "all",
      isFeatured: "all",
    });
  };

  const applyFilters = () => {
    let filtered = [...(carList || [])];

    if (filters.search.trim() !== "") {
      filtered = filtered.filter(
        (car) =>
          (car.name || "")
            .toLowerCase()
            .includes(filters.search.trim().toLowerCase()) ||
          (car.brand || "")
            .toLowerCase()
            .includes(filters.search.trim().toLowerCase()) ||
          (car.model || "")
            .toLowerCase()
            .includes(filters.search.trim().toLowerCase())
      );
    }

    if (filters.brand && filters.brand !== "all") {
      filtered = filtered.filter((car) => car.brand === filters.brand);
    }

    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((car) => car.category === filters.category);
    }

    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((car) => car.status === filters.status);
    }

    if (filters.isActive && filters.isActive !== "all") {
      filtered = filtered.filter(
        (car) => car.isActive === (filters.isActive === "true")
      );
    }

    if (filters.isFeatured && filters.isFeatured !== "all") {
      filtered = filtered.filter(
        (car) => car.isFeatured === (filters.isFeatured === "true")
      );
    }

    setFilteredCars(filtered);
  };

  const isFormValid = () => {
    const requiredFields: (keyof Car)[] = [
      "name",
      "brand",
      "model",
      "year",
      "category",
      "transmission",
      "fuelType",
      "seats",
    ];

    return (
      requiredFields.every((field) => {
        const value = formData[field];
        if (typeof value === "number") {
          return value !== null && !isNaN(value);
        }
        return value !== undefined && value !== null && value !== "";
      }) && carImages.length > 0
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (imageLoadingStates.some((state) => state)) {
      toast({
        variant: "destructive",
        title: "Please wait",
        description: "Images are still uploading...",
      });
      return;
    }

    if (carImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "At least one car image is required",
      });
      return;
    }

    const processedFormData = {
      ...formData,
      year: Number(formData.year),
      seats: Number(formData.seats),
      images: carImages.map((img: any, index: number) => ({
        url: img.url,
        alt: img.alt || `${formData.name} - Image ${index + 1}`,
        isPrimary: index === 0,
      })),
      specifications: {
        ...formData.specifications,
        horsepower: formData.specifications.horsepower
          ? Number(formData.specifications.horsepower)
          : undefined,
        topSpeed: formData.specifications.topSpeed
          ? Number(formData.specifications.topSpeed)
          : undefined,
      },
    };

    try {
      const response = await (currentEditedId
        ? updateCar(currentEditedId, processedFormData)
        : createCar(processedFormData));

      if (
        response &&
        response.payload &&
        typeof response.payload === "object" &&
        "success" in response.payload &&
        (response.payload as { success: boolean }).success
      ) {
        toast({
          title: "Success",
          description: `Car ${
            currentEditedId ? "updated" : "added"
          } successfully!`,
        });
        getAllCars();
        fetchStats();
        resetForm();
        setOpenCreateCarDialog(false);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${currentEditedId ? "update" : "add"} car: ${
          error.message || "Unknown error"
        }`,
      });
    }
  };

  const handleDelete = async (carId: string) => {
    try {
      const response = await removeCar(carId);
      if (
        response &&
        response.payload &&
        typeof response.payload === "object" &&
        "success" in response.payload &&
        (response.payload as { success: boolean }).success
      ) {
        toast({
          title: "Success",
          description: "Car deleted successfully!",
        });
        getAllCars();
        fetchStats();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete car",
      });
    }
  };

  const handleToggleAvailability = async (carId: string) => {
    try {
      const response = await toggleAvailability(carId);
      if (
        response &&
        response.payload &&
        typeof response.payload === "object" &&
        "success" in response.payload &&
        (response.payload as { success: boolean }).success
      ) {
        toast({
          title: "Success",
          description: "Car availability updated successfully!",
        });
        getAllCars();
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to toggle car availability",
      });
    }
  };

  const handleEditCar = (car: Car) => {
    setFormData({
      ...car,
      specifications: car.specifications || initialFormData.specifications,
    });
    setCarImages(car.images || []);
    setCurrentEditedId(car._id);
    setOpenCreateCarDialog(true);
  };

  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  // Helper to handle input/select/textarea changes
  const handleFieldChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    let parsedValue: any = value;

    if (type === "number") {
      parsedValue = value === "" ? "" : parseFloat(value);
    }

    // Special handling for nested specifications fields
    if (name.startsWith("specifications.")) {
      const specKey = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specKey]: parsedValue,
        },
      }));
    } else if (name === "features") {
      // features as multiselect
      const selectedOptions = Array.from(
        (e.target as HTMLSelectElement).selectedOptions
      ).map((opt) => opt.value);
      setFormData((prev) => ({
        ...prev,
        features: selectedOptions,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: parsedValue,
      }));
    }
  };

  // Handle switches
  const handleSwitchChange = (name: keyof Car, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Extract unique values for filters
  const uniqueBrands = carList
    ? [...new Set(carList.map((car: Car) => car.brand))].filter(
        (brand) => brand && brand.trim() !== ""
      )
    : [];

  const uniqueCategories = carList
    ? [...new Set(carList.map((car: Car) => car.category))].filter(
        (category) => category && category.trim() !== ""
      )
    : [];

  const uniqueStatuses = carList
    ? [...new Set(carList.map((car: Car) => car.status))].filter(
        (status) => status && status.trim() !== ""
      )
    : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Fragment>
        {/* Car Statistics */}
        {carStats && (
          <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-900 p-4 rounded-lg border border-blue-700">
              <h3 className="text-lg font-semibold text-blue-300">
                Total Cars
              </h3>
              <p className="text-2xl font-bold text-blue-100">
                {carStats.totalCars}
              </p>
            </div>
            <div className="bg-green-900 p-4 rounded-lg border border-green-700">
              <h3 className="text-lg font-semibold text-green-300">
                Available
              </h3>
              <p className="text-2xl font-bold text-green-100">
                {carStats.availableCars}
              </p>
            </div>
            <div className="bg-yellow-900 p-4 rounded-lg border border-yellow-700">
              <h3 className="text-lg font-semibold text-yellow-300">
                Featured
              </h3>
              <p className="text-2xl font-bold text-yellow-100">
                {carStats.featuredCars}
              </p>
            </div>
            <div className="bg-red-900 p-4 rounded-lg border border-red-700">
              <h3 className="text-lg font-semibold text-red-300">Rented</h3>
              <p className="text-2xl font-bold text-red-100">
                {carStats.rentedCars}
              </p>
            </div>
          </div>
        )}

        {/* Car Filters */}
        <div className="mb-5 p-4 bg-gray-800 rounded-lg shadow-sm border border-gray-700">
          <h3 className="text-lg font-medium mb-3 text-white">Filter Cars</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="dark-label text-sm font-medium mb-2 block">
                Search
              </Label>
              <Input
                placeholder="Search by name, brand, or model"
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="dark-input"
              />
            </div>
            <div>
              <Label className="dark-label text-sm font-medium mb-2 block">
                Brand
              </Label>
              <Select
                value={filters.brand}
                onValueChange={(value) =>
                  setFilters({ ...filters, brand: value })
                }
              >
                <SelectTrigger className="dark-select-trigger">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent className="dark-select-content">
                  <SelectItem value="all" className="dark-select-item">
                    All Brands
                  </SelectItem>
                  {uniqueBrands.map((brand) => (
                    <SelectItem
                      key={brand}
                      value={brand}
                      className="dark-select-item"
                    >
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="dark-label text-sm font-medium mb-2 block">
                Category
              </Label>
              <Select
                value={filters.category}
                onValueChange={(value) =>
                  setFilters({ ...filters, category: value })
                }
              >
                <SelectTrigger className="dark-select-trigger">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="dark-select-content">
                  <SelectItem value="all" className="dark-select-item">
                    All Categories
                  </SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                      className="dark-select-item"
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="dark-label text-sm font-medium mb-2 block">
                Status
              </Label>
              <Select
                value={filters.status}
                onValueChange={(value) =>
                  setFilters({ ...filters, status: value })
                }
              >
                <SelectTrigger className="dark-select-trigger">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="dark-select-content">
                  <SelectItem value="all" className="dark-select-item">
                    All Statuses
                  </SelectItem>
                  {uniqueStatuses.map((status) => (
                    <SelectItem
                      key={status}
                      value={status}
                      className="dark-select-item"
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="dark-label text-sm font-medium mb-2 block">
                Active Status
              </Label>
              <Select
                value={filters.isActive}
                onValueChange={(value) =>
                  setFilters({ ...filters, isActive: value })
                }
              >
                <SelectTrigger className="dark-select-trigger">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="dark-select-content">
                  <SelectItem value="all" className="dark-select-item">
                    All
                  </SelectItem>
                  <SelectItem value="true" className="dark-select-item">
                    Active
                  </SelectItem>
                  <SelectItem value="false" className="dark-select-item">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="dark-label text-sm font-medium mb-2 block">
                Featured Status
              </Label>
              <Select
                value={filters.isFeatured}
                onValueChange={(value) =>
                  setFilters({ ...filters, isFeatured: value })
                }
              >
                <SelectTrigger className="dark-select-trigger">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent className="dark-select-content">
                  <SelectItem value="all" className="dark-select-item">
                    All
                  </SelectItem>
                  <SelectItem value="true" className="dark-select-item">
                    Featured
                  </SelectItem>
                  <SelectItem value="false" className="dark-select-item">
                    Not Featured
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={resetFilters}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        <div className="mb-5 w-full flex justify-between items-center p-3">
          <div>
            <span className="text-sm text-gray-400">
              Showing {filteredCars.length} of {carList ? carList.length : 0}{" "}
              cars
            </span>
          </div>
          <Button
            onClick={() => setOpenCreateCarDialog(true)}
            className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold px-6 py-2 rounded-md"
          >
            Add New Car
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-4 text-gray-400">Loading cars...</p>
            </div>
          ) : filteredCars && filteredCars.length > 0 ? (
            filteredCars.map((carItem) => (
              <AdminCarTile
                key={carItem._id}
                car={carItem}
                handleEdit={() => handleEditCar(carItem)}
                handleDelete={handleDelete}
                handleToggleAvailability={handleToggleAvailability}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-400">No cars found</p>
            </div>
          )}
        </div>

        {/* Modal Dialog for Add/Edit Car */}
        <Dialog
          open={openCreateCarDialog}
          onOpenChange={(open) => {
            if (!open) {
              resetForm();
            }
            setOpenCreateCarDialog(open);
          }}
        >
          <DialogContent className="max-w-6xl max-h-[95vh] p-0 dark-dialog">
            <DialogHeader className="px-6 py-4 border-b border-gray-700 bg-gray-800">
              <DialogTitle className="text-xl font-bold text-white">
                {currentEditedId !== null ? "Edit Car" : "Add New Car"}
              </DialogTitle>
            </DialogHeader>

            <ScrollArea className="max-h-[calc(95vh-80px)] bg-gray-900">
              <form onSubmit={handleSubmit}>
                <div className="bg-gray-900">
                  {/* Car Images Section */}
                  <div className="px-6 py-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Car Images
                    </h3>
                    <CarImageUpload
                      images={carImages}
                      setImages={setCarImages}
                      imageLoadingStates={imageLoadingStates}
                      setImageLoadingStates={setImageLoadingStates}
                    />
                  </div>

                  {/* Basic Information */}
                  <div className="px-6 py-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Car Name *
                        </Label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleFieldChange}
                          placeholder="Enter car name"
                          className="dark-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Brand *
                        </Label>
                        <Select
                          value={formData.brand}
                          onValueChange={(value) =>
                            setFormData((prev) => ({ ...prev, brand: value }))
                          }
                        >
                          <SelectTrigger className="dark-select-trigger">
                            <SelectValue placeholder="Select brand" />
                          </SelectTrigger>
                          <SelectContent className="dark-select-content">
                            {[
                              "Ferrari",
                              "Lamborghini",
                              "Bentley",
                              "Rolls Royce",
                              "Porsche",
                              "Mercedes",
                              "BMW",
                              "Audi",
                              "Toyota",
                              "Honda",
                              "Nissan",
                              "Hyundai",
                              "Other",
                            ].map((brand) => (
                              <SelectItem
                                key={brand}
                                value={brand}
                                className="dark-select-item"
                              >
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Model *
                        </Label>
                        <Input
                          name="model"
                          value={formData.model}
                          onChange={handleFieldChange}
                          placeholder="Enter car model"
                          className="dark-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Year *
                        </Label>
                        <Input
                          name="year"
                          type="number"
                          value={formData.year}
                          onChange={handleFieldChange}
                          min={1990}
                          max={new Date().getFullYear() + 1}
                          placeholder="Enter manufacture year"
                          className="dark-input"
                          required
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Category *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              category: value,
                            }))
                          }
                        >
                          <SelectTrigger className="dark-select-trigger">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="dark-select-content">
                            {[
                              "Luxury",
                              "Sports",
                              "SUV",
                              "Sedan",
                              "Convertible",
                              "Coupe",
                              "Hatchback",
                            ].map((cat) => (
                              <SelectItem
                                key={cat}
                                value={cat}
                                className="dark-select-item"
                              >
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Transmission *
                        </Label>
                        <Select
                          value={formData.transmission}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              transmission: value,
                            }))
                          }
                        >
                          <SelectTrigger className="dark-select-trigger">
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                          <SelectContent className="dark-select-content">
                            {["Automatic", "Manual"].map((t) => (
                              <SelectItem
                                key={t}
                                value={t}
                                className="dark-select-item"
                              >
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Fuel Type *
                        </Label>
                        <Select
                          value={formData.fuelType}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              fuelType: value,
                            }))
                          }
                        >
                          <SelectTrigger className="dark-select-trigger">
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                          <SelectContent className="dark-select-content">
                            {["Petrol", "Diesel", "Electric", "Hybrid"].map(
                              (ft) => (
                                <SelectItem
                                  key={ft}
                                  value={ft}
                                  className="dark-select-item"
                                >
                                  {ft}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Number of Seats *
                        </Label>
                        <Select
                          value={String(formData.seats)}
                          onValueChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              seats: parseInt(value, 10),
                            }))
                          }
                        >
                          <SelectTrigger className="dark-select-trigger">
                            <SelectValue placeholder="Select seats" />
                          </SelectTrigger>
                          <SelectContent className="dark-select-content">
                            {["2", "4", "5", "7", "8"].map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="dark-select-item"
                              >
                                {s} Seats
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Location
                        </Label>
                        <Input
                          name="location"
                          value={formData.location}
                          onChange={handleFieldChange}
                          placeholder="Enter pickup location"
                          className="dark-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="px-6 py-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.isFeatured}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("isFeatured", checked)
                          }
                          className="dark-switch"
                        />
                        <Label className="dark-label text-sm font-medium">
                          Featured Car
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.isActive}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("isActive", checked)
                          }
                          className="dark-switch"
                        />
                        <Label className="dark-label text-sm font-medium">
                          Active
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={formData.isAvailable}
                          onCheckedChange={(checked) =>
                            handleSwitchChange("isAvailable", checked)
                          }
                          className="dark-switch"
                        />
                        <Label className="dark-label text-sm font-medium">
                          Available
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="px-6 py-6 border-b border-gray-800">
                    <Label className="dark-label text-sm font-medium mb-2 block">
                      Description
                    </Label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFieldChange}
                      placeholder="Enter car description, features, and highlights"
                      className="border rounded px-3 py-2 w-full dark-input"
                      rows={4}
                    />
                  </div>

                  {/* Features */}
                  <div className="px-6 py-6 border-b border-gray-800">
                    <Label className="dark-label text-sm font-medium mb-2 block">
                      Car Features
                    </Label>
                    <select
                      name="features"
                      multiple
                      value={formData.features}
                      onChange={handleFieldChange}
                      className="border rounded px-3 py-2 w-full dark-input"
                    >
                      {addCarFormElements
                        .find((el) => el.name === "features")
                        ?.options?.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Specifications */}
                  <div className="px-6 py-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Engine
                        </Label>
                        <Input
                          name="specifications.engine"
                          value={formData.specifications.engine}
                          onChange={handleFieldChange}
                          placeholder="e.g., 3.9L V8 Twin Turbo"
                          className="dark-input"
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Horsepower
                        </Label>
                        <Input
                          name="specifications.horsepower"
                          type="number"
                          value={formData.specifications.horsepower || ""}
                          onChange={handleFieldChange}
                          min={0}
                          placeholder="e.g., 661"
                          className="dark-input"
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Top Speed (km/h)
                        </Label>
                        <Input
                          name="specifications.topSpeed"
                          type="number"
                          value={formData.specifications.topSpeed || ""}
                          onChange={handleFieldChange}
                          min={0}
                          placeholder="e.g., 330"
                          className="dark-input"
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Acceleration (0-100 km/h)
                        </Label>
                        <Input
                          name="specifications.acceleration"
                          value={formData.specifications.acceleration}
                          onChange={handleFieldChange}
                          placeholder="e.g., 3.0 seconds"
                          className="dark-input"
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Mileage
                        </Label>
                        <Input
                          name="specifications.mileage"
                          value={formData.specifications.mileage}
                          onChange={handleFieldChange}
                          placeholder="e.g., 15 km/l city, 20 km/l highway"
                          className="dark-input"
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Exterior Color
                        </Label>
                        <input
                          name="specifications.color"
                          value={formData.specifications.color}
                          onChange={handleFieldChange}
                          className="border rounded px-3 py-2 w-full dark-input"
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Interior Color
                        </Label>
                        <input
                          name="specifications.interiorColor"
                          value={formData.specifications.interiorColor}
                          onChange={handleFieldChange}
                          className="border rounded px-3 py-2 w-full dark-input"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SEO Meta */}
                  <div className="px-6 py-6 border-b border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      SEO & Meta Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Meta Title
                        </Label>
                        <Input
                          name="metaTitle"
                          value={formData.metaTitle}
                          onChange={handleFieldChange}
                          placeholder="SEO title for the car page"
                          className="dark-input"
                          maxLength={60}
                        />
                      </div>
                      <div>
                        <Label className="dark-label text-sm font-medium mb-2 block">
                          Meta Description
                        </Label>
                        <textarea
                          name="metaDescription"
                          value={formData.metaDescription}
                          onChange={handleFieldChange}
                          placeholder="SEO description for the car page"
                          className="border rounded px-3 py-2 w-full dark-input"
                          maxLength={160}
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="px-6 py-6">
                    <Button
                      type="submit"
                      disabled={
                        !isFormValid() ||
                        imageLoadingStates.some((state) => state)
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 text-black w-full font-semibold"
                    >
                      {currentEditedId !== null ? "Update Car" : "Add Car"}
                    </Button>
                  </div>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </Fragment>
    </div>
  );
}

export default AdminCars;
