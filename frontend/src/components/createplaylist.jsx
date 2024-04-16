import { useState, useEffect } from "react";
import "./createplaylist.css";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import { useLikedSongs } from "../LikedSongsContext";
import callSpotifyAPI from "../services/apiservice";

const CreatePlaylist = () => {
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [likedResult, setLikedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { likedSongs } = useLikedSongs();

  const chosenSongMax = 5;

  const handleToggleSong = (song) => {
    if (selectedSongs.includes(song)) {
      setSelectedSongs(selectedSongs.filter((item) => item !== song));
    } else {
      if (selectedSongs.length >= chosenSongMax) {
        alert("You can only select up to 5 songs.");
      } else {
        setSelectedSongs([...selectedSongs, song]);
      }
    }
  };

  const handleLikeResult = (like) => {
    setLikedResult(like);
  };

  const handleExport = () => {
    // Export logic here
  };

  const testFunction = () => {
    console.log("sorting and generation of playlist")
  }

  const handleExportPrompt = () => {
    // Recursive function to prompt user until they like the playlist
    if (likedResult === false) {
      setLikedResult(null); // Reset likedResult
      // Prompt the user again for liking the playlist
      handleLikeResult(window.confirm("Do you like your creation now?"));
    }
  };

  // Call handleExportPrompt whenever likedResult changes
  useEffect(() => {
    handleExportPrompt();
  }, [likedResult]);

  async function getArtistName(artistId) {
    try {
      const data = await callSpotifyAPI(`https://api.spotify.com/v1/artists/${artistId}`);
      return data.name;
    } catch (error) {
      console.error("Error fetching artist name:", error);
      return "Unknown Artist";
    }
  }

  const filteredSongs = likedSongs.filter((song) =>
    song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="main">
      <div className="create-playlist-container">
        <h1 className="instructions">Create a Playlist</h1>
        <div className="scrollable-list">
          <TextField
            fullWidth
            label="Search Songs"
            variant="outlined"
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ marginBottom: "20px" }}
          />
          <table className="songs-table playlist-table">
            <thead>
              <tr>
                <th>Select</th>
                <th>Song</th>
                {/* <th>Artist</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song, index) => (
                <tr key={index} className="song-item">
                  <td>
                    <Checkbox
                      onChange={() => handleToggleSong(song)}
                      checked={selectedSongs.includes(song)}
                      color="primary"
                      sx={{
                        color: "#000000",
                        "&.Mui-checked": { color: "#52b788" },
                        marginRight: "2rem",
                      }}
                    />
                  </td>
                  <td>{song.name}</td>
                  {/* <td>{getArtistName(song.artistIds[0])}</td>  */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedSongs.length === 5 && (
          <div className="like-dislike-section">
            <h1 className="instructions">Preview Playlist</h1>
            <button className="sortify-music-btn" onClick={testFunction}>
              Generate
            </button>
          </div>
        )}

        {likedResult === true && (
          <div className="button-section">
            <button className="export-button" onClick={handleExport}>
              EXPORT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePlaylist;
