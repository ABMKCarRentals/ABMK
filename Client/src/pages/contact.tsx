import React, { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
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
import FindUs from "@/components/home/findus";

const ContactPage: React.FC = () => {
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
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      console.log(submissionData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast({
        title: "Message Sent Successfully!",
        description:
          "Thank you for contacting ABMK Car Rentals. We'll get back to you within 24 hours.",
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
      title: "Visit Our Office",
      details: [
        "ABMK Car Rentals",
        "Business Bay, Conrad Dubai Hotel",
        "Sheikh Zayed Road, Dubai, UAE",
      ],
      color: "text-blue-400",
      bg: "bg-blue-900/30",
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["Main: +971552082602"],
      color: "text-green-400",
      bg: "bg-green-900/30",
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["info@abmkcarrental.com"],
      color: "text-purple-400",
      bg: "bg-purple-900/30",
    },
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: "WhatsApp",
      description: "Get instant responses for quick bookings",
      action: "Chat on WhatsApp",
      bgColor: "bg-green-700",
      hoverColor: "hover:bg-green-600",
      link: "https://wa.me/971552082602",
    },
    {
      icon: Phone,
      title: "Call Direct",
      description: "Speak with our luxury car specialists",
      action: "Call +971552082602",
      bgColor: "bg-blue-700",
      hoverColor: "hover:bg-blue-600",
      link: "tel:+971552082602",
    },
    {
      icon: Mail,
      title: "Email Inquiry",
      description: "Send detailed requirements for custom quotes",
      action: "Email Us",
      bgColor: "bg-purple-700",
      hoverColor: "hover:bg-purple-600",
      link: "mailto:info@abmkcarrental.com",
    },
  ];

  const stats = [
    { icon: Users, number: "2000+", label: "Customers across the globe" },
    { icon: Star, number: "5+", label: "Years of Experience" },
    { icon: Award, number: "40+", label: "Premium Vehicles" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#18181b] via-[#1e232a] to-[#18181b] text-[#e7e2d9]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-black via-gray-900 to-black py-16 shadow-lg mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gold drop-shadow-lg">
              Get in <span className="gold">Touch</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 font-medium">
              Ready to experience luxury? Our team of experts is here to help
              you find the perfect premium vehicle for any occasion in Dubai.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-10 h-10 gold mx-auto mb-2 drop-shadow" />
                    <div className="text-2xl font-bold gold">{stat.number}</div>
                    <div className="text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="py-12 bg-[#23232b] border-b border-[#27272f]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center gold mb-4">
              Quick Ways to Reach Us
            </h2>
            <p className="text-center text-gray-400 mb-8">
              Choose your preferred method to connect with our luxury car
              specialists
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className="text-center p-6 bg-gradient-to-br from-[#18181b] to-[#292934] rounded-xl border border-[#292934] hover:border-yellow-400 hover:shadow-xl transition-all duration-200 group"
                  >
                    <div
                      className={`w-16 h-16 ${action.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200 shadow-lg`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold gold mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{action.description}</p>
                    <Button
                      className={`w-full ${action.bgColor} ${action.hoverColor} gold font-semibold tracking-wide border-0 shadow group-hover:shadow-md`}
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
              <div className="bg-[#1f2128] p-8 rounded-2xl shadow-2xl border border-[#292934]">
                <h2 className="text-3xl font-bold gold mb-2">
                  Send Us a Message
                </h2>
                <p className="text-gray-400 mb-6">
                  Fill out the form below and we'll get back to you within 24
                  hours
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="gold">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Your full name"
                        className="mt-1 bg-[#23232b] border-[#292934] text-white focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="gold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your.email@example.com"
                        className="mt-1 bg-[#23232b] border-[#292934] text-white focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="gold">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+971 XX XXX XXXX"
                        className="mt-1 bg-[#23232b] border-[#292934] text-white focus:border-yellow-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject" className="gold">
                        Subject *
                      </Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="How can we help?"
                        className="mt-1 bg-[#23232b] border-[#292934] text-white focus:border-yellow-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="carInterest" className="gold">
                        Car Category Interest
                      </Label>
                      <select
                        id="carInterest"
                        name="carInterest"
                        value={formData.carInterest}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 bg-[#23232b] border border-[#292934] rounded-md text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                      <Label htmlFor="rentalPeriod" className="gold">
                        Rental Period
                      </Label>
                      <select
                        id="rentalPeriod"
                        name="rentalPeriod"
                        value={formData.rentalPeriod}
                        onChange={handleInputChange}
                        className="w-full p-2 mt-1 bg-[#23232b] border border-[#292934] rounded-md text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                    <Label htmlFor="message" className="gold">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Tell us about your requirements, preferred dates, special requests, or any questions you have..."
                      rows={5}
                      className="mt-1 bg-[#23232b] border-[#292934] text-white focus:border-yellow-500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="preferredContact" className="gold">
                      Preferred Contact Method
                    </Label>
                    <select
                      id="preferredContact"
                      name="preferredContact"
                      value={formData.preferredContact}
                      onChange={handleInputChange}
                      className="w-full p-2 mt-1 bg-[#23232b] border border-[#292934] rounded-md text-white focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                  <h2 className="text-3xl font-bold gold mb-6">
                    Visit Us Today
                  </h2>
                  <p className="text-gray-400 mb-8">
                    Visit our premium office in the heart of Dubai and see our
                    luxury fleet in person. Our experts are ready to help you
                    choose the perfect vehicle.
                  </p>
                </div>
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div
                      key={index}
                      className={`p-6 rounded-lg shadow-md border-l-4 border-yellow-500 bg-gradient-to-r ${info.bg} flex items-center`}
                    >
                      <div
                        className={`w-12 h-12 ${info.bg} rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-[#292934]`}
                      >
                        <Icon className={`w-7 h-7 ${info.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold gold mb-1">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-300">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Map Placeholder */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FindUs />

      {/* FAQ Section */}
      <div className="py-16 bg-[#1f2128] border-t border-[#292934]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold gold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold gold mb-3">
                  What documents do I need to rent a car?
                </h3>
                <p className="text-gray-300 mb-6">
                  You'll need a valid driving license, passport/Emirates ID, and
                  a credit card. International visitors need an International
                  Driving Permit.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold gold mb-3">
                  Do you offer delivery and pickup services?
                </h3>
                <p className="text-gray-300 mb-6">
                  Yes! We provide complimentary delivery and pickup within
                  Dubai. Airport and hotel delivery services are also available.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold gold mb-3">
                  What's included in the rental price?
                </h3>
                <p className="text-gray-300 mb-6">
                  All rentals include comprehensive insurance, 24/7 roadside
                  assistance, and basic maintenance. Fuel and additional
                  insurance options available.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold gold mb-3">
                  Can I extend my rental period?
                </h3>
                <p className="text-gray-300 mb-6">
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
