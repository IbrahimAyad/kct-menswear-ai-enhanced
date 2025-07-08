import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Clock, Phone, Mail } from "lucide-react";

export default function LocationsPage() {
  const locations = [
    {
      id: "downtown",
      name: "Downtown Kalamazoo",
      address: "213 S Kalamazoo Mall",
      city: "Kalamazoo, MI 49007",
      phone: "(269) 342-1234",
      image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/4d48ca28-b58b-4277-c4a6-90d1ae649300/public",
      mapUrl: "https://maps.google.com/?q=213+S+Kalamazoo+Mall+Kalamazoo+MI+49007",
      hours: {
        "Monday - Friday": "10am - 6pm",
        "Saturday": "10am - 4pm",
        "Sunday": "Closed"
      },
      features: [
        "Expert Tailoring",
        "Wedding Specialists",
        "Custom Fittings"
      ]
    },
    {
      id: "portage",
      name: "Portage Crossroads",
      address: "6650 S Westnedge Ave",
      city: "Portage, MI 49002",
      phone: "(269) 323-8070",
      image: "https://imagedelivery.net/QI-O2U_ayTU_H_Ilcb4c6Q/d8250081-37eb-4064-af77-637097ffdc00/public",
      mapUrl: "https://maps.google.com/?q=6650+S+Westnedge+Ave+Portage+MI+49002",
      hours: {
        "Monday - Wednesday": "11am - 7pm",
        "Thursday - Saturday": "11am - 8pm",
        "Sunday": "12pm - 6pm"
      },
      features: [
        "Extended Hours",
        "Prom Specialists",
        "Group Fitting Rooms"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-burgundy text-white py-16">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Our Locations</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Visit our showrooms for expert fitting and personalized service
          </p>
        </div>
      </section>

      {/* Locations Grid */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8">
            {locations.map((location) => (
              <Card key={location.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative h-64">
                  <Image
                    src={location.image}
                    alt={location.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <h2 className="text-2xl font-serif mb-4">{location.name}</h2>
                  
                  <div className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-burgundy mt-0.5" />
                      <div>
                        <p className="font-medium">{location.address}</p>
                        <p className="text-gray-600">{location.city}</p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-burgundy" />
                      <a 
                        href={`tel:${location.phone}`}
                        className="hover:text-burgundy transition-colors"
                      >
                        {location.phone}
                      </a>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-burgundy mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium mb-1">Store Hours:</p>
                        {Object.entries(location.hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between gap-4">
                            <span className="text-gray-600">{day}:</span>
                            <span>{hours}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <p className="font-medium mb-2">Services Available:</p>
                      <div className="flex flex-wrap gap-2">
                        {location.features.map((feature) => (
                          <span 
                            key={feature}
                            className="text-sm bg-gray-100 px-3 py-1 rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Get Directions Button */}
                    <a 
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button className="w-full bg-burgundy hover:bg-burgundy/90">
                        Get Directions
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <Card className="p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-serif mb-4">Need Assistance?</h3>
              <p className="text-gray-600 mb-6">
                Our team is ready to help you find the perfect fit. Contact us or visit one of our locations today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:KCTMenswear@gmail.com">
                  <Button variant="outline" className="gap-2">
                    <Mail className="w-4 h-4" />
                    Email Us
                  </Button>
                </a>
                <a href="tel:2693421234">
                  <Button className="bg-burgundy hover:bg-burgundy/90 gap-2">
                    <Phone className="w-4 h-4" />
                    Call Downtown
                  </Button>
                </a>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}