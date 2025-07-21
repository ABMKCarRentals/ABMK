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

import CommonForm from "@/components/common/form";
import { addCarFormElements } from "@/config";
import CarImageUpload from "@/components/admin/imageupload";
import AdminCarTile from "@/components/admin/car-tile";

import { useToast } from "@/hooks/use-toast";
import { useAdminCars } from "@/hooks/useAdmincars";

const initialFormData = {
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
    horsepower: "",
    topSpeed: "",
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
};

function AdminCars() {
  const { toast } = useToast();

  // Use the custom hook
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
    uploadImage,
  } = useAdminCars();

  const [openCreateCarDialog, setOpenCreateCarDialog] = useState(false);
  const [formData, setFormData] =
    useState<typeof initialFormData>(initialFormData);
  const [carImages, setCarImages] = useState<any[]>([]);
  const [imageLoadingStates, setImageLoadingStates] = useState<boolean[]>([]);
  const [currentEditedId, setCurrentEditedId] = useState<string | null>(null);

  // Filter states (removed price filters)
  const [filters, setFilters] = useState({
    search: "",
    brand: "all",
    category: "all",
    status: "all",
    isActive: "all",
    isFeatured: "all",
  });
  const [filteredCars, setFilteredCars] = useState<any[]>([]);

  useEffect(() => {
    getAllCars();
    fetchStats();
    // eslint-disable-next-line
  }, [getAllCars, fetchStats]);

  useEffect(() => {
    if (carList && carList.length > 0) {
      applyFilters();
    } else {
      setFilteredCars([]);
    }
    // eslint-disable-next-line
  }, [carList, filters]);

  // Clear errors on mount
  useEffect(() => {
    clearAllCarErrors();
    // eslint-disable-next-line
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
          car.name
            .toLowerCase()
            .includes(filters.search.trim().toLowerCase()) ||
          car.brand
            .toLowerCase()
            .includes(filters.search.trim().toLowerCase()) ||
          car.model.toLowerCase().includes(filters.search.trim().toLowerCase())
      );
    }

    // Filter by brand
    if (filters.brand && filters.brand !== "all") {
      filtered = filtered.filter((car) => car.brand === filters.brand);
    }

    // Filter by category
    if (filters.category && filters.category !== "all") {
      filtered = filtered.filter((car) => car.category === filters.category);
    }

    // Filter by status
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter((car) => car.status === filters.status);
    }

    // Filter by active status
    if (filters.isActive && filters.isActive !== "all") {
      filtered = filtered.filter(
        (car) => car.isActive === (filters.isActive === "true")
      );
    }

    // Filter by featured status
    if (filters.isFeatured && filters.isFeatured !== "all") {
      filtered = filtered.filter(
        (car) => car.isFeatured === (filters.isFeatured === "true")
      );
    }

    setFilteredCars(filtered);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () => {
    const requiredFields = [
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
        const value = formData[field as keyof typeof formData];
        if (typeof value === "number") {
          return value !== null && !isNaN(value);
        }
        return value !== undefined && value !== null && value !== "";
      }) && carImages.length > 0
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      images: carImages.map((img, index) => ({
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

      if (response.payload?.success) {
        toast({
          title: "Success",
          description: `Car ${
            currentEditedId ? "updated" : "added"
          } successfully!`,
        });
        // Refresh data
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
      if (response.payload?.success) {
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
      if (response.payload?.success) {
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

  const handleEditCar = (car: typeof initialFormData & { _id: string }) => {
    setFormData({
      ...car,
      specifications: car.specifications || initialFormData.specifications,
    });
    setCarImages(car.images || []);
    setCurrentEditedId(car._id);
    setOpenCreateCarDialog(true);
  };

  // Extract unique values for filters
  const uniqueBrands = carList
    ? [...new Set(carList.map((car: any) => car.brand))].filter(
        (brand) => brand && brand.trim() !== ""
      )
    : [];

  const uniqueCategories = carList
    ? [...new Set(carList.map((car: any) => car.category))].filter(
        (category) => category && category.trim() !== ""
      )
    : [];

  const uniqueStatuses = carList
    ? [...new Set(carList.map((car: any) => car.status))].filter(
        (status) => status && status.trim() !== ""
      )
    : [];

  // Show error if exists
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

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
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="dark-input"
              />
            </div>

            <div>
              <Label className="dark-label text-sm font-medium mb-2 block">
                Brand
              </Label>
              <Select
                value={filters.brand}
                onValueChange={(value) => handleFilterChange("brand", value)}
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
                onValueChange={(value) => handleFilterChange("category", value)}
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
                onValueChange={(value) => handleFilterChange("status", value)}
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
                onValueChange={(value) => handleFilterChange("isActive", value)}
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
                  handleFilterChange("isFeatured", value)
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
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Enter car name"
                        className="dark-input"
                      />
                    </div>
                    <div>
                      <Label className="dark-label text-sm font-medium mb-2 block">
                        Brand *
                      </Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) =>
                          setFormData({ ...formData, brand: value })
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
                          setFormData({ ...formData, isFeatured: checked })
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
                          setFormData({ ...formData, isActive: checked })
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
                          setFormData({ ...formData, isAvailable: checked })
                        }
                        className="dark-switch"
                      />
                      <Label className="dark-label text-sm font-medium">
                        Available
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Rest of the form using CommonForm */}
                <div className="px-6 py-6">
                  <CommonForm
                    onSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    buttonText={
                      currentEditedId !== null ? "Update Car" : "Add Car"
                    }
                    formControls={addCarFormElements.filter(
                      (control) =>
                        ![
                          "name",
                          "brand",
                          "pricePerDay",
                          "pricePerWeek",
                          "pricePerMonth",
                        ].includes(control.name)
                    )}
                    isBtnDisabled={
                      !isFormValid() ||
                      imageLoadingStates.some((state) => state)
                    }
                  />
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </Fragment>
    </div>
  );
}

export default AdminCars;
