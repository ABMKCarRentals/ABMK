import React from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Car,
  Image,
  Calendar,
  DollarSign,
  AlertTriangle,
  FileText,
  Users,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/home/navbar";
import Footer from "@/components/home/footer";

const Disclaimer: React.FC = () => {
  const disclaimerSections = [
    {
      id: "fleet",
      title: "Fleet Ownership & Third-Party Vehicles",
      icon: <Car className="w-5 h-5" />,
      content: [
        "ABMK Car Rentals offers rental vehicles from both our own licensed fleet and vehicles operated by third-party licensed rental partners.",
        "We collaborate only with RTA-approved companies that meet legal and insurance requirements for car rentals in the UAE.",
        "All third-party cars are listed under commercial agreements and may be delivered and serviced by our partners.",
      ],
    },
    {
      id: "images",
      title: "Images & Visual Representation",
      icon: <Image className="w-5 h-5" />,
      content: [
        "Vehicle images displayed on this website are for illustrative purposes only.",
        "Some photos may be sourced from stock photography platforms, manufacturer websites, or public sources.",
        "Images may represent a similar make/model/year but not the exact vehicle you receive.",
        "If you are a copyright owner and believe an image has been used without authorization, please contact us for immediate review and removal.",
      ],
    },
    {
      id: "availability",
      title: "Vehicle Availability & Substitution",
      icon: <Calendar className="w-5 h-5" />,
      content: [
        "Vehicle bookings are subject to availability.",
        "ABMK reserves the right to offer a similar vehicle in case the selected model is unavailable.",
        "We may decline a booking based on driver eligibility, document verification, or fleet availability.",
        "We make every effort to honor your preferred vehicle selection.",
      ],
    },
    {
      id: "pricing",
      title: "Pricing, Deposit & Payment Terms",
      icon: <DollarSign className="w-5 h-5" />,
      content: [
        "All prices listed on this website are subject to market fluctuation and peak season changes.",
        "Special promotions may apply and affect final pricing.",
        "Security deposits and insurance coverage vary per vehicle and provider.",
        "Final rental rates and conditions will be shared prior to confirmation of your booking.",
      ],
    },
    {
      id: "liability",
      title: "Liability & Indemnity",
      icon: <Shield className="w-5 h-5" />,
      content: [
        "ABMK Car Rentals and its management are not responsible for delays due to third-party partners.",
        "Vehicle breakdowns are handled as per the rental agreement terms.",
        "Traffic fines, tolls (Salik), or damage during rental are customer's responsibility unless covered by insurance.",
        "The customer is fully liable for complying with UAE traffic laws and rental agreement terms.",
      ],
    },
    {
      id: "content",
      title: "Website Content",
      icon: <Globe className="w-5 h-5" />,
      content: [
        "We strive to keep information on this website accurate and updated.",
        "We do not guarantee that all content is error-free, including vehicle specifications, pricing details, and insurance coverage.",
        "We reserve the right to update or remove content without prior notice.",
        "Policy updates may occur to reflect current market conditions and legal requirements.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div className="mt-16">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center max-w-3xl mx-auto">
            <FileText className="w-10 h-10 mx-auto mb-4 text-yellow-600" />
            <h1 className="text-3xl font-bold mb-4 text-white">
              Terms & Disclaimer
            </h1>
            <p className="text-gray-300">
              Welcome to{" "}
              <span className="font-semibold text-yellow-400">
                ABMK Car Rentals
              </span>
              . By using our website and booking services, you agree to the
              terms outlined in this disclaimer. Please read it carefully.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {disclaimerSections.map((section, index) => (
            <Card
              key={section.id}
              id={section.id}
              className="bg-black border-gray-700 shadow-none rounded-none"
            >
              <CardHeader className="border-b border-gray-700">
                <CardTitle className="flex items-center text-lg font-semibold text-white">
                  <div className="text-yellow-600">{section.icon}</div>
                  <span className="ml-2">
                    {index + 1}. {section.title}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}

          {/* Important Notice */}
          <Card className="bg-black border-yellow-600/30 shadow-none rounded-none">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center text-white">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-600" />
                Important Notice
              </h3>
              <p className="text-gray-300 mb-2">
                This disclaimer is effective as of the current date and may be
                updated periodically. By proceeding with any booking or using
                our services, you acknowledge that you have read, understood,
                and agree to be bound by these terms.
              </p>
              <p className="text-gray-300">
                For any questions or clarifications regarding this disclaimer,
                please contact our customer service team before making a
                reservation.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-black border-gray-700 shadow-none rounded-none">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-3 text-white">
                Need Assistance?
              </h3>
              <p className="text-gray-300 mb-4">
                Our team is here to help you understand our terms and answer any
                questions.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  className="bg-yellow-600 hover:bg-yellow-700 text-black font-medium"
                  onClick={() =>
                    window.open("https://wa.me/971552082602", "_blank")
                  }
                >
                  <Users className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  asChild
                >
                  <Link to="/cars">
                    <Car className="w-4 h-4 mr-2" />
                    Browse Cars
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Legal Footer */}
          <div className="text-center pt-6 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              Last Updated: August 18, 2025 | ABMK Car Rentals - Premium Car
              Rental Services in Dubai, UAE
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Disclaimer;
