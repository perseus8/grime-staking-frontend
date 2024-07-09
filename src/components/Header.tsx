/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import React from "react";
import { ConnectWalletButton } from "./ConnectWalletButton";


const Header = () => {

  return (
    <div>
      <div className="flex z-10 md:flex-row flex-col md:items-center items-end md:py-8 py-2 md:px-16 px-2 bg-main-back justify-between">
        <Link href="/" className="z-10 md:flex flex-row items-center hidden">
          <div className="text-3xl rounded-md ml-2 px-2">
            <img
              src="/logo.png"
              alt="coin image"
              width={50}
              className="mr-1"
            ></img>
          </div>
          <div id="logoText" className="text-3xl text-white font-extrabold">
            Grime Staking
          </div>
        </Link>
        <div className="flex z-10 flex-row items-center gap-4 md:mt-4 md:m-0">
          <ConnectWalletButton />
        </div>
      </div>
    </div>
  );
};

export default Header;
