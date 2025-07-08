import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

const testimonials = [
  {
    name: "Emma Rodriguez",
    location: "Barcelona, Spain",
    text: "I've rented cars from various companies, but the experience with CarRental was exceptional.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "John Smith",
    location: "New York, USA",
    text: "CarRental made my trip so much easier. The car was delivered right to my door, and the customer service was fantastic!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Ava Johnson",
    location: "Sydney, Australia",
    text: "I highly recommend CarRental! Their fleet is amazing, and I always feel like I'm getting the best deal with excellent service.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-4xl text- gold racing">What Our Customers Say</h2>
        <p className="mt-2 text-gray-500 max-w-2xl mx-auto mont">
          Discover why discerning travelers choose StayVenture for their luxury
          accommodations around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-18 max-w-7xl mx-auto text- gold mont">
        {testimonials.map((t, idx) => (
          <Card
            key={idx}
            className="shadow-md rounded-xl bg-gray-950 border-0 transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <img
                src={t.image}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <CardTitle className="text-base">{t.name}</CardTitle>
                <CardDescription>{t.location}</CardDescription>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center text- gold mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 .587l3.668 7.571L24 9.75l-6 5.848L19.335 24 12 19.897 4.665 24 6 15.598 0 9.75l8.332-1.592z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                “{t.text}”
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
