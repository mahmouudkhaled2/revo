/* eslint-disable no-unused-vars */
import { useRef, useState, useContext, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { FaArrowLeft } from "react-icons/fa";
import { LuCrop } from "react-icons/lu";
import { ImZoomIn, ImZoomOut } from "react-icons/im";
import { MdOutlineEmojiEmotions, MdOutlineClose } from "react-icons/md";
import { IoImageOutline } from "react-icons/io5";
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { authContext } from '../Context/AuthProvider';
import { collection, addDoc, Timestamp, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';

export default function CreatePostForm({ openModal, setOpenModal, onClose, onPostCreated, onPostUpdated, onPostDeleted, editPost }) {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);
  const [cropperInstance, setCropperInstance] = useState(null);
  const [postText, setPostText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { currentUser } = useContext(authContext);
  const imageInput = useRef(null);

  // Initialize form when editing
  useEffect(() => {
    if (editPost) {
      setPostText(editPost.description || "");
      if (editPost.image) {
        setCroppedImage(editPost.image);
        setStep(3);
      }
    }
  }, [editPost]);

  const resetForm = () => {
    setStep(1);
    setImage(null);
    setCroppedImage(null);
    setPostText("");
    setShowEmojiPicker(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const skipCropping = () => {
    setCroppedImage(image);
    setStep(3);
  };

  const handleCrop = () => {
    if (cropperInstance) {
      setCroppedImage(cropperInstance.getCroppedCanvas().toDataURL());
      setStep(3);
    }
  };

  const addEmoji = (emoji) => {
    setPostText((prevText) => prevText + emoji.native);
    setShowEmojiPicker(false);
  };

  const handleDelete = async () => {
    if (!editPost?.id || isDeleting) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    setIsDeleting(true);
    const toastId = toast.loading('Deleting post...');

    try {
      await deleteDoc(doc(db, "posts", editPost.id));
      onPostDeleted(editPost.id);
      toast.success('Post deleted successfully!', { id: toastId });
      handleClose();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error('Failed to delete post. Please try again.', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async () => {
    if (!croppedImage || !postText.trim() || isSubmitting) return;

    const toastId = toast.loading(editPost ? 'Updating post...' : 'Creating post...');
    setIsSubmitting(true);

    try {
      const postData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || "User",
        userImage: "/assets/images/default-user.png",
        image: croppedImage,
        description: postText.trim(),
        ...(editPost ? {} : { createdAt: Timestamp.now(), likes: 0, comments: [] })
      };

      if (editPost?.id) {
        // Update existing post
        await updateDoc(doc(db, "posts", editPost.id), postData);
        const updatedPost = { ...postData, id: editPost.id };
        onPostUpdated(updatedPost);
        toast.success('Post updated successfully!', { id: toastId });
      } else {
        // Create new post
        const docRef = await addDoc(collection(db, "posts"), postData);
        const newPost = { ...postData, id: docRef.id };
        onPostCreated(newPost);
        toast.success('Post created successfully!', { id: toastId });
      }
      
      handleClose();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error('Failed to save post. Please try again.', { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!openModal) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            {step > 1 && !editPost && (
              <button 
                onClick={() => setStep(step - 1)}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FaArrowLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-semibold">
              {editPost ? 'Edit Post' : 'Create New Post'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {editPost && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-red-500 hover:text-red-600 px-4 py-2 rounded-full transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
            {step === 3 && (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !postText.trim()}
                className={`bg-[#F27141] text-white px-6 py-2 rounded-full transition-all ${
                  isSubmitting || !postText.trim() 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-[#e05f35] hover:shadow-md'
                }`}
              >
                {isSubmitting ? (editPost ? 'Updating...' : 'Posting...') : (editPost ? 'Update' : 'Share')}
              </button>
            )}
            <button 
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <MdOutlineClose size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        {step === 1 && !editPost && (
          <div className="p-12">
            <input
              type="file"
              accept="image/*"
              ref={imageInput}
              className="hidden"
              onChange={handleImageUpload}
            />
            <div
              className="cursor-pointer flex flex-col items-center gap-8 text-gray-600 border-2 border-dashed border-gray-300 rounded-lg p-12 transition-all hover:border-[#F27141] hover:bg-orange-50"
              onClick={() => imageInput.current.click()}
            >
              <IoImageOutline size={64} className="text-[#F27141]" />
              <div className="text-center">
                <p className="text-xl font-medium mb-2">Drag photos here</p>
                <p className="text-gray-500 mb-6">or click to upload</p>
                <button className="bg-[#F27141] text-white px-8 py-3 rounded-full hover:bg-[#e05f35] transition-colors shadow-md hover:shadow-lg">
                  Select From Computer
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && !editPost && (
          <div className="relative">
            <Cropper
              src={image}
              style={{ height: 500, width: "100%" }}
              aspectRatio={16 / 9}
              guides={true}
              viewMode={2}
              background={false}
              autoCrop={true}
              onInitialized={(instance) => setCropperInstance(instance)}
            />
            <div className="absolute bottom-6 right-6 flex gap-3">
              <button
                className="bg-black bg-opacity-75 w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                onClick={() => cropperInstance.zoom(0.1)}
                title="Zoom In"
              >
                <ImZoomIn className="text-white text-xl" />
              </button>
              <button
                className="bg-black bg-opacity-75 w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                onClick={() => cropperInstance.zoom(-0.1)}
                title="Zoom Out"
              >
                <ImZoomOut className="text-white text-xl" />
              </button>
              <button
                onClick={skipCropping}
                className="bg-gray-800 px-6 h-12 rounded-full text-white flex items-center gap-2 transition-all hover:bg-gray-700 hover:shadow-lg"
              >
                Skip Cropping
              </button>
              <button
                className="bg-[#F27141] px-6 h-12 rounded-full text-white flex items-center gap-2 transition-all hover:bg-[#e05f35] hover:shadow-lg"
                onClick={handleCrop}
              >
                <LuCrop /> Crop & Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="h-[600px]">
            <div className="w-full flex flex-col">
              {/* User Info */}
              <div className="flex items-center gap-3 p-4 border-b">
                <img
                  src="/assets/images/default-user.png"
                  alt="User"
                  className="w-10 h-10 rounded-full border border-gray-200"
                />
                <span className="font-medium">
                  {currentUser?.displayName || "User"}
                </span>
              </div>

              {/* Post Text */}
              <div className="flex-1 relative p-4">
                <textarea
                  placeholder="Write a caption..."
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  maxLength={2000}
                  className="w-full h-full resize-none border-none outline-none bg-transparent"
                />
                <div className="absolute bottom-4 right-4 flex items-center gap-3 text-gray-500">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="hover:text-[#F27141] transition-colors"
                    title="Add emoji"
                  >
                    <MdOutlineEmojiEmotions size={24} />
                  </button>
                  <span className="text-sm font-medium">
                    {postText.length}/2000
                  </span>
                </div>
                {showEmojiPicker && (
                  <div className="absolute bottom-14 right-4">
                    <Picker 
                      data={data} 
                      onEmojiSelect={addEmoji}
                      theme="light"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-full border-r bg-gray-100 overflow-y-auto">
              <img
                src={croppedImage}
                alt="Preview"
                className="w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

CreatePostForm.propTypes = {
  openModal: PropTypes.bool.isRequired,
  setOpenModal: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onPostCreated: PropTypes.func.isRequired,
  onPostUpdated: PropTypes.func,
  onPostDeleted: PropTypes.func,
  editPost: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string
  })
}; 