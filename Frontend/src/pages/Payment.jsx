

// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Button from "../components/Button";
// import {
//   UserIcon,
//   LockIcon,
//   ShieldIcon,
//   TimerIcon,
//   QrCodeIcon,
// } from "lucide-react";

// const Payment = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { travelerDetails, contactInfo, bookingResponse, addOnServices, selectedSeats, seatMapData } =
//     location.state || {};

//   // Hooks at the top level
//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [paymentDetails, setPaymentDetails] = useState("");
//   const [timeLeft, setTimeLeft] = useState(19 * 60 + 22); // 19 min 22 sec in seconds

//   useEffect(() => {
//     if (!bookingResponse || !travelerDetails || !contactInfo) {
//       console.warn("No data found, redirecting to /booking-response");
//       navigate("/booking-response", { replace: true });
//     }
//   }, [bookingResponse, travelerDetails, contactInfo, navigate]);

//   useEffect(() => {
//     if (timeLeft > 0) {
//       const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
//       return () => clearInterval(timer);
//     }
//   }, [timeLeft]);

//   // Early return after hooks
//   if (!bookingResponse || !travelerDetails || !contactInfo) {
//     return null;
//   }

//   // Destructure bookingResponse with defaults
//   const {
//     departure = { iataCode: "N/A", terminal: "N/A", at: "" },
//     arrival = { iataCode: "N/A", terminal: "N/A", at: "" },
//     departureTime = "N/A",
//     arrivalTime = "N/A",
//     duration = "N/A",
//     stops = 0,
//     aircraft = "AIRBUS JET",
//   } = bookingResponse;

//   // Calculate seat fare from selectedSeats and seatMapData
//   const seatFare = selectedSeats
//     ? Object.keys(selectedSeats).reduce((sum, travellerId) => {
//         const seat = seatMapData
//           ?.flatMap((row) => row.seats || [])
//           .find((s) => s?.seatNo === selectedSeats[travellerId]);
//         return sum + (seat?.fare || 0);
//       }, 0)
//     : 0;

//   // Calculate total amount (base fare + seat fare)
//   const totalPassengers =
//     (bookingResponse.passengers?.adults || 0) +
//     (bookingResponse.passengers?.children || 0) +
//     (bookingResponse.passengers?.infants || 0);
//   const baseFare = parseFloat(bookingResponse.pricedOffer?.price?.grandTotal || 0);
//   const totalAmount = baseFare * totalPassengers + seatFare;

//   const formatTime = (seconds) => {
//     const minutes = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${minutes} min ${secs} sec`;
//   };

//   // Decode email from session token
//   const decodeEmailFromToken = () => {
//     const sessionToken = localStorage.getItem("sessionToken");
//     if (sessionToken) {
//       try {
//         const payload = sessionToken.split(".")[1]; // JWT payload
//         const decodedPayload = atob(payload); // Decode base64
//         const parsedPayload = JSON.parse(decodedPayload);
//         return parsedPayload.email || "guest"; // Fallback if email not found
//       } catch (e) {
//         console.error("Error decoding token:", e);
//         return "user@example.com"; // Fallback
//       }
//     }
//     return "guest"; // Default if no token
//   };

//   const email = decodeEmailFromToken();

//   const handlePayment = () => {
//     if (paymentMethod && paymentDetails) {
//       alert(`Payment of €${totalAmount.toFixed(2)} processed via ${paymentMethod}`);
//       navigate("/confirmation", {
//         state: { bookingResponse, travelerDetails, contactInfo, addOnServices, selectedSeats, seatMapData },
//       });
//     } else {
//       alert("Please select a payment method and enter details.");
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl">
//       {/* Top Message */}
//       <div className="mb-6 text-left text-2xl font-bold text-black">
//         Review your flight details
//       </div>

