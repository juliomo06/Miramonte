import React, { useState } from "react";
import logo5 from "../Assets/mt.png";
import loc from "../Assets/loca.PNG";
import axios from "axios";
import Swal from "sweetalert2";

const MContact = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    contact: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/users/send-email', formData);
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Email sent successfully!',
        confirmButtonText: 'OK'
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        contact: '',
        message: '',
      });
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.response?.data || 'Error sending email!',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col justify-end items-center w-full h-full">
      <div className="w-full h-full flex justify-center">
        <img
          className="absolute brightness-50 w-full h-96 object-cover object-top"
          src={logo5}
          alt=""
        />
      </div>
      <div className="h-full z-0 w-full flex flex-col items-center justify-center mt-12 ">
        <h1 className="text-4xl text-white font-serif font-semibold uppercase ">
          CONTACT
        </h1>
        <h4 className="text-white font-thin">
          THE PLACE, OUR SERVICES & OUR TEAM
        </h4>
        <div className="mt-12 flex flex-col items-center w-full">
          <div className="w-2/3 max-laptop:w-3/4 max-tablet:w-5/6 max-phone:w-11/12 flex items-center justify-center zoom-in group-hover:transform hover:scale-110 transition-all duration-300 delay-150 ease-in-out">
            <img className="-z-1 rounded-xl shadow-lg" src={loc} alt="" />
          </div>
          <div className="container mx-auto px-4 py-16">
            <h2 className="text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <details>
                <summary className="font-bold text-xl">How can I make a reservation at Miramonte Village Resorts?</summary>
                <p className="text-gray-700">You can make a reservation through our official website, by calling our reservations desk at [phone number], or by emailing us at [email address].</p>
              </details>
              <details>
                <summary className="font-bold text-xl">What types of resort are available at Miramonte Village?</summary>
                <p className="text-gray-700">We offer a variety of resorts including standard resorts, deluxe, family, and luxury resorts. Detailed descriptions and availability can be found on our website.</p>
              </details>
              <details>
                <summary className="font-bold text-xl">What is the cancellation policy?</summary>
                <p className="text-gray-700">Our standard cancellation policy allows for free cancellation up to 48 hours before the check-in date. Cancellations made within 48 hours of check-in may incur a fee. Please refer to your booking confirmation for specific terms.</p>
              </details>
              <details>
                <summary className="font-bold text-xl">Are there any discounts available?</summary>
                <p className="text-gray-700">Yes, we offer seasonal promotions, early bird discounts, and special rates for members of our loyalty program. Check our website or contact our reservations desk for the latest offers.</p>
              </details>
            </div>
          </div>

          <div className="mt-12 bg-gradient-to-r p-4 container mx-auto from-cyan-500 to-blue-500 w-full flex items-center justify-center rounded-lg">
            <div className="flex flex-col text-white items-center">
              <h1 className="text-3xl">Send an email</h1>
              <h2 className="mt-4 font-light">
                Please use this form if you have any questions about our
                services and we'll get back to you as soon as we can.
              </h2>
              <form className="w-full text-black" onSubmit={handleSubmit}>
                <div className="flex flex-row w-full space-x-4 mt-6">
                  <input className="p-2 w-1/2" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required />
                  <input className="p-2 w-1/2" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your email" required />
                </div>
                <div className="flex flex-row space-x-4 mt-6 w-full justify-between">
                  <input className="p-2 w-1/2" type="text" name="subject" value={formData.subject} onChange={handleChange} placeholder="Subject" required />
                  <input className="p-2 w-1/2" type="text" name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact No." required />
                </div>
                <textarea className='w-full h-24 mt-6 p-2' name="message" value={formData.message} onChange={handleChange} placeholder="Your message" required></textarea>

                <button className='mt-8 mb-8 border-2 px-4 py-2 rounded-md text-white font-semibold' type="submit" disabled={loading}>
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    'SEND MESSAGE'
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MContact;
