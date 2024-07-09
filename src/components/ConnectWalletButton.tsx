/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCircleMinus,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const ConnectWalletButton = () => {
  const { publicKey, disconnect, connected } = useWallet();

  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState({
    position: "relative",
    top: 0,
    right: 0,
  });

  const handleClickOpen = () => {
    setOpen(true)
    setStyle({
      position: "absolute",
      top: 110,
      right: 70,
    });
  };

  const handleDisconnect = () => {
    disconnect();
    // removeSessionCookie();
    handleClose();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyAddress = () => {
    console.log("Handle copy address")
  };

  const pubkey = publicKey && publicKey.toBase58();
  const updatedPubkey =
    pubkey?.substring(0, 3) +
    "..." +
    pubkey?.substring(pubkey.length - 3, pubkey.length);

  return (    
    <div className=" float-right"> 
      <div className="flex flex-col w-fit md:text-lg justify-center items-center gap-2">
        <div className="space-x-2">
          {connected ? (
            publicKey ? (
              <>
                <div className="rounded-md bg-back text-base inline-block">
                  <button
                    id="profileButton"
                    className="wallet-adapter-button"
                    onClick={() => handleClickOpen()}
                  >
                    {updatedPubkey}
                  </button>
                </div>
                <BootstrapDialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                  PaperProps={{ sx: { borderRadius: "24px" } }}
                >
                  <DialogContent
                    style={{
                      position: "fixed",
                      background: "white",
                      right: style.right,
                      top: style.top,
                    }}
                    className="rounded-2xl"
                  >
                    <div className="flex flex-col">
                      <ul className="list-group">
                        <li
                          className="list-group-item d-flex p-2 cursor-pointer text-black font-bold"
                          onClick={() => handleCopyAddress()}
                        >
                          <FontAwesomeIcon icon={faUser} className="pr-3" />{" "}
                          Copy Address
                        </li>
                        <li
                          className="list-group-item d-flex p-2 cursor-pointer text-black font-bold"
                          onClick={() => handleDisconnect()}
                        >
                          <FontAwesomeIcon
                            icon={faCircleMinus}
                            className="pr-3"
                          />
                          Disconnect Wallet
                        </li>
                      </ul>
                    </div>
                  </DialogContent>
                </BootstrapDialog>
              </>
            ) : (
              <div className="rounded-md bg-back text-base inline-block">
                <WalletMultiButtonDynamic />
              </div>
            )
          ) : (
            <div className="rounded-md bg-back text-base inline-block">
              <WalletMultiButtonDynamic />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