//       {/* Flight Details */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h2 className="text-xl font-bold text-indigo-800 mb-4">
//           Flight Details
//         </h2>
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Departure</p>
//             <p className="font-semibold">{departure.iataCode}</p>
//             <p className="text-xs text-gray-500">
//               {departure.at
//                 ? new Date(departure.at).toLocaleDateString("en-US", {
//                     day: "2-digit",
//                     month: "short",
//                   })
//                 : "N/A"}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">{departureTime}</p>
//             <p className="text-xs text-gray-600">
//               {departure.iataCode}, Terminal {departure.terminal || "N/A"}
//             </p>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-sm text-gray-600">{duration}</p>
//             <p className="text-xs text-gray-500">
//               {stops} stop{stops !== 1 ? "s" : ""}
//             </p>
//             <div className="flex items-center justify-center mt-1">
//               <div className="h-px w-6 bg-gray-400"></div>
//               <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
//               <div className="h-px w-6 bg-gray-400"></div>
//             </div>
//           </div>
//           <div className="text-center mt-2 sm:mt-0">
//             <p className="text-lg font-bold">{arrivalTime}</p>
//             <p className="text-xs text-gray-600">
//               {arrival.iataCode}, Terminal {arrival.terminal || "N/A"}
//             </p>
//           </div>
//         </div>
//         <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
//           <div>
//             <p className="text-sm text-gray-600">Aircraft</p>
//             <p className="font-semibold">{aircraft}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-600">Total Amount</p>
//             <p className="font-semibold">€{totalAmount.toFixed(2)}</p>
//           </div>
//         </div>
//       </section>

//       {/* Logged In As */}
//       <section className="mb-8 bg-gradient-to-r from-indigo-100 to-white p-4 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-indigo-800">
//           Logged in as: {email}
//         </h3>
//       </section>

//       {/* Traveller Details */}
//       <section className="mb-8 bg-gray-50 p-4 rounded-lg">
//         <h2 className="text-xl font-bold text-indigo-800 mb-4">
//           Traveller Details
//         </h2>
//         <div className="space-y-4">
//           {travelerDetails.map((traveler, index) => (
//             <div
//               key={index}
//               className="p-4 bg-white rounded-lg shadow-md border-l-4 border-indigo-500 hover:bg-indigo-50 transition duration-200 flex justify-between items-center"
//             >
//               <p className="text-gray-700 font-medium">
//                 {traveler.title} {traveler.firstName} {traveler.lastName}
//               </p>
//               <p className="text-sm text-gray-500">
//                 {traveler.mobileNo || "N/A"}
//               </p>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Payment Section */}
//       <section className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
//         <div className="text-black text-center py-4 rounded-t-lg font-bold text-xl flex justify-between items-center">
//           <span>Make Payment</span>
//           <div className="text-red-500 text-sm">
//             <TimerIcon className="inline h-4 w-4 mr-1" />
//             The session will expire in: <strong>{formatTime(timeLeft)}</strong>
//           </div>
//         </div>
//         <div className="flex flex-col md:flex-row gap-6 mt-6">
//           {/* Left Sidebar - Payment Method Options */}
//           <div className="w-full md:w-1/4 bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
//             {[
//               "upi",
//               "credit-card",
//               "amex",
//               "debit-card",
//               "net-banking",
//               "credit-card-emi",
//               "wallet",
//               "phonepe",
//               "google-pay"
//             ].map((method) => (
//               <button
//                 key={method}
//                 onClick={() => setPaymentMethod(method)}
//                 className={`w-full text-left p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 ${
//                   paymentMethod === method ? "bg-white font-semibold" : ""
//                 }`}
//               >
//                 {method === "upi" && "UPI"}
//                 {method === "credit-card" && "Credit Card"}
//                 {method === "amex" && "AMEX"}
//                 {method === "debit-card" && "Debit Card"}
//                 {method === "net-banking" && "Net Banking"}
//                 {method === "credit-card-emi" && "Credit Card EMI"}
//                 {method === "wallet" && "Wallet"}
//                 {method === "phonepe" && "PhonePe"}
//                 {method === "google-pay" && "Google Pay"}
//               </button>
//             ))}
//           </div>

//           {/* Main Content - UPI Section */}
//           <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow-inner">
//             {paymentMethod === "upi" && (
//               <div className="space-y-6">
//                 {/* 3-Step Instruction Graphic */}
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
//                   <div>
//                     <UserIcon className="mx-auto h-12 w-12 text-indigo-600" />
//                     <p className="text-sm mt-2">
//                       Enter VPA on MultiflyTravels payment page
//                     </p>
//                   </div>
//                   <div>
//                     <LockIcon className="mx-auto h-12 w-12 text-indigo-600" />
//                     <p className="text-sm mt-2">Go to bank’s app to approve</p>
//                   </div>
//                   <div>
//                     <ShieldIcon className="mx-auto h-12 w-12 text-indigo-600" />
//                     <p className="text-sm mt-2">Enter MPIN to authenticate</p>
//                   </div>
//                 </div>

