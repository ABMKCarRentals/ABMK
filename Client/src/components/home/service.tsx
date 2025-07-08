import { FaCarAlt, FaHeadset, FaTags } from "react-icons/fa";


const features = [
  {
    icon: <FaCarAlt size={36} className="text-yellow-400" />,
    title: "Luxury Autos",
    description:
      "Only top-tier vehicles from trusted manufacturers ensure every customer enjoys a safe and reliable ride.",
  },
  {
    icon: <FaHeadset size={36} className="text-yellow-400" />,
    title: "24/7 Client Support",
    description:
      "Our professional team is available round-the-clock to assist with any questions or issues you may encounter.",
  },
  {
    icon: <FaTags size={36} className="text-yellow-400" />,
    title: "Affordable Pricing",
    description:
      "Enjoy luxury without breaking the bank — we offer competitive prices across all rentals.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-black py-16 px-6">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl text-yellow-400 racing">Why Choose Us</h2>
        <p className="mt-2 text-gray-400 max-w-2xl mx-auto">
          Elevate your journey with premium services, dedicated support, and
          unbeatable value.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto text-center">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-[#121212] p-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 border border-yellow-700"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-yellow-300 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
