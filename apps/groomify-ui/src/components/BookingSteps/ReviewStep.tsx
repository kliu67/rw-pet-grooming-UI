// import React from "react";
// import { useTranslation } from "react-i18next";
// import { Label } from "../ui/label";
// export const ReviewStep = ({ formData = {} }) => {

// const { t } = useTranslation();
// const reviewObj={
//     firstName{
//         label:
//         value:
//     }
// }
//   return (
//     <div>
//       {Object.keys(formData).map((key) => (
//         <div>
//         <Label>{key}</Label>
//         <Label>{formData[key]}</Label>
//         </div>
//       ))}
//     </div>
//   );
// };

import { useNavigate } from 'react-router';
// import { useBooking } from '../context/BookingContext';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import {
  ChevronLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  FileText,
  DollarSign,
  Edit2,
} from 'lucide-react';
import { format } from 'date-fns';

export const ReviewStep = ({formData={}}) => {
//   const navigate = useNavigate();
//   const { bookingData } = useBooking();

  const handleConfirm = () => {
    navigate('/confirmation');
  };

//   if (!bookingData.service || !bookingData.date || !bookingData.personalInfo) {
//     navigate('/');
//     return null;
//   }

  const bookingData = {...formData};

//   const formattedDate = format(new Date(bookingData.startDate), 'EEEE, MMMM d, yyyy');
  const formattedDate = new Date(bookingData.startDate);


  return (
    <div className="mx-auto max-w-3xl">
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => {}
            // navigate('/personal-info')
            }>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2>Review Your Booking</h2>
          </div>
          <Badge variant="secondary" className="text-sm">
            Almost Done!
          </Badge>
        </div>

        <div className="space-y-6">
          {/* Service Details */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                Service Details
              </h3>
              <Button
                variant="ghost"
                size="sm"
                // onClick={() => navigate('/')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Service</p>
                <p className="font-medium">{bookingData.serviceId}</p>
              </div>
              <div className="flex gap-6">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  {/* <span>{bookingData.service.duration} minutes</span> */}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <DollarSign className="h-4 w-4" />
                  {/* <span>${bookingData.service.price}</span> */}
                </div>
              </div>
            </div>
          </div>

          {/* Date & Time */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                Date & Time
              </h3>
              <Button
                variant="ghost"
                size="sm"
                // onClick={() => navigate('/date-time')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="space-y-2">
              {/* <p className="font-medium">{formattedDate}</p> */}
              {/* <p className="text-sm text-gray-600">{bookingData.time}</p> */}
            </div>
          </div>

          {/* Personal Information */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                Personal Information
              </h3>
              <Button
                variant="ghost"
                size="sm"
                // onClick={() => navigate('/personal-info')}
                className="text-indigo-600 hover:text-indigo-700"
              >
                <Edit2 className="mr-1 h-3 w-3" />
                Edit
              </Button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">
                  {/* {bookingData.personalInfo.firstName} {bookingData.personalInfo.lastName} */}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                {/* <p className="text-sm">{bookingData.personalInfo.email}</p> */}
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                {/* <p className="text-sm">{bookingData.personalInfo.phone}</p> */}
              </div>
              {/* {bookingData.personalInfo.notes && (
                <div className="mt-3 rounded-md bg-white p-3">
                  <p className="mb-1 text-sm font-medium text-gray-600">Additional Notes</p>
                  <p className="text-sm text-gray-700">{bookingData.personalInfo.notes}</p>
                </div>
              )} */}
            </div>
          </div>

          <Separator />

          {/* Payment Summary */}
          <div className="rounded-lg bg-indigo-50 p-5">
            <h3 className="mb-4">Payment Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Fee</span>
                {/* <span className="font-medium">${bookingData.service.price.toFixed(2)}</span> */}
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax (10%)</span>
                <span className="font-medium">
                  {/* ${(bookingData.service.price * 0.1).toFixed(2)} */}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="font-medium">Total Amount</span>
                <span className="font-medium text-indigo-600">
                  {/* ${(bookingData.service.price * 1.1).toFixed(2)} */}
                </span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs text-gray-600">
              By confirming this booking, you agree to our{' '}
              <button className="text-indigo-600 hover:underline">Terms of Service</button> and{' '}
              <button className="text-indigo-600 hover:underline">Cancellation Policy</button>.
              {/* You will receive a confirmation email at {bookingData.personalInfo.email}. */}
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          {/* <Button variant="outline" onClick={() => navigate('/personal-info')} size="lg">
            Back
          </Button> */}
          {/* <Button onClick={handleConfirm} size="lg" className="min-w-40">
            Confirm Booking
          </Button> */}
        </div>
      </Card>
    </div>
  );
}

