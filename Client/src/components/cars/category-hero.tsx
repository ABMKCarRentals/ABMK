import React from "react";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

interface CategoryHeroData {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  title: string;
  subtitle: string;
  description: string;
  features?: Feature[];
}

interface CategoryHeroProps {
  data: CategoryHeroData;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ data }) => {
  const Icon = data.icon;

  return (
    <div
      className={`bg-gradient-to-br ${data.color} text-white py-20 relative overflow-hidden`}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10" />
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.title}</h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl mb-6 opacity-90">{data.subtitle}</p>

          {/* Description */}
          <p className="text-lg opacity-80 mb-8 max-w-3xl mx-auto leading-relaxed">
            {data.description}
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6">
            {data.features?.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center bg-white bg-opacity-20 px-4 py-2 rounded-full"
                >
                  <FeatureIcon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryHero;
