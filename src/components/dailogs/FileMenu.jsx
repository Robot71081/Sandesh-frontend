import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setIsFileMenu, setUploadingLoader } from '../../redux/reducers/misc';
import { FaRegImage } from "react-icons/fa6";
import { MdAudioFile, MdVideoFile } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { toast } from 'react-hot-toast';
import { useSendAttachmentsMutation } from '../../redux/api/api';

const FileMenu = ({ anchorEl, chatId }) => {
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const [sendAttachments] = useSendAttachmentsMutation();

  const closeFileMenu = () => {
    dispatch(setIsFileMenu(false));
  };

  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5) return toast.error(`You can only send 5 ${key} at a time`);

    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    closeFileMenu();

    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));
     

      const res = await sendAttachments(myForm); // Use unwrap to handle errors
      if (res.data) {
        toast.success(`${key} sent successfully`, { id: toastId });
      } else {
        toast.error(`Failed to send ${key}`, { id: toastId });
      }
    } catch (error) {
      toast.error(error?.message || "An error occurred", { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  const selectImage = () => imageRef.current?.click();
  const selectAudio = () => audioRef.current?.click();
  const selectVideo = () => videoRef.current?.click();
  const selectFile = () => fileRef.current?.click();

  const style = {
    position: 'absolute',
    top: anchorEl ? anchorEl.getBoundingClientRect().bottom - 70 : 0,
    left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
    zIndex: 10,
    width: '12rem',
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={style}>
      <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
        <button
          onClick={closeFileMenu}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          aria-label="Close menu"
        >
          &times;
        </button>
        <div className="flex flex-col p-4">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={selectImage}>
            <abbr title="Image">
              <FaRegImage className="text-gray-600" />
            </abbr>
            <span className="text-gray-800">Image</span>
            <input
              type="file"
              multiple
              accept="image/png,image/jpg,image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={imageRef}
            />
          </div>

          <div className="flex items-center space-x-2 cursor-pointer" onClick={selectAudio}>
            <abbr title="Audio">
              <MdAudioFile className="text-gray-600" />
            </abbr>
            <span className="text-gray-800">Audio</span>
            <input
              type="file"
              multiple
              accept="audio/mpeg,audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={audioRef}
            />
          </div>

          <div className="flex items-center space-x-2 cursor-pointer" onClick={selectVideo}>
            <abbr title="Video">
              <MdVideoFile className="text-gray-600" />
            </abbr>
            <span className="text-gray-800">Video</span>
            <input
              type="file"
              multiple
              accept="video/mp4,video/webm,video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={videoRef}
            />
          </div>

          <div className="flex items-center space-x-2 cursor-pointer" onClick={selectFile}>
            <abbr title="File">
              <FaFileAlt className="text-gray-600" />
            </abbr>
            <span className="text-gray-800">File</span>
            <input
              type="file"
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={fileRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileMenu;
