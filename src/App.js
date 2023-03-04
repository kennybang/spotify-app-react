import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_KEY // Client id key set from local env file. Either create an env file and put it there or just replace with your key here.
  const REDIRECT_URI = "http://localhost:3000"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  const SCOPE = "user-top-read"

  
  const [token, setToken] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [timeRange, setTimeRange] = useState("")
  const [artists, setArtists] = useState([])
  const [tracks, setTracks] = useState([])

  useEffect( () => {
    
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")
    console.log("token business")
    
    if(!token && hash) {      
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      
      window.location.hash = ""
      window.localStorage.setItem("token", token)
      
    }
    console.log("Setting token")
    setToken(token)
  }, [])

  useEffect( ()=> {
    if(token){
      console.log("getting and setting tracks")
      getTracks()
      console.log("getting and setting tracks done")
  }
  }, [timeRange]);

  const getTracks = async (/*e*/) => {
    //e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/me/top/tracks",{
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        time_range: timeRange,//"short_term"
        limit: 50

      }
    })
    setTracks(data.items)
    renderArtists()
  }

  const logout = () => {
      setToken("")
      window.localStorage.removeItem("token")
      console.log("logout")
      setArtists([])
      setTracks([])
      
  }

  const searchArtists = async (e) => {
    e.preventDefault()
    const {data} = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          q: searchKey,
          type: "artist"
        }
    })
    console.log(data)
    setArtists(data.artists.items)
  }

  const renderArtists = () => {
    return artists.map(artists => (
      <div key={artists.id}>
        {artists.images.length ? <img width= {"100%"} src={artists.images[0].url} alt=""/> : <div>No Image</div>}
        {artists.name}
      </div>
    ))
  }

  

  const renderTracks = () => {
    var temp = 1
    return tracks.map(tracks => (  /* Need key otherwise React gives warning */
      <tr className="tableRow" key={tracks.id}> 
        <td>
          {temp++}    {/* Most listened number position */} 
        </td>
        <td>          {/* Track image */}
        {tracks.album.images.length ? <img className="image" width= {"100"} src={tracks.album.images[0].url} alt=""/> : <div>No Image</div>}
        </td>
        <td className="trackInfo"> {/*Track Info*/}
        <span style={{fontSize: "15px"}}> {tracks.name} </span> <br></br>
        
           {
            tracks.artists.map((artists, index) =>(
              <span style={{opacity: "0.5"}} key={artists.id}>
                { (index ? ', ' : '') + artists.name}
              </span>
            )
            )}          
        </td>
        
      </tr>
    ))
  
  }

 const loggerIn = () => {
  return (
  <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
  )
 }

  
  

  return (
    <div className="App">
      <header className="App-header">
          <h1>Spotify React</h1>
          {!token ?
          loggerIn()
                   
           : <button onClick={logout}>Log out</button>}

        
           {token?
           
           <div>
            <div className="wrapper">
              <div className="menu">
                <select style={{color:"#1DB954"}} id="name" defaultValue={"DEFAULT"} onChange={(e) => setTimeRange(e.target.value)}>
                  <option value="DEFAULT" disabled>Choose term</option>    
                  <option value={"short_term"}>Last 4 weeks</option>
                  <option value={"medium_term"}>Last 6 months</option>
                  <option value={"long_term"}>All time</option>
                </select>
              </div>
            </div>
            
            {/* Old button used to update list with term
            <div><button onClick={getTracks}>Get Tracks</button></div> 
            */} 
                  

                  </div>
           : <h2>Please login</h2>
           } 
           {token &&    
           
           <table>
            <thead>
            <tr className="tableRow">
              <th>
               #
              </th>
              <th>
              
              </th>
              <th className="trackInfo">
              Track
              </th>
            </tr>
            </thead>
            <tbody>
            {renderTracks()}

            </tbody>
            
            </table> 
        }
          
          
      </header>
    </div>
  );
}

export default App;
