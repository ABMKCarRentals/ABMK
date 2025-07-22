export interface Car {
  _id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  pricePerDay?: number;
  pricePerWeek?: number;
  pricePerMonth?: number;
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  features: string[];
  specifications: {
    engine?: string;
    horsepower?: number;
    topSpeed?: number;
    acceleration?: string;
    mileage?: string;
    color?: string;
    interiorColor?: string;
  };
  location: string;
  description: string;
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  viewCount: number;
  bookingCount: number;
  isAvailable: boolean;
  status: string;
  isFeatured: boolean;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
