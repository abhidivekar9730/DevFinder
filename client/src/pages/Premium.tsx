import axios from "axios";
import { BASEURL } from "../helper/constant";

interface PaymentData {
  amount: number;
  keyId: string;
  currency: string;
  notes: {
    firstName: string;
    lastName: string;
    emailId: string;
  };
  orderId: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Premium = () => {
  const handleBuyClick = async (type: string) => {
    try {
      const { data }: { data: PaymentData } = await axios.post(
        `${BASEURL}/payment/create`,
        { membershipType: type },
        { withCredentials: true }
      );

      const { amount, keyId, currency, notes, orderId } = data;

      const options = {
        key: keyId,
        amount: amount * 100, // Amount in paise (Razorpay expects amount in smallest currency unit)
        currency: currency, // e.g., "INR" or "USD"
        name: "Dev Match",
        description: "Connection to different users",
        order_id: orderId, // Fixed the typo
        prefill: {
          name: `${notes.firstName} ${notes.lastName}`,
          email: notes.emailId,
          contact: "9999999999", // Placeholder contact number
        },
        theme: {
          color: "#F37254",
        },
        handler: (response: any) => {
          console.log("Payment successful:", response);
          alert("Payment Successful!");
          // Add logic to notify the backend or update the UI
        },
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Error initiating payment:", error.message);
      alert("Failed to initiate payment. Please try again later.");
    }
  };

  return (
    <div className="m-10 mt-32">
      <div className="flex flexg-col w-full md:flex-row ">
        {/* Silver Membership Card */}
        <div className="card bg-base-300 rounded-box grid h-96 flex-grow place-items-center p-2">
          <p className="underline font-bold text-2xl">Silver Membership</p>
          <ul>
            <li>- Chat with other people</li>
            <li>- 100 connection requests per day</li>
            <li>- Blue Tick</li>
            <li>- 3 Months</li>
          </ul>
          <button
            className="px-3 py-2 border rounded-lg hover:bg-gray-500 hover:text-black"
            onClick={() => handleBuyClick("silver")}
          >
            Buy Silver
          </button>
        </div>
        <div className="divider divider-vertical md:divider-horizontal">OR</div>
        {/* Gold Membership Card */}
        <div className="card bg-base-300 rounded-box grid h-96 flex-grow place-items-center text-orange-400 p-2">
          <p className="underline font-bold text-2xl">Gold Membership</p>
          <ul>
            <li>- Chat with other people</li>
            <li>- 200 connection requests per day</li>
            <li>- Blue Tick</li>
            <li>- 6 Months</li>
          </ul>
          <buttong
            className="px-3 py-2 border rounded-lg hover:bg-orange-500 hover:text-white"
            onClick={() => handleBuyClick("gold")}
          >
            Buy Gold
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