//                 {/* UPI Payment Input */}
//                 <div className="flex items-center gap-4">
//                   <input
//                     type="text"
//                     placeholder="Virtual payment address"
//                     value={paymentDetails}
//                     onChange={(e) => setPaymentDetails(e.target.value)}
//                     className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
//                   />
//                   <button
//                     className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-1.5 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
//                     onClick={handlePayment}
//                   >
//                     Make Payment
//                   </button>
//                 </div>

//                 {/* OR Divider */}
//                 <div className="flex items-center gap-2 justify-center py-2">
//                   <div className="h-px bg-gray-300 w-1/3" />
//                   <span className="text-gray-600 bg-white px-2">OR</span>
//                   <div className="h-px bg-gray-300 w-1/3" />
//                 </div>

//                 {/* Scan and Pay QR Section */}
//                 <div className="text-center space-y-2">
//                   <p className="font-medium">Scan and Pay with UPI App</p>
//                   <p className="text-sm">
//                     Scan and make payment using any banking UPI app
//                   </p>
//                   <div className="flex justify-center gap-4 items-center">
//                     <img src="" alt="Google Pay" className="h-6" />
//                     <img src="" alt="PhonePe" className="h-6" />
//                     <img src="" alt="Paytm" className="h-6" />
//                     <QrCodeIcon className="h-6 w-6 text-gray-600" />
//                     <span className="text-blue-600 cursor-pointer hover:underline">
//                       View QR Code
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//             {[
//               "credit-card",
//               "amex",
//               "debit-card",
//               "net-banking",
//               "credit-card-emi",
//               "wallet",
//               "phonepe",
//               "google-pay"
//             ].includes(paymentMethod) && (
//               <p className="text-gray-500 text-center">
//                 Payment method under development. Please select UPI for now.
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Fare Summary */}
//         <div className="flex justify-end text-right text-lg font-bold mt-4">
//           Total payable amount:{" "}
//           <span className="text-2xl text-red-600 ml-2">
//             €{totalAmount.toFixed(2)}
//           </span>
//         </div>

//         {/* Footer Disclaimer */}
//         <p className="text-xs text-gray-600 text-center mt-4">
//           By clicking Make Payment, I agree with the{" "}
//           <a href="#" className="text-blue-600 underline">
//             Booking Policies
//           </a>
//           ,{" "}
//           <a href="#" className="text-blue-600 underline">
//             Privacy Policy & Terms
//           </a>
//           , the Visa Rules and the T&Cs of Multiflytravels.com. Multifly Travels
//           shall not be liable for any claims related to non-travel due to lack
//           of destination/transit visa/other mandatory travel/visa document(s).
//         </p>
//       </section>
//     </div>
//   );
// };

// export default Payment;




