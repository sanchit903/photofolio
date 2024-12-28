import { useEffect, useRef, useState } from 'react';
import styles from './ImageForm.module.css';
import { toast, ToastContainer } from 'react-toastify';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../FirebaseInit';

export default function ImageForm({ value, onActionComplete }) {
    const { imageDetails, selectedAlbum, action } = value;
    const [formData, setFormData] = useState({ title: '', image: '' });

    const titleRef = useRef();

    useEffect(() => {
        setFormData({ title: imageDetails?.title, image: imageDetails?.image });
        titleRef.current.focus();
    }, [imageDetails]);

    const clear = () => {
        setFormData({ title: '', image: '' });
        titleRef.current.focus();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.image) {
            toast.error('Please fill out both fields!');
            return;
        }

        try {
            const albumRef = doc(db, 'albums', selectedAlbum.id);
            if (action === 'add') {
                await updateDoc(albumRef, {
                  Images: arrayUnion(formData),
                });
                toast.success('Image added successfully!');
            } else {
                await updateDoc(albumRef, {
                    Images: arrayRemove(imageDetails)
                });
                await updateDoc(albumRef, {
                    Images: arrayUnion(formData)
                });
                toast.success('Image updated successfully!');
            }
            onActionComplete();
        } catch (error) {
            toast.error(`Failed to ${action} image. Please try again.`)
        }
        setFormData({ title: '', image: '' });
        titleRef.current.focus();
    }

    return (
        <div className={styles.imageForm}>
            <span>{action==='add'?"Add image to album":`Update image ${formData.title}`}</span>
            <form onSubmit={handleSubmit}>
                <input
                    required
                    placeholder="Title"
                    value={formData.title}
                    ref={titleRef}
                    onChange={(e) => setFormData({ title: e.target.value, image:formData.image })}
                />
                <input
                    required
                    placeholder="Image URL"
                    value={formData.image}
                    onChange={(e) => setFormData({ title:formData.title, image: e.target.value })}
                />
                <div className={styles.imageForm_actions}>
                    <button type="button" onClick={clear}>
                        Clear
                    </button>
                    <button type="submit">{action === "add" ? "Add" : "Update"}</button>
                </div>
            </form>
            <ToastContainer />
        </div>
    );
}