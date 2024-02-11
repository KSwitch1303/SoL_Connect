import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
} from "agora-rtc-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import * as web3 from "@solana/web3.js";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import * as walletAdapterWallets from "@solana/wallet-adapter-wallets";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

require("@solana/wallet-adapter-react-ui/styles.css");

import "./styles.css";

const endpoint = web3.clusterApiUrl("devnet");
const wallets = [new walletAdapterWallets.PhantomWalletAdapter()];

export const Basics = () => {
  let base58Pubkey
  const [calling, setCalling] = useState(false);
  const isConnected = useIsConnected();
  const [appId, setAppId] = useState("618b8acbbd604f3db8fbe62f006836a7"); 
  const [channel, setChannel] = useState("main"); 
  const [token, setToken] = useState("007eJxTYLiwgWvdLtNt/240n8utKii/KSbEV3g1/0S6pOEJ00dGpl0KDGaGFkkWiclJSSlmBiZpxilJFmlJqWZGaQYGZhbGZonmR3efSG0IZGRYs2wmAyMUgvgsDLmJmXkMDACvHiEp");
  const [connected,setConnected] = useState(false)

  useJoin({appid: appId, channel: channel, token: token ? token : null}, calling);
  //local user
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);
  usePublish([localMicrophoneTrack, localCameraTrack]);
  //remote users
  const remoteUsers = useRemoteUsers();


  function Func() {
    const { publicKey, sendTransaction  } = useWallet();
    const { connection } = useConnection();
    if (publicKey != null) {
      base58Pubkey = publicKey.toBase58();
      console.log(base58Pubkey); 
      setConnected(true)
      // console.log(balance);
    }else{
      setConnected(false)
    }
    
    }
   
  return (
    <>
      <div className="room">
        {isConnected ? (
          <div className="user-list">
            <Link to="/admin"><button>ADMIN</button></Link>
            <div className="user">
              <LocalUser
                audioTrack={localMicrophoneTrack}
                cameraOn={cameraOn}
                micOn={micOn}
                videoTrack={localCameraTrack}
                cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg"
              >
                <samp className="user-name">YOU</samp>
              </LocalUser>
            </div>
            {remoteUsers.map((user) => (
              <div className="user" key={user.uid}>
                <RemoteUser cover="https://www.agora.io/en/wp-content/uploads/2022/10/3d-spatial-audio-icon.svg" user={user}>
                  <samp className="user-name">{user.uid}</samp>
                </RemoteUser>
              </div>
            ))}
          </div>
        ) : (
          <div className="join-room">
            <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
              <WalletModalProvider>
                <WalletMultiButton />
                <Func />
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
          {connected && (
            <div>
              <input
              onChange={e => setAppId(e.target.value)}
              placeholder="<Your app ID>"
              value={appId}
            />
            <input
              onChange={e => setChannel(e.target.value)}
              placeholder="<Your channel Name>"
              value={channel}
            />
            <input
              onChange={e => setToken(e.target.value)}
              placeholder="<Your token>"
              value={token}
            />

            <button
              className={`join-channel ${!appId || !channel ? "disabled" : ""}`}
              disabled={!appId || !channel}
              onClick={() => setCalling(true)}
            >
              <span>Join Channel</span>
            </button>
            </div>
          )}
            
          </div>
        )}
      </div>
      {isConnected && (
        <div className="control">
          <div className="left-control">
            <button className="btn" onClick={() => setMic(a => !a)}>
              <i className={`i-microphone ${!micOn ? "off" : ""}`} />
            </button>
            <button className="btn" onClick={() => setCamera(a => !a)}>
              <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
            </button>
          </div>
          <button
            className={`btn btn-phone ${calling ? "btn-phone-active" : ""}`}
            onClick={() => setCalling(a => !a)}
          >
            {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
          </button>
        </div>
      )}
    </>
  );
};

export default Basics;