import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CreditCard from "../section/CreditCard";
import {
  UserIcon,
  LockIcon,
  ShieldIcon,
  TimerIcon,
  QrCodeIcon,
} from "lucide-react";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { travelerDetails, contactInfo, bookingResponse, addOnServices, selectedSeats, seatMapData } =
    location.state || {};

  // Hooks at the top level
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [timeLeft, setTimeLeft] = useState(19 * 60 + 22); // 19 min 22 sec in seconds

  useEffect(() => {
    if (!bookingResponse || !travelerDetails || !contactInfo) {
      console.warn("No data found, redirecting to /booking-response");
      navigate("/booking-response", { replace: true });
    }
  }, [bookingResponse, travelerDetails, contactInfo, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Early return after hooks
  if (!bookingResponse || !travelerDetails || !contactInfo) {
    return null;
  }

  // Destructure bookingResponse with defaults
  const {
    departure = { iataCode: "N/A", terminal: "N/A", at: "" },
    arrival = { iataCode: "N/A", terminal: "N/A", at: "" },
    departureTime = "N/A",
    arrivalTime = "N/A",
    duration = "N/A",
    stops = 0,
    aircraft = "AIRBUS JET",
  } = bookingResponse;

  // Calculate seat fare from selectedSeats and seatMapData
  const seatFare = selectedSeats
    ? Object.keys(selectedSeats).reduce((sum, travellerId) => {
        const seat = seatMapData
          ?.flatMap((row) => row.seats || [])
          .find((s) => s?.seatNo === selectedSeats[travellerId]);
        return sum + (seat?.fare || 0);
      }, 0)
    : 0;

  // Calculate total amount (base fare + seat fare)
  const totalPassengers =
    (bookingResponse.passengers?.adults || 0) +
    (bookingResponse.passengers?.children || 0) +
    (bookingResponse.passengers?.infants || 0);
  const baseFare = parseFloat(bookingResponse.pricedOffer?.price?.grandTotal || 0);
  const totalAmount = baseFare * totalPassengers + seatFare;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes} min ${secs} sec`;
  };

  // Decode email from session token
  const decodeEmailFromToken = () => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (sessionToken) {
      try {
        const payload = sessionToken.split(".")[1]; // JWT payload
        const decodedPayload = atob(payload); // Decode base64
        const parsedPayload = JSON.parse(decodedPayload);
        return parsedPayload.email || "guest"; // Fallback if email not found
      } catch (e) {
        console.error("Error decoding token:", e);
        return "user@example.com"; // Fallback
      }
    }
    return "guest"; // Default if no token
  };

  const email = decodeEmailFromToken();

  const handlePayment = (creditCardDetails) => {
    if (paymentMethod === "upi" && paymentDetails) {
      alert(`Payment of €${totalAmount.toFixed(2)} processed via ${paymentMethod}`);
      navigate("/confirmation", {
        state: { bookingResponse, travelerDetails, contactInfo, addOnServices, selectedSeats, seatMapData },
      });
    } else if ((paymentMethod === "credit-card" || paymentMethod === "amex") && creditCardDetails) {
      alert(`Payment of €${totalAmount.toFixed(2)} processed via ${creditCardDetails.cardType} card`);
      navigate("/confirmation", {
        state: {
          bookingResponse,
          travelerDetails,
          contactInfo,
          addOnServices,
          selectedSeats,
          seatMapData,
          paymentDetails: { method: paymentMethod, ...creditCardDetails }
        },
      });
    } else {
      alert("Please select a payment method and enter details.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-2xl">
      {/* Top Message */}
      <div className="mb-6 text-left text-2xl font-bold text-black">
        Review your flight details
      </div>

      {/* Flight Details */}
      <section className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-indigo-800 mb-4">
          Flight Details
        </h2>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-600">Departure</p>
            <p className="font-semibold">{departure.iataCode}</p>
            <p className="text-xs text-gray-500">
              {departure.at
                ? new Date(departure.at).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                  })
                : "N/A"}
            </p>
          </div>
          <div className="text-center mt-2 sm:mt-0">
            <p className="text-lg font-bold">{departureTime}</p>
            <p className="text-xs text-gray-600">
              {departure.iataCode}, Terminal {departure.terminal || "N/A"}
            </p>
          </div>
          <div className="text-center mt-2 sm:mt-0">
            <p className="text-sm text-gray-600">{duration}</p>
            <p className="text-xs text-gray-500">
              {stops} stop{stops !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center justify-center mt-1">
              <div className="h-px w-6 bg-gray-400"></div>
              <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <div className="h-px w-6 bg-gray-400"></div>
            </div>
          </div>
          <div className="text-center mt-2 sm:mt-0">
            <p className="text-lg font-bold">{arrivalTime}</p>
            <p className="text-xs text-gray-600">
              {arrival.iataCode}, Terminal {arrival.terminal || "N/A"}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <p className="text-sm text-gray-600">Aircraft</p>
            <p className="font-semibold">{aircraft}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="font-semibold">€{totalAmount.toFixed(2)}</p>
          </div>
        </div>
      </section>

      {/* Logged In As */}
      <section className="mb-8 bg-gradient-to-r from-indigo-100 to-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-indigo-800">
          Logged in as: {email}
        </h3>
      </section>

      {/* Traveller Details */}
      <section className="mb-8 bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-bold text-indigo-800 mb-4">
          Traveller Details
        </h2>
        <div className="space-y-4">
          {travelerDetails.map((traveler, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg shadow-md border-l-4 border-indigo-500 hover:bg-indigo-50 transition duration-200 flex justify-between items-center"
            >
              <p className="text-gray-700 font-medium">
                {traveler.title} {traveler.firstName} {traveler.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {traveler.mobileNo || "N/A"}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Payment Section */}
      <section className="mb-8 bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
        <div className="text-black text-center py-4 rounded-t-lg font-bold text-xl flex justify-between items-center">
          <span>Make Payment</span>
          <div className="text-red-500 text-sm">
            <TimerIcon className="inline h-4 w-4 mr-1" />
            The session will expire in: <strong>{formatTime(timeLeft)}</strong>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 mt-6">
          {/* Left Sidebar - Payment Method Options */}
          <div className="w-full md:w-1/4 bg-gray-50 p-4 rounded-lg shadow-inner space-y-2">
            {[
              "upi",
              "credit-card",
              "amex",
              "debit-card",
              "net-banking",
              "credit-card-emi",
              "wallet",
              "phonepe",
              "google-pay"
            ].map((method) => (
              <button
                key={method}
                onClick={() => setPaymentMethod(method)}
                className={`w-full text-left p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition duration-200 ${
                  paymentMethod === method ? "bg-white font-semibold" : ""
                }`}
              >
                {method === "upi" && "UPI"}
                {method === "credit-card" && "Credit Card"}
                {method === "amex" && "AMEX"}
                {method === "debit-card" && "Debit Card"}
                {method === "net-banking" && "Net Banking"}
                {method === "credit-card-emi" && "Credit Card EMI"}
                {method === "wallet" && "Wallet"}
                {method === "phonepe" && "PhonePe"}
                {method === "google-pay" && "Google Pay"}
              </button>
            ))}
          </div>

          {/* Main Content - Payment Method Sections */}
          <div className="w-full md:w-3/4 bg-white p-4 rounded-lg shadow-inner">
            {paymentMethod === "upi" && (
              <div className="space-y-6">
                {/* 3-Step Instruction Graphic */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <UserIcon className="mx-auto h-12 w-12 text-indigo-600" />
                    <p className="text-sm mt-2">
                      Enter VPA on MultiflyTravels payment page
                    </p>
                  </div>
                  <div>
                    <LockIcon className="mx-auto h-12 w-12 text-indigo-600" />
                    <p className="text-sm mt-2">Go to bank’s app to approve</p>
                  </div>
                  <div>
                    <ShieldIcon className="mx-auto h-12 w-12 text-indigo-600" />
                    <p className="text-sm mt-2">Enter MPIN to authenticate</p>
                  </div>
                </div>

                {/* UPI Payment Input */}
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Virtual payment address"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 placeholder-gray-500"
                  />
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white py-1.5 px-6 rounded-lg shadow-md transform hover:scale-105 transition-all duration-300 ease-in-out"
                    onClick={() => handlePayment()}
                  >
                    Make Payment
                  </button>
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-2 justify-center py-2">
                  <div className="h-px bg-gray-300 w-1/3" />
                  <span className="text-gray-600 bg-white px-2">OR</span>
                  <div className="h-px bg-gray-300 w-1/3" />
                </div>

                {/* Scan and Pay QR Section */}
                <div className="text-center space-y-2">
                  <p className="font-medium">Scan and Pay with UPI App</p>
                  <p className="text-sm">
                    Scan and make payment using any banking UPI app
                  </p>
                  <div className="flex justify-center gap-4 items-center">
                    <img src="" alt="Google Pay" className="h-6" />
                    <img src="" alt="PhonePe" className="h-6" />
                    <img src="" alt="Paytm" className="h-6" />
                    <QrCodeIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-blue-600 cursor-pointer hover:underline">
                      View QR Code
                    </span>
                  </div>
                </div>
              </div>
            )}
            {(paymentMethod === "credit-card" || paymentMethod === "amex") && (
              <CreditCard
                totalAmount={totalAmount}
                handlePayment={handlePayment}
                timeLeft={timeLeft}
              />
            )}
            {[
              "debit-card",
              "net-banking",
              "credit-card-emi",
              "wallet",
              "phonepe",
              "google-pay"
            ].includes(paymentMethod) && (
              <p className="text-gray-500 text-center">
                Payment method under development. Please select UPI or Credit Card for now.
              </p>
            )}
          </div>
        </div>

        {/* Fare Summary */}
        <div className="flex justify-end text-right text-lg font-bold mt-4">
          Total payable amount:{" "}
          <span className="text-2xl text-red-600 ml-2">
            €{totalAmount.toFixed(2)}
          </span>
        </div>

        {/* Footer Disclaimer */}
        <p className="text-xs text-gray-600 text-center mt-4">
          By clicking Make Payment, I agree with the{" "}
          <a href="#" className="text-blue-600 underline">
            Booking Policies
          </a>
          ,{" "}
          <a href="#" className="text-blue-600 underline">
            Privacy Policy & Terms
          </a>
          , the Visa Rules and the T&Cs of Multiflytravels.com. Multifly Travels
          shall not be liable for any claims related to non-travel due to lack
          of destination/transit visa/other mandatory travel/visa document(s).
        </p>
      </section>
    </div>
  );
};

export default Payment;