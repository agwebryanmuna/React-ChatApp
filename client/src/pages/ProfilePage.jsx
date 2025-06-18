import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import imageCompression from "browser-image-compression";
import assets from "../assets/assets";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);
  const [isSubmittingToBackend, setIsSubmittingToBackend] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmittingToBackend(true);

    if (!selectedImage) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1020,
      useWebWorker: true,
    };
    try {
      const compressedImage = await imageCompression(selectedImage, options);
      // Convert compressed image to base64
      const reader = new FileReader();
      reader.readAsDataURL(compressedImage);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate("/");
        setIsSubmittingToBackend(false);
      };
    } catch (error) {
      console.log(error);
      setIsSubmittingToBackend(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg">
        <form
          onSubmit={onSubmitHandler}
          className="flex flex-col gap-5 p-10 flex-1"
        >
          <h3 className="text-lg">Profile details</h3>
          <label
            htmlFor="avatar"
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              loading="lazy"
              className={`size-12 ${selectedImage && "rounded-full"}`}
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : assets.avatar_icon
              }
              alt="Profile"
            />
            Upload profile image
          </label>
          <input
            type="text"
            required
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <textarea
            rows={4}
            id="bio"
            required
            placeholder="Write profile bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <button
            disabled={isSubmittingToBackend}
            type="submit"
            className={`p-2 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-full text-lg ${
              isSubmittingToBackend
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            Save
          </button>
        </form>
        <img
          loading="lazy"
          src={authUser?.profilePic || assets.logo_icon}
          alt="profile image"
          className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${
            selectedImage && "rounded-full"
          }`}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
