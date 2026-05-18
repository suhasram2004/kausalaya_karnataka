export interface Worker {
  id: string;
  name: string;
  category: "Electrician" | "Plumber" | "Carpenter" | "Painter" | "Mechanic";
  bio: string;
  profileImageUrl: string;
  rating: number;
  reviewCount: number;
  location: string;
  services: Service[];
  portfolio: PortfolioItem[];
  yearsExperience: number;
  totalJobsDone: number;
  verified: boolean;
}

export interface Service {
  title: string;
  price: string;
}

export interface PortfolioItem {
  imageUrl: string;
  description: string;
}

export interface Review {
  id: string;
  workerId: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt: any;
}
