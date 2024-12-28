import { useEffect, useState } from 'react';
import styles from './ImageList.module.css';
import ImageForm from '../ImageForm/ImageForm';
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../FirebaseInit';
import { toast } from 'react-toastify';
import Spinner from 'react-spinner-material';

export default function ImageList({ value }) {
    const { showAlbums, setShowAlbums, showImages, setShowImages, selectedAlbum } = value;
    const [showForm, setShowForm] = useState(false);
    const [imageDetails, setImageDetails] = useState({ title: '', image: '' });
    const [action, setAction] = useState(null);
    const [images, setImages] = useState([]);
    const [showCarousel, setShowCarousel] = useState(false);
    const [showSearchBox, setShowSearchBox] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredImages, setFilteredImages] = useState(images);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        if (selectedAlbum?.Images) {
            setImages(selectedAlbum.Images);
            setFilteredImages(selectedAlbum.Images);
        }
        setLoading(false);
    }, [selectedAlbum, images]);

    const albumRef = doc(db, 'albums', selectedAlbum.id);

    const fetchUpdatedAlbum = async () => {
        try {
            const albumSnapshot = await getDoc(albumRef);
            if (albumSnapshot.exists()) {
                const updatedAlbum = albumSnapshot.data();
                setImages(updatedAlbum.Images);
                selectedAlbum.Images = updatedAlbum.Images;
            }
        } catch (error) {
            console.error('Failed to fetch updated album', error);
        }
    }

    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        if (query) {
            const filteredImages = images.filter((image) =>
                image.title.toLowerCase().includes(query)
            );
            setFilteredImages(filteredImages);
        }
    }

    const clearSearch = () => {
        setSearchQuery('');
        setFilteredImages(images);
    }

    const handleMouseEnter = () => setHovered(true);
    const handleMouseLeave = () => setHovered(false);

    const showAlbumList = (e) => {
      e.preventDefault();
      setShowAlbums(!showAlbums);
      setShowImages(!showImages);
    };

    const handleNext = () => {
        if (images) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % selectedAlbum.Images.length);
        }
    }

    const handlePrev = () => {
        if (images) {
            setCurrentImageIndex((prevIndex) => prevIndex === 0 ? selectedAlbum.Images.length - 1 : prevIndex - 1);
        }
    }

    const openCarousel = (index) => {
        setCurrentImageIndex(index);
        setShowCarousel(true);
    }

    const openImageForm = (action,image) => {
        setAction(action);
        if (action === 'update') {
            setShowForm(true); 
        } else {
            setShowForm(!showForm);
        }
        if(action === 'update') setImageDetails({ title: image.title, image: image.image });
        else setImageDetails({ title: '', image: '' });
    }

    const deleteImage = async (e, image) => {
        e.preventDefault();
        try {
            await updateDoc(albumRef, {
                Images: arrayRemove(image)
            });
            toast.success('Image deleted successfully.');
            fetchUpdatedAlbum();
        } catch (error) {
            toast.error('Failed to delete image. Please try again.');
        }
    }

    return (
        <>
            {showForm && (
                <ImageForm
                    value={{ imageDetails, selectedAlbum, action }}
                    onActionComplete={fetchUpdatedAlbum}
                />
            )}
            {showCarousel && (
                <div className={styles.carousel}>
                    <button onClick={() => setShowCarousel(false)}>x</button>
                    <button onClick={handlePrev}>{`<`}</button>
                    <img
                        src={filteredImages[currentImageIndex].image}
                        alt={filteredImages[currentImageIndex].title}
                    />
                    <button onClick={handleNext}>{`>`}</button>
                </div>
            )}
            <div className={styles.imageList_top}>
                <span onClick={(e) => showAlbumList(e)}>
                    <img src="/assets/back.png" alt="back" />
                </span>
                <h3>
                    {images.length !== 0
                        ? `Images in ${selectedAlbum.name}`
                        : "No images found in the album"}
                </h3>
                <div className={styles.imageList_search}>
                    {showSearchBox && <input placeholder="Search" value={searchQuery} onChange={handleSearch} />}
                    <img
                        src={showSearchBox ? "/assets/clear.png" : "/assets/search.png"}
                        alt={showSearchBox ? "clear" : "search"}
                        onClick={() => {
                            if(showSearchBox) clearSearch();
                            setShowSearchBox(!showSearchBox);
                        }}
                    />
                </div>
                <button
                    className={showForm ? styles.imageList_active : "false"}
                    onClick={() => openImageForm("add")}
                >
                    {showForm ? "Cancel" : "Add image"}
                </button>
            </div>
            {loading ? (
                <div>
                    <Spinner size={120} spinnerColor={"#333"} spinnerWidth={2} visible={true} />
                </div>
            ) : (
                <div className={styles.imageList_imageList}>
                    {filteredImages.length !== 0 &&
                        filteredImages.map((image, index) => (
                            <div
                                key={index}
                                className={styles.imageList_image}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                onClick={() => openCarousel(index)}
                            >
                                <div
                                    className={`${styles.imageList_update} ${hovered ? styles.imageList_active : "false"
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openImageForm("update", image);
                                    }}
                                >
                                    <img src="/assets/edit.png" alt="update" />
                                </div>
                                <div
                                    className={`${styles.imageList_delete} ${hovered ? styles.imageList_active : "false"
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteImage(e, image);
                                    }}
                                >
                                    <img src="/assets/trash-bin.png" alt="delete" />
                                </div>
                                <img src={image.image} alt={image.title} />
                                <span>{image.title}</span>
                            </div>
                        ))}
                </div>
            )}
        </>
    );
}