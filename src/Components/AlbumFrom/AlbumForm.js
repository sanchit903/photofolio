import { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import styles from './AlbumForm.module.css';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../../FirebaseInit';

export default function AlbumForm() {
    const [formData, setFormData] = useState({ name: '' });

    const nameRef = useRef(null);

    useEffect(() => {
        nameRef.current.focus();
    }, []);

    const clear = () => {
        setFormData({ name: '' });
        nameRef.current.focus();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const albumRef = doc(collection(db, 'albums'));
            await setDoc(albumRef, {
                name: formData.name
            });
            toast.success('Album added successfully.')
            setFormData({ name: '' });
        } catch (error) {
            toast.error('Failed to create album. Please try again.');
        }
    }

    return (
        <div className={styles.albumForm}>
            <span>Create an album</span>
            <form onSubmit={handleSubmit}>
                <input
                    required
                    placeholder="Album Name"
                    ref={nameRef}
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                />
                <button type="button" onClick={clear}>
                    Clear
                </button>
                <button>Create</button>
            </form>
            <ToastContainer />
        </div>
    );
}