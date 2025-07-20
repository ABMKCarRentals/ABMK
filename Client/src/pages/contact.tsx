import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Star,
  Users,
  Award,
} from "lucide-react";
import Navbar from "../components/home/navbar";
import Footer from "../components/home/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "email",
    carInterest: "",
    rentalPeriod: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentUTCDateTime = () => {
    return "2025-07-20 12:55:26";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with form data
      const submissionData = {
        ...formData,
        submittedAt: getCurrentUTCDateTime(),
        submittedBy: "guest",
        source: "website_contact_form",
      };

      console.log("Contact form submission:", submissionData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for contacting ABMK Rentals. We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        preferredContact: "email",
        carInterest: "",
        rentalPeriod: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to send message. Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Our Showroom",
      details: [
        "ABMK Rentals Premium Showroom",
        "Business Bay, Conrad Dubai Hotel",
        "Sheikh Zayed Road, Dubai, UAE",
      ],
      color: "text-blue-600",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: [
        "Main: +971 4 567 8900",
        "Mobile: +971 50 123 4567",
        "Emergency: +971 55 999 8888",
      ],
      color: "text-green-600",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        "info@abmkrentals.ae",
        "bookings@abmkrentals.ae",
        "vip@abmkrentals.ae",
      ],
      color: "text-purple-600",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: [
        "Monday - Friday: 8:00 AM - 10:00 PM",
        "Saturday - Sunday: 9:00 AM - 9:00 PM",
        "24/7 Emergency & VIP Support",
      ],
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Get instant responses for quick bookings",
      action: "Chat on WhatsApp",
      bgColor: "bg-green-600",
      hoverColor: "hover:bg-green-700",
      link: "https://wa.me/971501234567",
    },
    {
      icon: Phone,
      title: "Call Direct",
      description: "Speak with our luxury car specialists",
      action: "Call +971 4 567 8900",
      bgColor: "bg-blue-600",
      hoverColor: "hover:bg-blue-700",
      link: "tel:+97145678900",
    },
    {
      icon: Mail,
      title: "Email Inquiry",
      description: "Send detailed requirements for custom quotes",
      action: "Email Us",
      bgColor: "bg-purple-600",
      hoverColor: "hover:bg-purple-700",
      link: "mailto:info@abmkrentals.ae",
    },
  ];

  const stats = [
    { icon: Users, number: "50,000+", label: "Happy Customers" },
    { icon: Star, number: "4.9/5", label: "Customer Rating" },
    { icon: Award, number: "24/7", label: "Support Available" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Get in <span className="text-yellow-400">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              Ready to experience luxury? Our team of experts is here to help
              you find the perfect premium vehicle for any occasion in Dubai.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-400">
                      {stat.number}
                    </div>
                    <div className="text-gray-300">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Quick Ways to Reach Us
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Choose your preferred method to connect with our luxury car
              specialists
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 border rounded-lg hover:shadow-lg transition-all duration-200 group"
                  >
                    <div
                      className={`w-16 h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{action.description}</p>
                    <Button
                      className={`${action.bgColor} ${action.hoverColor} text-white`}
                      onClick={() => window.open(action.link, "_blank")}
                    >
                      {action.action}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Contact Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-600 mb-6">
                  Fill out the form below and we'll get back to you within 24
                  hours
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+971 XX XXX XXXX"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="How can we help?"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carInterest">Car Category Interest</Label>
                      <select
                        id="carInterest"
                        name="carInterest"
                        value={formData.carInterest}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="">Select Category</option>
                        <option value="luxury">Luxury Cars</option>
                        <option value="sports">Sports Cars</option>
                        <option value="suv">SUV Cars</option>
                        <option value="sedan">Sedan Cars</option>
                        <option value="convertible">Convertible Cars</option>
                        <option value="coupe">Coupe Cars</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="rentalPeriod">Rental Period</Label>
                      <select
                        id="rentalPeriod"
                        name="rentalPeriod"
                        value={formData.rentalPeriod}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      >
                        <option value="">Select Period</option>
                        <option value="daily">Daily Rental</option>
                        <option value="weekly">Weekly Rental</option>
                        <option value="monthly">Monthly Rental</option>
                        <option value="long-term">Long Term (3+ months)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us about your requirements, preferred dates, special requests, or any questions you have..."
                      rows={5}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preferredContact">
                      Preferred Contact Method
                    </Label>
                    <select
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone Call</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold h-12"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Visit Us Today
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Experience our premium showroom and see our luxury fleet in
                    person. Our experts are ready to help you choose the perfect
                    vehicle.
                  </p>
                </div>

                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-yellow-400"
                    >
                      <div className="flex items-start">
                        <div
                          className={`w-12 h-12 ${
                            info.color === "text-blue-600"
                              ? "bg-blue-100"
                              : info.color === "text-green-600"
                              ? "bg-green-100"
                              : info.color === "text-purple-600"
                              ? "bg-purple-100"
                              : "bg-orange-100"
                          } 
                          rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}
                        >
                          <Icon className={`w-6 h-6 ${info.color}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {info.title}
                          </h3>
                          <div className="space-y-1">
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-gray-600">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Map Placeholder */}
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Interactive Map</p>
                    <p className="text-sm text-gray-400">Business Bay, Dubai</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What documents do I need to rent a car?
                </h3>
                <p className="text-gray-600 mb-6">
                  You'll need a valid driving license, passport/Emirates ID, and
                  a credit card. International visitors need an International
                  Driving Permit.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Do you offer delivery and pickup services?
                </h3>
                <p className="text-gray-600 mb-6">
                  Yes! We provide complimentary delivery and pickup within
                  Dubai. Airport and hotel delivery services are also available.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What's included in the rental price?
                </h3>
                <p className="text-gray-600 mb-6">
                  All rentals include comprehensive insurance, 24/7 roadside
                  assistance, and basic maintenance. Fuel and additional
                  insurance options available.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I extend my rental period?
                </h3>
                <p className="text-gray-600 mb-6">
                  Absolutely! Contact us at least 24 hours before your return
                  date to extend your rental. Subject to vehicle availability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
