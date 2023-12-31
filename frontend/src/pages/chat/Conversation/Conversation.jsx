import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
const Conversation = ({ data, currentUser, online }) => {

  const [userData, setUserData] = useState(null)
  const dispatch = useDispatch()

  useEffect(()=> {

    const userId = data.members.find((id)=>id!==currentUser)
  }, [])
  return (
    <>
      <div className="venue conversation">
        <div>
          <div className="name" style={{fontSize: '1rem'}}>
            <span>{data.title}</span>
          </div>
        </div>
      </div>
      <hr style={{ width: "85%", border: "0.5px solid #ececec" }} />
    </>
  );
};

export default Conversation;
