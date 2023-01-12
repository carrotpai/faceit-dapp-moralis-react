import { useEffect } from "react";

 const PlayerInfo = ({name, wallet, rating}) =>{
    useEffect(() => {
        document.getElementsByClassName("playerName")[0].innerHTML = "Name: " + name;
        document.getElementsByClassName("playerWallet")[0].innerHTML = "Your cash: " + wallet;
        document.getElementsByClassName("playerRating")[0].innerHTML = "Your rating: " + rating;
    })

    return(
        <div className="playerInfo">
            <img src="qm.png" alt="NO IMAGE AVAILABLE" className="playerIcon"></img>
            <div className="playerDataBlock">
                <div className="playerData playerName"></div>
                <div className="playerData playerWallet"></div>
                <div className="playerData playerRating"></div>
            </div>
        </div>
    )
}

export default PlayerInfo;