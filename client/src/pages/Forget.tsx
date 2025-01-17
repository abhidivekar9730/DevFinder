import { useState } from "react";
import { forgetPassword, otpverify } from "../requests/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Forget = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleForget = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await forgetPassword({ emailId });
      toast.success(response.message);
      if (response) {
        setShowOtp(true);
      } // Show OTP input after success
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to send OTP!");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: any) => {
    e.preventDefault();
    try {
      setLoading(true);
      // Call your OTP verification API here
      const response = await otpverify({ emailId, otpNumber: otp });
      if (response.token) {
        navigate(`/reset/${response.token}`);
      }
      console.log(response);
      toast.success("OTP verified successfully!");
    } catch (error: any) {
      setShowOtp(false);
      setEmailId("");
      setOtp("");
      toast.error(error.response?.data?.message || "OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="bg-base-300 p-10 rounded-xl shadow-lg">
        <h1 className="text-2xl font-semibold mb-4">Forgot Password</h1>
        <p className="text-gray-700 mb-6 text-center">
          Enter your email address to reset your password.
        </p>
        <form
          className="w-full max-w-sm"
          onSubmit={showOtp ? handleVerifyOtp : handleForget}
        >
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />

          {showOtp && (
            <div className="flex flex-col mb-4">
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {!showOtp && (
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Forget;
