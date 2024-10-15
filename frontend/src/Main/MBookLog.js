import React, { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FaChevronLeft, FaBusinessTime } from "react-icons/fa";
import MInfo from "./MInfo";
import qr from "../Assets/QR.jpg";
import gcash from "../Assets/GCASH.png";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { getRole, getUserInfo } from "../utils/auth";
import Login from "../components/Login";

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const MBookLog = () => {
  const { id } = useParams();
  const user = getUserInfo();
  const [showModal, setShowModal] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("pay_now");
  const navigate = useNavigate();
  const handleRadioChange = useCallback((event) => {
    setSelectedPayment(event.target.value);
  }, []);

  const handleGoBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  const [resort, setResort] = useState(null);
  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/resorts/${id}`)
      .then((response) => {
        setResort(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the resort!", error);
      });
  }, [id]);

  const { state } = useLocation();
  const {
    resortName = "Default Resort",
    priceMin = 0,
    serviceCosts = 0,
    selectedServices = [],
    checkInDate = new Date().toISOString(), 
    checkOutDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), 
    totalCost = 0,
    swimmingType = "day", 
  } = state || {};
  

  const formattedCheckInDate = dayjs(checkInDate).format(" MMMM D, YYYY h:mm a");
  const formattedCheckOutDate = dayjs(checkOutDate).format("MMMM D, YYYY h:mm a");

  // GCash
  const [paymentMethod, setPaymentMethod] = useState("");
  const [gcashRefNumber, setGcashRefNumber] = useState("");
  const [gcashScreenshot, setGcashScreenshot] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setGcashScreenshot(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setGcashScreenshot(null);
      setPreviewUrl(null);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    if (selectedPayment === "gcash") {
      if (!gcashRefNumber || !gcashScreenshot) {
        Swal.fire({
          icon: "error",
          title: "Missing Information",
          text: "Please enter your GCash reference number and upload a screenshot.",
        });
        return;
      }
    }

    const bookingReference = uuidv4();
    const bookingStatus = "pending";

    const formData = new FormData();
    formData.append("userId", user.name);
    formData.append("email", user.email);
    formData.append("resortId", id);
    formData.append("resortName", resortName);
    formData.append("checkInDate", formattedCheckInDate);
    formData.append("checkOutDate", formattedCheckOutDate);
    formData.append("totalCost", totalCost);
    formData.append("paymentMethod", selectedPayment === "gcash" ? "GCash" : selectedPayment);
    formData.append("gcashRefNumber", gcashRefNumber);
    formData.append("gcashScreenshot", gcashScreenshot);
    formData.append("bookingReference", bookingReference);
    formData.append("status", bookingStatus);
    formData.append("swimmingType", swimmingType);

    // Logging booking data before submission
    console.log("Booking Data before submission:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.post(
        "http://localhost:8080/api/bookings",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Booking created successfully:", response.data);
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Your booking has been saved",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        navigate("/");
      });
    } catch (error) {
      console.error("Error during booking:", error);
      Swal.fire({
        icon: "error",
        title: "Booking Error",
        text: "There was an error processing your booking. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col justify-center font-sans items-center w-full mt-12 mb-12 px-4 sm:px-8 lg:px-0">
      <div className="flex w-full sm:w-2/3">
        <div className="flex items-center">
          <button onClick={handleGoBack}>
            <FaChevronLeft />
          </button>
          <span className="ml-4 text-2xl sm:text-3xl font-semibold">
            Request to Book
          </span>
        </div>
      </div>

      <div className="flex flex-col-reverse lg:flex-row w-full sm:w-2/3 mt-4">
        {/* left sec */}
        <div className="w-full lg:w-1/2">
          <div className="p-4 sm:p-8">
            <div className="mt-4 flex justify-between">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold">Dates</h2>
                <h3 className="text-gray">
                  {formattedCheckInDate} - {formattedCheckOutDate}
                </h3>
              </div>
              <button className="underline font-bold">Edit</button>
            </div>

            {/* Login/Reg/Pay */}
            {!getRole() ? (
              <div className="border-t-2 mt-4 flex flex-col w-full mb-12 lg:mb-72">
                <h1 className="text-xl sm:text-2xl font-semibold mt-4">
                  Log in or sign up to book
                </h1>
                <button
                  className="bg-blue-500 text-white px-12 sm:px-32 py-2 rounded flex items-center mt-4 justify-center"
                  onClick={() => setShowModal(true)}
                >
                  Login
                </button>
              </div>
            ) : (
              <div className="border-t-2 mt-4 p-4">
                <h1 className="text-xl sm:text-2xl font-semibold">
                  Choose how to pay
                </h1>
                <div className="pl-4">
                  <div className="flex flex-row items-center mt-4 border-2 p-2 rounded-md">
                    <label htmlFor="payNow" className="text-lg font-semibold">
                      Pay now ₱{totalCost}
                    </label>
                    <input
                      className="ml-auto border-2 border-black custom-radio"
                      type="radio"
                      id="payNow"
                      name="paymentOption"
                      value="pay_now"
                      checked={selectedPayment === "pay_now"}
                      onChange={handleRadioChange}
                    />
                  </div>
                  <div className="mt-4 border-2 p-2 rounded-md">
                    <div className="flex flex-row items-center">
                      <label htmlFor="payPart">
                        <span className="text-lg font-semibold">
                          Reserve now
                        </span>
                        <br />
                        With a fee of ₱500 due today
                      </label>
                      <input
                        className="ml-auto custom-radio"
                        type="radio"
                        id="payPart"
                        name="paymentOption"
                        value="pay_part"
                        checked={selectedPayment === "pay_part"}
                        onChange={handleRadioChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-y-2 p-4">
                  <h1 className="font-semibold text-xl">
                    Thru Gcash Payment Only
                  </h1>
                  <form className="mt-4 max-w-lg mx-auto">
                    {/* GCash Payment Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <img
                          src={gcash}
                          alt="GCash Logo"
                          className="w-12 h-12 object-contain"
                        />
                      </div>

                      <div className="flex justify-center mb-6">
                        <img
                          src={qr}
                          alt="QR code"
                          className="w-56 h-56 object-cover rounded-lg shadow-md"
                        />
                      </div>

                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        Upload GCash Screenshot:
                      </label>
                      <div className="relative mb-6">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:ring-blue-500 focus:border-blue-500 file:bg-blue-500 file:text-white file:px-4 file:py-2 file:mr-4 file:rounded-lg file:cursor-pointer"
                        />
                      </div>

                      <label className="block text-gray-700 text-sm font-medium mb-2">
                        GCash Reference Number:
                      </label>
                      <input
                        type="number"
                        value={gcashRefNumber}
                        onChange={(e) => setGcashRefNumber(e.target.value)}
                        placeholder="Enter reference number"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mb-6"
                      />
                    </div>
                  </form>

                  {previewUrl && (
                    <div>
                      <h3>Preview:</h3>
                      <img
                        src={previewUrl}
                        alt="GCash Screenshot Preview"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  )}
                </div>

                <div className="border-b-2 mt-4 p-4">
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    Cancellation Policy
                  </h1>
                  <p className="text-lg mt-4">
                    Cancel a week before reservation for a partial refund.
                    <button
                      onClick={() => setShowInfo(true)}
                      type="button"
                      className="underline font-bold"
                    >
                      Learn More
                    </button>
                  </p>
                  {showInfo &&
                    createPortal(
                      <MInfo onClose={() => setShowInfo(false)} />,
                      document.body
                    )}
                </div>
                <div className="border-b-2 mt-4 p-4">
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    Ground rules
                  </h1>
                  <ul className="list-disc mt-4 text-lg">
                    <li>Follow the house rules</li>
                    <li>Treat your Host’s home like your own</li>
                  </ul>
                </div>
                <div className="flex items-center border-b-2 mt-4 p-4">
                  <h1 className="text-4xl font-semibold text-blue-500">
                    <FaBusinessTime />
                  </h1>
                  <h1 className="pl-2 text-md text-center">
                    <span className="font-bold">
                      The Host will need to accept this request.
                    </span>
                    You'll pay now, but will get a full refund if your
                    reservation isn't confirmed within 24 hours.
                  </h1>
                </div>
                <button
                  className="bg-blue-500 w-full text-white px-12 sm:px-32 py-2 rounded flex items-center justify-center"
                  onClick={handlePaymentSubmit}
                >
                  Book Now
                </button>
              </div>
            )}
          </div>
        </div>

        {/* rightt sec */}
        <div className="w-full lg:w-1/2 mt-8 lg:mt-0">
          <div className="border-2 rounded-lg p-4 sm:p-8">
            <div className="w-full flex justify-center">
              {resort?.images && resort.images.length > 0 ? (
                <img
                  src={`http://localhost:8080${resort.images[0]?.path}`}
                  alt={resortName}
                  className="w-full h-48 object-cover rounded-lg"
                  onError={(e) => (e.target.src = "/fallback-image.jpg")}
                />
              ) : (
                <p>No image available</p>
              )}
            </div>

            <div className="mt-6 flex justify-between">
              <span className="text-lg sm:text-xl font-semibold">
                {resortName}
              </span>
            </div>
            <div className="mt-2">
              <span className="text-lg text-gray">For your stay:</span>
              <p className="text-lg underline">₱{priceMin}</p>

              {/* Display swimming type cost */}
              <p className="text-lg underline">
                ₱
                {swimmingType === "day"
                  ? 0
                  : swimmingType === "night"
                  ? 500
                  : swimmingType === "whole-day"
                  ? 3000
                  : 0}{" "}
                x {swimmingType}
              </p>
              <p className="text-lg underline">₱{serviceCosts} {selectedServices}</p>
              
            </div>

            <div className="flex justify-between mt-4 border-t-2 pt-2">
              <p className="text-lg font-semibold">Total (PHP)</p>
              <p className="text-lg font-semibold">₱{totalCost}</p>
            </div>
          </div>
        </div>
      </div>
      {showModal &&
        createPortal(
          <Login isOpen={showModal} onClose={() => setShowModal(false)} />,
          document.body
        )}
    </div>
  );
};

export default MBookLog;
