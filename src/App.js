import { useEffect, useState } from 'react';
import './App.css';
import useAuthentication from './services/Auth';
import fetchData from './services/Api';
import TableItem from './components/TableItem';

function App() {

  const { token, loginUrl, logout } = useAuthentication();

  const [tracks, setTracks] = useState([]);
  const [timeRange, setTimeRange] = useState("")

  const handleFetchData = async () => {
    try {
      const data = await fetchData(token,timeRange);
      setTracks(data);
    } catch (error) {
      // Handle errors if necessary
      console.error("Error fetching dataa:", error);
    }
  };


  useEffect( ()=> {
    if(token){
      console.log("getting and setting tracks")
      handleFetchData()
      console.log("getting and setting tracks done")
      console.log(tracks)
  }
  }, [timeRange]);

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ color: "#1DB954" }}>Spotify React</h1>
        {!token ? (
          <a href={loginUrl}>Login to Spotify</a>
        ) : (
          <button className='btn' onClick={logout}>Logout</button>
        )}

      </header>

      <div className='App-body'>
        {token &&

          <div className="wrapper">
            <div className="menu">
              <select style={{ color: "#1DB954" }} id="name" defaultValue={"DEFAULT"} onChange={(e) => setTimeRange(e.target.value)}>
                <option value="DEFAULT" disabled>Choose term</option>
                <option value={"short_term"}>Last 4 weeks</option>
                <option value={"medium_term"}>Last 6 months</option>
                <option value={"long_term"}>All time</option>
              </select>
            </div>
          </div>


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
              <TableItem key={timeRange} tracks={tracks}/>


            </tbody>

          </table>

        }


      </div>

    </div>
  );
}

export default App;
