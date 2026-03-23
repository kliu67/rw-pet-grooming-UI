import { CheckCircle2, Calendar, Users, MapPin, Download, Mail, Phone } from 'lucide-react';

export const ConfirmStep = ({}) =>{
      return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your reservation. A confirmation email has been sent to your inbox.</p>
          <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
            <p className="text-2xl font-semibold text-gray-900">BK-2026-48291</p>
          </div>
        </div>

        {/* Booking Details */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking Details</h2>

          <div className="space-y-6">
            {/* Property Info */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Seaside Resort & Spa</h3>
              <div className="flex items-start text-gray-600 mb-2">
                <MapPin className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>123 Ocean Drive, Miami Beach, FL 33139</p>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium text-gray-900">March 28, 2026</p>
                  <p className="text-sm text-gray-600">3:00 PM</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium text-gray-900">March 31, 2026</p>
                  <p className="text-sm text-gray-600">11:00 AM</p>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-start">
              <Users className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium text-gray-900">2 Adults, 1 Child</p>
              </div>
            </div>

            {/* Room Type */}
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-1">Room Type</p>
              <p className="font-medium text-gray-900">Deluxe Ocean View Suite</p>
              <p className="text-sm text-gray-600 mt-1">King Bed · Ocean View · Balcony · Free WiFi</p>
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Price Breakdown</h2>

          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>$299 × 3 nights</span>
              <span>$897.00</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Cleaning fee</span>
              <span>$75.00</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Service fee</span>
              <span>$48.50</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Taxes</span>
              <span>$102.06</span>
            </div>
            <div className="border-t pt-3 flex justify-between font-semibold text-lg text-gray-900">
              <span>Total</span>
              <span>$1,122.56</span>
            </div>
          </div>
        </div>

        {/* Guest Information */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Guest Information</h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="text-gray-900">Sarah Johnson</p>
            </div>
            <div className="flex items-center text-gray-700">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span>sarah.johnson@email.com</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="w-4 h-4 mr-2 text-gray-400" />
              <span>+1 (555) 123-4567</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
            <Download className="w-5 h-5 mr-2" />
            Download Confirmation
          </button>
          <button className="flex-1 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors">
            View All Bookings
          </button>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Need to make changes? Contact us at support@seasideresort.com or call (555) 987-6543</p>
        </div>
      </div>
    </div>
  );
}