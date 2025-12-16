export interface AxisData {
  label: string;
  value: number; // 0 to 100
}

export interface RadarData {
  title: string;
  axes: AxisData[];
  description?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ApplicationItem {
  title: string;
  description: string;
  icon: string;
  tags: string[];
}

export interface ProductModel {
  id: string;
  name: string;
  tagline: string;
  data: RadarData;
  features: string[];
}
