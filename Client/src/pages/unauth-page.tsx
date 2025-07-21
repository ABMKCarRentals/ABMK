import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldX,
  ArrowLeft,
  Home,
  Lock,
  AlertCircle,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const UnAuthPage: React.FC = () => {
  const reasons = [
    {
      icon: Lock,
      title: "Admin Access Only",
      description: "This area is restricted to authorized administrators only",
    },
    {
      icon: AlertCircle,
      title: "Session Expired",
      description: "Your admin session may have expired. Please log in again",
    },
    {
      icon: ShieldX,
      title: "Insufficient Permissions",
      description:
        "You don't have the required permissions to access this resource",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 text-white">
      <div className="max-w-4xl w-full text-center">
        {/* Main Error Content */}
        <div className="mb-12">
          <div className="relative mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-red-900/40 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShieldX className="w-16 h-16 md:w-20 md:h-20 text-red-500 drop-shadow" />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-red-500 mb-6 drop-shadow">
            Access Denied
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
            You don't have permission to access this area. This section is
            restricted to authorized ABMK Rentals administrators only.
          </p>
        </div>

        {/* Possible Reasons */}
        <div className="bg-[#18181b] p-8 rounded-2xl shadow-xl mb-12 max-w-4xl mx-auto border border-[#23232b]">
          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            Possible Reasons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reasons.map((reason, index) => {
              const Icon = reason.icon;
              return (
                <div key={index} className="text-center p-4">
                  <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-yellow-400 mb-2">
                    {reason.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{reason.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Admin Login Section */}
        <div className="bg-gradient-to-br from-yellow-700/80 to-yellow-900/80 text-gray-900 p-8 rounded-2xl mb-8 shadow border border-yellow-700">
          <h3 className="text-2xl font-semibold mb-4">
            Are you an administrator?
          </h3>
          <p className="text-gray-800 mb-6">
            If you're an ABMK Rentals administrator, please log in with your
            credentials.
          </p>
          <Link to="/admin/login">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 shadow">
              <Lock className="w-5 h-5 mr-2" />
              Admin Login
            </Button>
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3">
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link to="/cars">
              <Button
                variant="outline"
                className="border-blue-400 text-blue-300 hover:bg-blue-950 hover:text-yellow-400 px-8 py-3"
              >
                Browse Our Cars
              </Button>
            </Link>
          </div>

          <button
            onClick={() => window.history.back()}
            className="text-gray-400 hover:text-yellow-400 flex items-center justify-center mx-auto font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back to Previous Page
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-br from-yellow-600/10 to-yellow-900/10 border border-yellow-400/50 p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">
            Need Administrative Access?
          </h3>
          <p className="text-gray-300 mb-4">
            If you believe you should have access to this area, please contact
            the ABMK Rentals IT department or system administrator.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-800/20"
              onClick={() =>
                (window.location.href =
                  "mailto:it@abmkrentals.ae?subject=Admin Access Request")
              }
            >
              Email IT Support
            </Button>
            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-800/20"
              onClick={() => (window.location.href = "tel:+97145678900")}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call Support
            </Button>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-red-900/20 border border-red-700 p-4 rounded-lg">
          <div className="flex items-center justify-center text-red-400">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">
              This access attempt has been logged for security purposes
            </span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-gray-500 text-sm">
          Error 403 - Unauthorized Access | ABMK Rentals Administration |
          <span className="text-red-500"> Access Restricted</span>
        </div>
      </div>
    </div>
  );
};

export default UnAuthPage;
