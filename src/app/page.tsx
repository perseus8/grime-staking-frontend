/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import "@fontsource/montserrat"; // Defaults to weight 400
import "@fontsource/montserrat/400.css"; // Specify weight
import "@fontsource/montserrat/400-italic.css"; // Specify weight and style
import { useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import * as anchor from "@project-serum/anchor";
import idl from "../idl/idl.json";
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  TransactionInstruction,
  SYSVAR_RENT_PUBKEY,
  SYSVAR_CLOCK_PUBKEY,
  Keypair,
} from "@solana/web3.js";
import { AnchorProvider, Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import Loading from "@/components/Loading";
import { getDateString } from "./utils";

const opts = {
  preflightCommitment: "processed",
};
const RPC_URL = process.env.RPC_URL;
const connection = new Connection(
  RPC_URL ? RPC_URL : "https://api.devnet.solana.com",
  "confirmed"
);
const programID = new PublicKey(idl.metadata.address);
const mint = new PublicKey("3XKL3PjndTRvEGVo8iLtxFw1LJuHi4xLYMb2WD1yMFRV");
const rewardPercent: Record<number, number> = { 1: 1, 2: 5, 3: 69 };

export default function Home() {
  const { publicKey, disconnect, connected, wallet } = useWallet();
  const { connection } = useConnection();
  const [time, setTime] = useState<any>(1);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [monthData, setMonthData] = useState<any[]>([]);
  const [yearData, setYearData] = useState<any[]>([]);
  // console.log(weekData)
  useEffect(() => {
    if (connected) {
      init();
    }
  }, [wallet, connected]);

  const getProvider = () => {
    if (!publicKey) return;

    const provider = new AnchorProvider(
      connection,
      wallet?.adapter as any,
      opts.preflightCommitment as any
    );
    return provider;
  };

  const init = () => {
    getBalance();
    getUserData();
  };

  const stake = async () => {
    if (loading) return;
    if (!publicKey) return;
    if (amount <= 0) {
      toast.error("Please select right amount.");
      return;
    }
    if (amount > balance) {
      toast.error("Please select right amount.");
      return;
    }
    try {
      setLoading(true);

      const index = counts[time - 1] + 1;

      const provider = getProvider();
      const program = new Program(idl as anchor.Idl, programID, provider);

      const option = time;

      const [global, _1] = await PublicKey.findProgramAddress(
        [Buffer.from("GLOBAL_STATE_SEED")],
        program.programId
      );

      const [tokenVault, _2] = await PublicKey.findProgramAddress(
        [Buffer.from("TOKEN_VAULT_SEED")],
        program.programId
      );

      const [userData, _3] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("USER_INFO_SEED"), publicKey.toBuffer()],
        program.programId
      );

      const [userInfo, _4] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("USER_INFO_SEED"),
          publicKey.toBuffer(),
          new anchor.BN(Number(option)).toArrayLike(Buffer, "le", 1),
          new anchor.BN(Number(index)).toArrayLike(Buffer, "le", 4),
        ],
        program.programId
      );

      const userTokenAccount = await getAssociatedTokenAddress(mint, publicKey);

      const stakeAmount = BigInt(amount) * BigInt(1000000000)
      const tx = await program.rpc.stake(
        option,
        index,
        new anchor.BN(stakeAmount),
        {
          accounts: {
            user: publicKey,
            global,
            userInfo,
            userData,
            mint,
            tokenVault,
            userTokenAccount,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_PROGRAM_ID,
            clock: SYSVAR_CLOCK_PUBKEY,
          },
        }
      );
      toast.success("Successfully staked!");
      init();
      console.log("tx->", tx);
      const tempCounts = [...counts];
      tempCounts[option - 1] = index;
      setCounts(tempCounts);

      setLoading(false);
    } catch (error) {
      toast.error("Error");
      console.log(error);
      setLoading(false);
    }
  };

  const getUserStakeInfo = async (wCount: any, mCount: any, yCount: any) => {
    if (!publicKey) return;
    try {
      const provider = getProvider();
      const program = new Program(idl as anchor.Idl, programID, provider);

      const wData = [];
      for (let i = 1; i <= wCount; i++) {
        const [userInfoForWeek, _1] = await PublicKey.findProgramAddress(
          [
            Buffer.from("USER_INFO_SEED"),
            publicKey.toBuffer(),
            new anchor.BN(1).toArrayLike(Buffer, "le", 1),
            new anchor.BN(i).toArrayLike(Buffer, "le", 4),
          ],
          programID
        );
        const userInfoForWeekData = await program.account.userInfo.fetch(
          userInfoForWeek
        );
        wData.push(userInfoForWeekData);
      }
      const wfiltered = wData.filter((item) => item.status == true);
      setWeekData(wfiltered);

      const mData = [];
      for (let i = 1; i <= mCount; i++) {
        const [userInfoForMonth, _2] = await PublicKey.findProgramAddress(
          [
            Buffer.from("USER_INFO_SEED"),
            publicKey.toBuffer(),
            new anchor.BN(2).toArrayLike(Buffer, "le", 1),
            new anchor.BN(i).toArrayLike(Buffer, "le", 4),
          ],
          programID
        );
        const userInfoForMonthData = await program.account.userInfo.fetch(
          userInfoForMonth
        );
        mData.push(userInfoForMonthData);
      }
      const mfiltered = mData.filter((item) => item.status == true);
      setMonthData(mfiltered);

      const yData = [];
      for (let i = 1; i <= yCount; i++) {
        const [userInfoForYear, _3] = await PublicKey.findProgramAddress(
          [
            Buffer.from("USER_INFO_SEED"),
            publicKey.toBuffer(),
            new anchor.BN(3).toArrayLike(Buffer, "le", 1),
            new anchor.BN(i).toArrayLike(Buffer, "le", 4),
          ],
          programID
        );
        const userInfoForYeahData = await program.account.userInfo.fetch(
          userInfoForYear
        );
        yData.push(userInfoForYeahData);
      }
      const yfiltered = yData.filter((item) => item.status == true);
      setYearData(yfiltered);
      setLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Error while fetch user data");
      setLoading(false);
    }
  };

  const unstake = async (option: any, index: any, claimDate: any) => {
    if (!publicKey) return;
    try {
      // if (new Date(claimDate) > new Date()) {
      //   toast.error("Can't unstake before claim date");
      //   return;
      // }

      const provider = getProvider();
      const program = new Program(idl as anchor.Idl, programID, provider);

      const [global, _1] = await PublicKey.findProgramAddress(
        [Buffer.from("GLOBAL_STATE_SEED")],
        program.programId
      );

      const [tokenVault, _2] = await PublicKey.findProgramAddress(
        [Buffer.from("TOKEN_VAULT_SEED")],
        program.programId
      );

      const [userData, _3] = await anchor.web3.PublicKey.findProgramAddress(
        [Buffer.from("USER_INFO_SEED"), publicKey.toBuffer()],
        program.programId
      );

      const [userInfo, _4] = await anchor.web3.PublicKey.findProgramAddress(
        [
          Buffer.from("USER_INFO_SEED"),
          publicKey.toBuffer(),
          new anchor.BN(Number(option)).toArrayLike(Buffer, "le", 1),
          new anchor.BN(Number(index)).toArrayLike(Buffer, "le", 4),
        ],
        program.programId
      );

      const userTokenAccount = await getAssociatedTokenAddress(mint, publicKey);

      const tx = await program.rpc.unstake(option, index, {
        accounts: {
          user: publicKey,
          global,
          userData,
          userInfo,
          mint,
          tokenVault,
          userTokenAccount,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          clock: SYSVAR_CLOCK_PUBKEY,
        },
      });
      init();
      toast.success("Successfully unstaked!");
      console.log("tx->", tx);
    } catch (error) {
      toast.error("Error!");
      console.log(error);
    }
  };

  const getUserData = async () => {
    if (!publicKey) return;
    try {
      setLoading(true);
      const provider = getProvider();
      const program = new Program(idl as anchor.Idl, programID, provider);

      const [userDataAccount, _1] =
        await anchor.web3.PublicKey.findProgramAddress(
          [Buffer.from("USER_INFO_SEED"), publicKey.toBuffer()],
          program.programId
        );
      const userData = await program.account.userData.fetch(userDataAccount);

      const wCount = userData.weekCount;
      const mCount = userData.monthCount;
      const yCount = userData.yearCount;
      setCounts([wCount, mCount, yCount]);
      getUserStakeInfo(wCount, mCount, yCount);
    } catch (error) {
      console.log(error);
      // toast.error("Error while fetch user data");
      setLoading(false);
    }
  };
  const getBalance = async () => {
    if (!publicKey) return;
    try {
      const tokenAccount = await getAssociatedTokenAddress(mint, publicKey);
      const info = await connection.getTokenAccountBalance(tokenAccount);
      const balance = info.value.uiAmount;
      setBalance(balance ?? 0);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeAmount = (value: any) => {
    setAmount(value);
    const rewardAmount =
      Number(value) + Number((value * rewardPercent[time]) / 100);
    setRewardAmount(rewardAmount);
  };

  const handleChangeTime = (value: any) => {
    setTime(value);
    const rewardAmount =
      Number(amount) + Number((amount * rewardPercent[value]) / 100);
    setRewardAmount(rewardAmount);
  };

  return (
    <div className="w-full flex flex-col gap-10 px-20 py-10 text-white">
      <div className="w-full flex flex-row gap-10">
        <div className="w-96  bg-gradient-to-br from-back to-back3 rounded-2xl h-full shrink-0 p-10">
          <p className="text-2xl pb-4">LOCK $GRIME</p>
          <p className="p-1 text-lg">Amount (Balance: {balance})</p>
          <input
            className="bg-secondary3 w-full p-2 rounded-xl focus:outline-none"
            onChange={(e) => handleChangeAmount(e.target.value)}
            value={amount}
          />
          <p className="p-1 pt-4 text-lg">Duration</p>
          <select
            className="bg-secondary3 w-full p-2 rounded-xl focus:outline-none"
            value={time}
            onChange={(e) => {
              handleChangeTime(e.target.value);
            }}
          >
            <option value={1}>1 Week</option>
            <option value={2}>1 Month</option>
            <option value={3}>1 Year</option>
          </select>
          <p className="p-1 pt-4 text-lg">
            Rewards You Will Get {rewardPercent[time]}%
          </p>
          <input
            className="bg-secondary3 w-full p-2 rounded-xl focus:outline-none"
            value={rewardAmount}
            disabled
          />
          <div
            className="bg-secondary2 w-full p-2 rounded-xl mt-14 cursor-pointer flex items-center justify-center font-semibold"
            onClick={() => stake()}
          >
            {loading ? <Loading /> : "Lock"}
          </div>
        </div>
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-row w-full gap-10">
            <div className="w-1/2 p-4 rounded-2xl flex flex-col items-center font-semibold gap-2 bg-gradient-to-br from-secondary2 to-secondary3">
              <p className="text-3xl">256,252</p>
              <p>Total Locked</p>
            </div>
            <div className="w-1/2 p-4 rounded-2xl flex flex-col items-center font-semibold gap-2 bg-gradient-to-br from-secondary2 to-secondary3">
              <p className="text-3xl">3,444</p>
              <p>Total Rewards</p>
            </div>
            {/* <div className="w-1/3 p-4 rounded-2xl flex flex-col items-center font-semibold gap-2 bg-gradient-to-br from-secondary2 to-secondary3">
              <p className="text-3xl">444,444,444</p>
              <p>Total Locked</p>
            </div> */}
          </div>
          <div className="w-full p-10 rounded-2xl flex flex-col font-semibold gap-2 bg-gradient-to-br from-secondary2 to-secondary3">
            <p className="text-4xl py-4">How it works</p>
            <p className="text-2xl">
              Toss your GRIME into the swamp and let it fester. Your loyalty
              will be well rewarded.
            </p>
            <p>Lock for:</p>
            <li>1 Year and gain 69% more GRIME</li>
            <li>1 Month and gain 5% more GRIME</li>
            <li>1 Week and gain 1% more GRIME</li>
            {/* <p className="text-2xl">
            (T)multiplier: Multiply to the % of GRIME Rewards Pool with amount
            of time locked
          </p>
          <li>1 Month - 1X</li>
          <li>3 Months - 1.4X</li>
          <li>6 Months - 2X</li> */}
            <p>
              Example: Lock 1M GRIME in the swamp for 1 year. At 1 year you can
              unlock your 1M GRIME and claim an additional 690k GRIME.
            </p>
          </div>
        </div>
      </div>
      <table className="w-full bg-gradient-to-br from-back to-back3 rounded-2xl border-spacing-6">
        <thead>
          <tr>
            <th className="">Amount</th>
            <th className="">Staked Date</th>
            <th className="">Claim Date</th>
            <th className="">Reward %</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {weekData.map((item, index) => (
            <tr key={index}>
              <td>{Number(item.amount) / 1000000000}</td>
              <td>{getDateString(item.startTime)}</td>
              <td>
                {getDateString(
                  Number(item.startTime) + Number(60 * 60 * 24 * 7)
                )}
              </td>
              <td>{rewardPercent[1]}%</td>
              <td>
                <button
                  className="bg-secondary2 cursor-pointer py-2 px-4 rounded"
                  onClick={() =>
                    unstake(
                      1,
                      item.index,
                      (Number(item.startTime) + Number(60 * 60 * 24 * 7)) * 1000
                    )
                  }
                >
                  Unstake
                </button>
              </td>
            </tr>
          ))}
          {monthData.map((item, index) => (
            <tr key={index}>
              <td>{Number(item.amount) / 1000000000}</td>
              <td>{getDateString(item.startTime)}</td>
              <td>
                {getDateString(
                  Number(item.startTime) + Number(60 * 60 * 24 * 30)
                )}
              </td>
              <td>{rewardPercent[2]}%</td>
              <td>
                <button
                  className="bg-secondary2 cursor-pointer py-2 px-4 rounded"
                  onClick={() =>
                    unstake(
                      2,
                      item.index,
                      (Number(item.startTime) + Number(60 * 60 * 24 * 30)) *
                        1000
                    )
                  }
                >
                  Unstake
                </button>
              </td>
            </tr>
          ))}
          {yearData.map((item, index) => (
            <tr key={index}>
              <td>{Number(item.amount) / 1000000000}</td>
              <td>{getDateString(item.startTime)}</td>
              <td>
                {getDateString(
                  Number(item.startTime) + Number(60 * 60 * 24 * 365)
                )}
              </td>
              <td>{rewardPercent[3]}%</td>
              <td>
                <button
                  className="bg-secondary2 cursor-pointer py-2 px-4 rounded"
                  onClick={() =>
                    unstake(
                      3,
                      item.index,
                      (Number(item.startTime) + Number(60 * 60 * 24 * 365)) *
                        1000
                    )
                  }
                >
                  Unstake
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
