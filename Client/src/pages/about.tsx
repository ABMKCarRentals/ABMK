import {
  Shield,
  Award,
  Users,
  Clock,
  Star,
  Heart,
  Target,
  Globe,
} from "lucide-react";
import Navbar from "../components/home/navbar";
import Footer from "../components/home/footer";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const stats = [
    { number: "500+", label: "Premium Vehicles" },
    { number: "50,000+", label: "Happy Customers" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Customer Support" },
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Reliability",
      description:
        "Every vehicle in our fleet undergoes rigorous safety checks and maintenance to ensure your complete peace of mind.",
    },
    {
      icon: Star,
      title: "Excellence in Service",
      description:
        "We strive to exceed expectations with personalized service, attention to detail, and commitment to customer satisfaction.",
    },
    {
      icon: Heart,
      title: "Passion for Cars",
      description:
        "Our team shares a genuine passion for automobiles, helping you find the perfect vehicle for your unique needs.",
    },
    {
      icon: Target,
      title: "Customer-Centric",
      description:
        "Every decision we make is guided by what's best for our customers, ensuring an exceptional rental experience.",
    },
  ];

  const team = [
    {
      name: "Ahmed Al Maktoum",
      position: "Founder & CEO",
      image: "/images/team/ahmed.jpg",
      description:
        "Visionary leader with 20+ years in luxury automotive industry",
    },
    {
      name: "Sarah Johnson",
      position: "Operations Director",
      image: "/images/team/sarah.jpg",
      description: "Expert in fleet management and customer service excellence",
    },
    {
      name: "Mohammed Hassan",
      position: "Fleet Manager",
      image: "/images/team/mohammed.jpg",
      description:
        "Specialist in luxury and sports car maintenance and operations",
    },
    {
      name: "Lisa Chen",
      position: "Customer Relations",
      image: "/images/team/lisa.jpg",
      description:
        "Dedicated to ensuring every customer has an unforgettable experience",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-gray-950 text-white py-20 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About <span className="gold">ABMK Rentals</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Dubai's premier luxury car rental service, delivering
              extraordinary experiences since 2008 with the finest fleet and
              unmatched customer service.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="goldbg hover:bg-yellow-700 text-black font-semibold px-8 py-3">
                Our Fleet
              </Button>
              <Button
                variant="outline"
                className="border gold hover:goldbg hover:text-black px-8 py-3"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gold mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="py-16 bg-gradient-to-br from-black via-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold gold mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-300 leading-relaxed">
                  <p>
                    Founded in 2008 by Ahmed Al Maktoum, ABMK Rentals began with
                    a simple vision: to provide Dubai's residents and visitors
                    with access to the world's most prestigious automobiles,
                    coupled with service that exceeds all expectations.
                  </p>
                  <p>
                    What started as a small collection of luxury vehicles has
                    grown into Dubai's most trusted premium car rental service.
                    Today, we proudly maintain a fleet of over 500 vehicles,
                    ranging from exotic supercars to elegant sedans, rugged SUVs
                    to stunning convertibles.
                  </p>
                  <p>
                    Our commitment to excellence has earned us the trust of
                    discerning clients including business executives,
                    celebrities, tourists, and car enthusiasts who demand
                    nothing but the best. Every vehicle in our fleet represents
                    our dedication to quality, performance, and style.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="/images/about/our-story.jpg"
                  alt="ABMK Rentals Story"
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-yellow-600 text-black p-6 rounded-lg">
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-16 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gold mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-300">
                The principles that drive everything we do
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div key={index} className="text-center p-6">
                    <div className="w-16 h-16 goldbg bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-black" />
                    </div>
                    <h3 className="text-lg font-semibold text-yellow-200 mb-3">
                      {value.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16 bg-gradient-to-br from-black via-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br goldbg p-8 rounded-xl text-black shadow-lg">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-lg leading-relaxed">
                  To provide exceptional luxury car rental experiences that
                  exceed expectations, offering the world's finest vehicles with
                  unparalleled service, ensuring every journey becomes a
                  memorable adventure for our valued clients.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-black p-8 rounded-xl text-white shadow-lg">
                <div className="flex items-center mb-6">
                  <Globe className="w-8 h-8 mr-3 gold" />
                  <h3 className="text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-lg leading-relaxed">
                  To be the Middle East's leading luxury car rental company,
                  recognized globally for innovation, sustainability, and
                  creating extraordinary automotive experiences that inspire and
                  delight customers from around the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-gradient-to-br from-gray-900 via-gray-950 to-black">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gold mb-4">
                Meet Our Team
              </h2>
              <p className="text-xl text-gray-300">
                The passionate professionals behind your exceptional experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center group">
                  <div className="relative mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto object-cover group-hover:scale-105 transition-transform duration-200 border-4 border-yellow-800"
                    />
                    <div className="absolute inset-0 bg-yellow-600 bg-opacity-20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-200 mb-1">
                    {member.name}
                  </h3>
                  <p className="gold font-medium mb-2">{member.position}</p>
                  <p className="text-gray-300 text-sm">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="py-16 bg-gradient-to-br from-black via-gray-900 to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold gold mb-4">
                Why Choose ABMK Rentals?
              </h2>
              <p className="text-xl text-gray-300">
                Experience the difference that sets us apart
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <Award className="w-12 h-12 gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-yellow-200">
                  Premium Fleet
                </h3>
                <p className="text-gray-300">
                  Meticulously maintained vehicles from the world's most
                  prestigious manufacturers
                </p>
              </div>

              <div className="text-center p-6">
                <Clock className="w-12 h-12 gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-yellow-200">
                  24/7 Service
                </h3>
                <p className="text-gray-300">
                  Round-the-clock support and assistance whenever you need it
                </p>
              </div>

              <div className="text-center p-6">
                <Users className="w-12 h-12 gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3 text-yellow-200">
                  Expert Team
                </h3>
                <p className="text-gray-300">
                  Knowledgeable professionals dedicated to exceeding your
                  expectations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 goldbg">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Ready to Experience Luxury?
          </h2>
          <p className="text-xl text-black mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have chosen ABMK Rentals
            for their luxury car rental needs in Dubai.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-black hover:bg-gray-900 text-white font-semibold px-8 py-3">
              Browse Our Fleet
            </Button>
            <Button
              variant="outline"
              className="border-black text-black hover:bg-black hover:text-white px-8 py-3"
            >
              Contact Us Today
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
