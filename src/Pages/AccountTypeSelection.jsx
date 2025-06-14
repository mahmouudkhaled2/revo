import { useNavigate } from "react-router-dom";
import { useState } from "react";
import chefImage from "/assets/images/chef.png";
import userImage from "/assets/images/user.png";
import { Helmet } from "react-helmet";

export default function AccountTypeSelection() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const handleUserTypeSelection = (type) => {
    setSelectedType(type);
  };

  const handleNext = () => {
    if (!selectedType) return;

    if (selectedType === "user") {
      sessionStorage.setItem("userType", "user");
      navigate("/register");
    } else {
      navigate("/owner-redirect");
    }
  };

  return (
    <>
      <Helmet>
        <title>Revo | Choose Your Account type</title>
      </Helmet>
      <div className="min-h-[85vh] flex items-center justify-center bg-white py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Choose Account Type
            </h2>
          </div>

          <div className="flex justify-center gap-8 mt-12">
            {/* Restaurant Account Option */}
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="accountType"
                className="sr-only"
                onChange={() => handleUserTypeSelection("owner")}
                checked={selectedType === "owner"}
              />
              <div
                className={`w-64 p-4 border-2 rounded-lg transition-all ${
                  selectedType === "owner"
                    ? "border-[#F27141] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="aspect-square bg-orange-100 rounded-lg p-4 mb-4 flex items-center justify-center">
                  <img
                    src={chefImage}
                    alt="Restaurant Owner"
                    className="w-3/4 h-3/4 object-contain"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${
                      selectedType === "owner"
                        ? "border-[#F27141]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedType === "owner" && (
                      <div className="w-3 h-3 bg-[#F27141]" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    Restaurant Account
                  </span>
                </div>
              </div>
            </label>

            {/* User Account Option */}
            <label className="relative cursor-pointer">
              <input
                type="radio"
                name="accountType"
                className="sr-only"
                onChange={() => handleUserTypeSelection("user")}
                checked={selectedType === "user"}
              />
              <div
                className={`w-64 p-4 border-2 rounded-lg transition-all ${
                  selectedType === "user"
                    ? "border-[#F27141] bg-orange-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="aspect-square bg-green-100 rounded-lg p-4 mb-4 flex items-center justify-center">
                  <img
                    src={userImage}
                    alt="User"
                    className="w-3/4 h-3/4 object-contain"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 border-2 rounded-sm flex items-center justify-center ${
                      selectedType === "user"
                        ? "border-[#F27141]"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedType === "user" && (
                      <div className="w-3 h-3 bg-[#F27141]" />
                    )}
                  </div>
                  <span className="text-lg font-medium text-gray-900">
                    User Account
                  </span>
                </div>
              </div>
            </label>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handleNext}
              disabled={!selectedType}
              className={`px-12 py-3 rounded-md text-white text-lg font-medium transition-all ${
                selectedType
                  ? "bg-[#F27141] hover:bg-[#d85f32]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
