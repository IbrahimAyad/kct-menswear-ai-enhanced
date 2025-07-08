import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-burgundy text-white py-16">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Get in touch with our expert team for personalized service and style advice
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Phone */}
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-serif mb-2">Call Us</h3>
              <p className="text-gray-600 mb-4">Speak directly with our style experts</p>
              <div className="space-y-2">
                <a href="tel:2693421234" className="block hover:text-burgundy transition-colors">
                  <p className="font-semibold">Downtown Kalamazoo</p>
                  <p>(269) 342-1234</p>
                </a>
                <a href="tel:2693238070" className="block hover:text-burgundy transition-colors mt-4">
                  <p className="font-semibold">Portage Location</p>
                  <p>(269) 323-8070</p>
                </a>
              </div>
            </Card>

            {/* Email */}
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-serif mb-2">Email Us</h3>
              <p className="text-gray-600 mb-4">Get a response within 24 hours</p>
              <a 
                href="mailto:KCTMenswear@gmail.com"
                className="text-burgundy hover:underline font-medium"
              >
                KCTMenswear@gmail.com
              </a>
              <p className="text-sm text-gray-500 mt-2">For all inquiries</p>
            </Card>

            {/* Visit */}
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-burgundy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-burgundy" />
              </div>
              <h3 className="text-xl font-serif mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-4">Experience personalized service in-store</p>
              <a 
                href="/locations"
                className="text-burgundy hover:underline font-medium"
              >
                View Store Locations
              </a>
              <p className="text-sm text-gray-500 mt-2">2 convenient locations</p>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="max-w-2xl mx-auto p-8">
            <h2 className="text-2xl font-serif mb-6 text-center">Send Us a Message</h2>
            <form className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="(269) 555-0123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <select className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy">
                  <option>General Inquiry</option>
                  <option>Schedule Fitting</option>
                  <option>Wedding Services</option>
                  <option>Prom Services</option>
                  <option>Group Orders</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-burgundy"
                  placeholder="How can we help you today?"
                />
              </div>

              <Button className="w-full bg-burgundy hover:bg-burgundy/90">
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Additional Info */}
          <div className="mt-12 text-center">
            <Card className="p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-serif mb-4">Business Hours</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">Downtown Kalamazoo</h4>
                  <div className="text-sm space-y-1 text-gray-600">
                    <p>Monday - Friday: 10am - 6pm</p>
                    <p>Saturday: 10am - 4pm</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Portage Crossroads</h4>
                  <div className="text-sm space-y-1 text-gray-600">
                    <p>Monday - Wednesday: 11am - 7pm</p>
                    <p>Thursday - Saturday: 11am - 8pm</p>
                    <p>Sunday: 12pm - 6pm</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <p className="text-gray-600">
                  <strong>Note:</strong> For urgent matters or after-hours emergencies, 
                  please call our Downtown location at (269) 342-1234 and leave a message.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}