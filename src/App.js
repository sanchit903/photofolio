import NavBar from "./Components/NavBar/Navbar";
import AlbumList from "./Components/AlbumList/AlbumList";
import './index.css';
import { useState } from "react";
import ImageList from "./Components/ImageList/ImageList";

function App() {
  const [showAlbums, setShowAlbums] = useState(true);
  const [showImages, setShowImages] = useState(false);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const sharedProps = { showAlbums, setShowAlbums, showImages, setShowImages, selectedAlbum, setSelectedAlbum };

  return (
    <>
      <NavBar />
      <div className="App_content">
        {showAlbums && <AlbumList value={sharedProps} />}
        {showImages && <ImageList value={sharedProps} />}
      </div>
    </>
  );
}

export default App;
