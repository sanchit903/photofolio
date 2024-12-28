import { useEffect, useState } from 'react';
import Spinner from "react-spinner-material";
import styles from './AlbumList.module.css';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../FirebaseInit';
import AlbumForm from '../AlbumFrom/AlbumForm';


export default function AlbumList({value}) {
    const [albums, setAlbums] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { showAlbums, setShowAlbums, showImages, setShowImages, setSelectedAlbum } = value;

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "albums"), (snapShot) => {
            const albums = snapShot.docs.map((doc) => {
                return {
                    id: doc.id,
                    ...doc.data(),
                };
            });
            setAlbums(albums);
            setLoading(false);
        });
        return () => unsub();
    }, []);
    
    const showImageList = (e, album) => {
        e.preventDefault();
        setSelectedAlbum(album);
        setShowAlbums(!showAlbums);
        setShowImages(!showImages);
    }

    return (
        <div>
            {showForm && <AlbumForm />}
            <div>
                <div className={styles.albumsList_top}>
                    <h3>Your Albums</h3>
                    <button
                        className={showForm ? styles.albumsList_active : "false"}
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? "Cancel" : "Add album"}
                    </button>
                </div>
            </div>
            {loading ? (
                <div>
                    <Spinner size={120} spinnerColor={"#333"} spinnerWidth={2} visible={true} />
                </div>
            ) : (
                <div className={styles.albumsList_albumsList}>
                    {albums.map((album) => (
                        <div className={styles.albumsList_album} key={album.id} onClick={(e) => showImageList(e, album)}>
                            <img src="/assets/photos.png" alt="photos" />
                            <span>{album.name}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}