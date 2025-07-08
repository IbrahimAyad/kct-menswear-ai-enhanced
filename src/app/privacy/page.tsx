import { Card } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Cookie, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-burgundy text-white py-16">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Your privacy is important to us. Learn how we protect and use your information.
          </p>
          <p className="text-sm mt-4 text-white/70">
            Last updated: January 2024
          </p>
        </div>
      </section>

      {/* Privacy Overview */}
      <section className="py-16">
        <div className="container-main">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure & Protected</h3>
              <p className="text-sm text-gray-600">Your data is encrypted and stored securely</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Transparent</h3>
              <p className="text-sm text-gray-600">Clear about what data we collect and why</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Your Control</h3>
              <p className="text-sm text-gray-600">You control your data and privacy settings</p>
            </Card>
          </div>

          {/* Privacy Policy Content */}
          <Card className="p-8">
            <div className="max-w-4xl mx-auto prose prose-gray">
              <h2 className="text-2xl font-serif mb-6 text-gray-900">Information We Collect</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-burgundy" />
                  Personal Information
                </h3>
                <p className="text-gray-600 mb-4">
                  We collect personal information that you provide directly to us, such as:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by our payment processors)</li>
                  <li>Account preferences and communication preferences</li>
                  <li>Size and fit information for personalized recommendations</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-burgundy" />
                  Usage Information
                </h3>
                <p className="text-gray-600 mb-4">
                  We automatically collect certain information about your use of our services:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Device information (browser type, operating system, IP address)</li>
                  <li>Usage patterns and preferences</li>
                  <li>Pages visited and time spent on our website</li>
                  <li>Referral sources and search terms</li>
                  <li>Location data (if you enable location services)</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-burgundy" />
                  Cookies and Tracking
                </h3>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Provide personalized content and recommendations</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Improve our services and user experience</li>
                  <li>Serve relevant advertising (with your consent)</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif mb-6 text-gray-900">How We Use Your Information</h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Service Delivery</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Process orders and payments</li>
                  <li>Provide customer support</li>
                  <li>Send order confirmations and shipping updates</li>
                  <li>Manage your account and preferences</li>
                  <li>Provide size and fit recommendations</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Communication</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Send promotional emails and newsletters (with your consent)</li>
                  <li>Notify you about new products and services</li>
                  <li>Respond to your inquiries and feedback</li>
                  <li>Send important account and service updates</li>
                </ul>
              </div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Improvement and Analytics</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Conduct research and surveys</li>
                  <li>Develop new features and products</li>
                  <li>Personalize your shopping experience</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif mb-6 text-gray-900">Information Sharing</h2>
              
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li><strong>Service Providers:</strong> With trusted third-party vendors who help us operate our business</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                  <li><strong>Consent:</strong> When you explicitly consent to sharing</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif mb-6 text-gray-900">Data Security</h2>
              
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li>SSL encryption for all data transmission</li>
                  <li>Secure payment processing through PCI-compliant processors</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Employee training on data protection and privacy</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif mb-6 text-gray-900">Your Rights and Choices</h2>
              
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  You have several rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Cookie Control:</strong> Manage your cookie preferences</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif mb-6 text-gray-900">Children's Privacy</h2>
              
              <div className="mb-8">
                <p className="text-gray-600">
                  Our services are not directed to children under 13. We do not knowingly collect 
                  personal information from children under 13. If you become aware that a child has 
                  provided us with personal information, please contact us immediately.
                </p>
              </div>

              <h2 className="text-2xl font-serif mb-6 text-gray-900">Changes to This Policy</h2>
              
              <div className="mb-8">
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any 
                  material changes by email or by posting a notice on our website. Your continued 
                  use of our services after any changes constitutes acceptance of the updated policy.
                </p>
              </div>

              <h2 className="text-2xl font-serif mb-6 text-gray-900">Contact Us</h2>
              
              <div className="mb-8">
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or our privacy practices, 
                  please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>KCT Menswear</strong><br />
                    213 S Kalamazoo Mall<br />
                    Kalamazoo, MI 49007
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Email:</strong> <a href="mailto:privacy@kctmenswear.com" className="text-burgundy hover:underline">privacy@kctmenswear.com</a>
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> <a href="tel:2693421234" className="text-burgundy hover:underline">(269) 342-1234</a>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-8 mt-12 text-center">
            <h3 className="text-2xl font-serif mb-4">Manage Your Privacy</h3>
            <p className="text-gray-600 mb-6">
              Take control of your privacy settings and data preferences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy text-white rounded-lg hover:bg-burgundy/90 transition-colors">
                <Mail className="w-4 h-4" />
                Email Preferences
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Cookie className="w-4 h-4" />
                Cookie Settings
              </button>
              <button className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Shield className="w-4 h-4" />
                Data Request
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}