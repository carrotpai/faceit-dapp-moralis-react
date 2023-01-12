import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

const ModalWindow = ({show, onClose, onSubmit} : {show:boolean, onClose:any, onSubmit:any}) => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    const handleCloseClick = (e:any) => {
        e.preventDefault();
        onClose();
      };
    
    function authFunc() {
        console.log("ti huy");
        onSubmit();
    }

    const content = show ? (
        <div className="modalWindow">
            <button className=" customButton closeButton" onClick={handleCloseClick}>X</button>
            <input type={"text"} className="inputForm modalWindowForm" placeholder="Login"></input>
            <input type={"password"} className="inputForm modalWindowForm" placeholder="Password"></input>
            <div className="buttons">
                <button className="customButton acceptButton" onClick={() => authFunc()}>Submit</button>
                <button className="customButton cancelButton" onClick={handleCloseClick}>Cancel</button>
            </div>
        </div>
    ) : null;

    if (isBrowser) {
        return (
            content
        );
    } else {
        return null;
    }

}

export default ModalWindow;