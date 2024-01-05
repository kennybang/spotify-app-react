import React, { useEffect } from 'react';
import './index.css';

const TableItem = ({ tracks }) => {
    var temp = 1;

    useEffect(() => {
        // Perform any side effects or updates when tracks or timeRange changes
        console.log('TableItem: tracks or timeRange changed');
    }, [tracks]);

    return (
        <>
            {tracks.map((track) => (
                <tr className="tableRow" key={track.id}>
                    <td>{temp++}</td>
                    <td>
                        {track.album.images.length ? (
                            <img className="image" width={"100"} src={track.album.images[0].url} alt="" />
                        ) : (
                            <div>No Image</div>
                        )}
                    </td>
                    <td className="trackInfo">
                        <span style={{ fontSize: "15px" }}>{track.name}</span>
                        <br />
                        {track.artists.map((artist, index) => (
                            <span style={{ opacity: "0.5" }} key={artist.id}>
                                {(index ? ', ' : '') + artist.name}
                            </span>
                        ))}
                    </td>
                </tr>
            ))}
        </>
    );
};

export default TableItem;
