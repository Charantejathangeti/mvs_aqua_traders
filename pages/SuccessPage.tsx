import React from 'react';
import { CheckCircle, Calendar, Truck, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export const SuccessPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4 text-center">
      <div className="mb-6 flex justify-center">
        <div className="bg-green-100 p-4 rounded-full">
          <CheckCircle className="text-green-600 w-16 h-16" />
        </div>
      </div>
      
      <h1 className="text-3xl font-extrabold text-deepSea mb-4">Order Logged Successfully!</h1>
      <p className="text-gray-600 mb-8 text-lg">
        Please complete your order by sending the pre-filled message on WhatsApp.
      </p>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-left space-y-6">
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-lg h-fit">
            <Calendar className="text-deepSea" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Dispatch Schedule</h3>
            <p className="text-sm text-gray-600">We dispatch orders every <span className="font-bold text-coralPop">MONDAY</span> only. Please ensure payment is completed before Monday morning.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-lg h-fit">
            <Truck className="text-deepSea" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Tracking</h3>
            <p className="text-sm text-gray-600">
              Once dispatched, you can track your shipment via <a href="https://www.tpcindia.com/" target="_blank" rel="noreferrer" className="text-blue-500 underline">TPC India</a>. Tracking IDs will be shared on WhatsApp.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-lg h-fit">
            <CreditCard className="text-deepSea" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">Payment Instructions</h3>
            <p className="text-sm text-gray-600 mb-2">
              Payment details will be shared by the owner on WhatsApp after order verification.
            </p>
            <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
              [QR Code Placeholder]
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/" className="text-deepSea font-medium hover:underline">
          Return to Store
        </Link>
      </div>
    </div>
  );
};