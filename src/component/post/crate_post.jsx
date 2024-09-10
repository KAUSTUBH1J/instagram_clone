import React, { useState, useEffect, useRef } from 'react';
import CSSLoader from "../../functions/CSSLoader";
import axios from '../../utils/axiosConfig';
import { useNavigate } from 'react-router-dom';

const PostUpload = () => {
    CSSLoader('assets/css/postUpload.css');

    const navigate = useNavigate();

    const [postImage, setPostImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [apiError, setApiError] = useState('');

    const cloudinaryRef = useRef();
    const widgetRef = useRef();
    useEffect(()=>{
        cloudinaryRef.current = window.cloudinary;
        widgetRef.current = cloudinaryRef.current.createUploadWidget({
            cloudName: 'ds925xoam',
            uploadPreset:'tsf6bztk'
        }, function (error,result){
            if (!error && result && result.event === "success") {
                console.log('Uploaded image URL:', result.info.secure_url);
                setPostImage(result.info.secure_url); // Store the URL in state
            } else if (error) {
                console.error('Cloudinary upload error:', error);
                setApiError('An error occurred while uploading the image.');
            }
        })
    },[])

    

    const handleCaptionChange = (e) => {
        setCaption(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("yesss form submit");
        if (!postImage) {
            setApiError('Please select an image.');
            return;
        }

        setIsSubmitting(true);
        setApiError('');

        const data = {
            post: postImage, // Base64 string
            post_description: caption
        };

        try {
            const response = await axios.post('/posts/create', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Post uploaded successfully:', response.data);
            // Handle successful post upload (e.g., show a success message or redirect)
            navigate('/home');
        } catch (error) {
            console.error('Error uploading post:', error);
            setApiError(error.response?.data?.message || 'An error occurred while uploading the post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="post-upload-container">
            
                {/* <div className="image-upload">
                    <label htmlFor="postImage" className="image-upload-label">
                        {postImage ? "Image selected" : "Choose an image"}
                    </label>
                    <input 
                        type="file" 
                        id="postImage" 
                        accept="image/*" 
                        onChange={handleImageChange}
                    />
                </div> */}
                <button className='image-upload' onClick={()=>widgetRef.current.open()}>upload</button>
                <div className="caption-input">
                    <textarea 
                        placeholder="Write a caption..." 
                        value={caption} 
                        onChange={handleCaptionChange} 
                        rows="3"
                    ></textarea>
                </div>
                {apiError && <div className="text-danger mb-3">{apiError}</div>}
                <button type="submit" className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Uploading...' : 'Upload Post'}
                </button>
            
            
        </div>
    );
};

export default PostUpload;
