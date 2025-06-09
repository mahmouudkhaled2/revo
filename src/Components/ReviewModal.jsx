/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useRef, useState } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaArrowLeft } from "react-icons/fa";
import { LuCrop } from "react-icons/lu";
import { ImZoomIn, ImZoomOut } from "react-icons/im";
import { MdOutlineStarBorder, MdOutlineEmojiEmotions, MdLocationOn } from "react-icons/md";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function ReviewModal({openModal, setOpenModal, handleClose}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [step, setStep] = useState(1); // Step: 1 (Upload), 2 (Crop), 3 (Review)
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropperInstance, setCropperInstance] = useState(null);
  const [isCropping, setIsCropping] = useState(true); // Toggle cropping mode
  const [reviewText, setReviewText] = useState("");
  const [location, setLocation] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const imageInput = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropperInstance) {
      setCroppedImage(cropperInstance.getCroppedCanvas().toDataURL());
      setStep(3);
    }
  };

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
  };

  const handleSubmit = () => {
    console.log({
      croppedImage,
      reviewText,
      location,
    });
  };

  const handleModelClose = (e) => {
    if (e.currentTarget === e.target) {
      handleClose();
    }
  }

  const addEmoji = (emoji) => {
    setReviewText((prevText) => prevText + emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <>
      <div onClick={handleModelClose} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-hidden">
        <div className="bg-white rounded-lg overflow-hidden min-w-[450px] shadow-xl">
          {step === 1 && (
            <div className="flex flex-col items-center">
              <div className="w-full px-5 py-3 text-center border-b border-black">
                <h2 className="font-medium">Create New Review</h2>
              </div>
              <div className="p-5 w-full">
                <div className="p-6 rounded-lg text-center w-full">
                  <input
                    type="file"
                    accept="image/*"
                    ref={imageInput}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <div
                    className="cursor-pointer flex flex-col items-center gap-10 text-gray-600"
                    onClick={() => imageInput.current.click()}
                  >
                    <img src="/public/media-img.png" alt="" className="w-40" />
                    <p className="mt-2">Drag photos and videos here</p>
                    <button className="w-[300px] h-[40px] bg-[#F27141] text-[#F3F3F3] px-7 py-2 rounded-md">
                      Select From Computer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="relative">
              <div className="w-full flex justify-between items-center px-5 py-3 text-center border-b border-black">
                <FaArrowLeft className="cursor-pointer" onClick={() => setStep(1)} />
                <h2 className="font-medium">Crop</h2>
                <button
                  type="button"
                  onClick={handleCrop}
                  className="text-[#F27141]"
                >
                  Next
                </button>
              </div>
              <div className="relative">
                <Cropper
                  src={image}
                  style={{ height: 300, width: "100%" }}
                  aspectRatio={1}
                  guides={false}
                  zoomOnWheel={false}
                  viewMode={1}
                  autoCrop={false}
                  onInitialized={(instance) => setCropperInstance(instance)}
                />
                <div className="w-full px-5 absolute bottom-2 right-2 flex justify-between gap-2">
                  <div className="flex gap-2 items-center">
                    <button
                      className="bg-black bg-opacity-75 size-8 shadow-md rounded-full flex items-center justify-center"
                      title="Enable Crop"
                      onClick={() => {
                        cropperInstance.crop();
                        setIsCropping(true);
                      }}
                    >
                      <LuCrop className="text-xl text-white" />
                    </button>
                    <button
                      className="bg-black bg-opacity-75 size-8 shadow-md rounded-full flex items-center justify-center"
                      title="Zoom In"
                      onClick={() => cropperInstance.zoom(0.1)}
                    >
                      <ImZoomIn className="text-lg text-white" />
                    </button>
                    <button
                      className="bg-black bg-opacity-75 size-8 shadow-md rounded-full flex items-center justify-center"
                      title="Zoom Out"
                      onClick={() => cropperInstance.zoom(-0.1)}
                    >
                      <ImZoomOut className="text-lg text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="w-full flex justify-between items-center px-5 py-3 text-center border-b border-black">
                <FaArrowLeft className="cursor-pointer" onClick={() => setStep(2)} />
                <h2 className="font-medium">Create New Review</h2>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="text-[#F27141]"
                >
                  Share
                </button>
              </div>

              <div className="w-full flex justify-between">
                {croppedImage && (
                  <div className="w-[400px]">
                    <img
                      src={croppedImage}
                      alt="Selected"
                      className="w-full object-cover h-full"
                    />
                  </div>
                )}

                <div className="py-5 w-[450px]">
                  <div className="user flex items-center gap-2 px-3">
                    <div className="size-10 rounded-full border">
                      <img src="/public/media-img.png" alt="" className="w-full h-full rounded-full" />
                    </div>
                    <p>mostafa3616</p>
                  </div>
                  <form className="">
                    <div className="w-full border-b border-b-[#737373] h-[150px] mt-3 relative">
                      <textarea
                        name="review"
                        placeholder="Your review text"
                        rows={15}
                        className="w-full h-full resize-none outline-none px-3"
                        maxLength={2000}
                        value={reviewText}
                        onChange={handleReviewTextChange}
                      />
                      <div className="w-full flex justify-between items-center p-3 absolute bottom-0 text-[#737373]">
                        <MdOutlineEmojiEmotions 
                          className="text-lg cursor-pointer"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                        <span className="block text-sm">{reviewText.length}/2000</span>
                      </div>
                      {showEmojiPicker && (
                        <Picker
                          data={data}
                          onEmojiSelect={addEmoji}
                          style={{ position: 'absolute', bottom: '40px', right: '10px' }}
                        />
                      )}
                    </div>

                    <div className="flex justify-between items-center p-3">
                      <h4 className="text-lg">
                        Location
                      </h4>
                      <div className="flex items-center gap-2">
                        <MdLocationOn className="text-2xl" />
                        <input
                          type="text"
                          className="outline-none border-b border-b-[#737373] w-full"
                          value={location}
                          onChange={handleLocationChange}
                          placeholder="Enter location"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center p-3">
                      <h4 className="text-lg">
                        Rate
                      </h4>
                      <span>
                        <MdOutlineStarBorder className="text-2xl" />
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
