
import bscSymbol from '../../assets/home-img/bsc-symbol.svg';
import logo from '../../assets/logo-png.png';
import { RightArrow } from '../../assets/svg/svg';
import '../../assets/css/home.css';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    BrowserView,
    MobileView,
} from "react-device-detect";
function Home() {
    const isDark = useSelector((state) => state.Token.isDark);

    return (
        <div>

            {/* <div>
                <div id="top-notification">
                    <div className="w-full relative left-0 top-16 bg-success-bright dark:bg-opacity-20 dark:text-success-bright text-white flex place-content-center px-4 py-2">
                        <div className="flex flex-row items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="border-current flex-shrink-0 h-5 w-5">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                            </svg>
                            <span className="text-sm font-sans">
                                <p>Limit Orders &amp; Stop Losses now available on Avalanche!</p>
                            </span>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Main */}
            <main className=" h-full mt-16 z-10">
                <div className="mx-auto container px-2 py-2 xs:px-4 xs:py-4 sm:py-6 sm:px-8">
                    <div>
                        <div className="flex w-full">
                            <div className="flex md:space-y-0 space-y-4 space-x-0 md:space-x-4 md:space-x-0 md:flex-row flex-col w-full">
                                <Link to="/chart" className="w-full md:w-1/2 hover:-translate-y-1 duration-500 ease-in-out transform transition-transform hover:bg-gray-800 dark:hover:bg-primary-dark h-16 sm:h-24 flex items-center px-5 py-6 shadow-sm rounded-xl bg-gray-900 dark:bg-primary dark:text-gray-900 text-white justify-between">
                                    <div className="mx-5">
                                        <h4 className="overline sm:text-lg">TRANSHUMAN COIN Trade History</h4>
                                    </div>
                                    <RightArrow />
                                </Link>
                                <Link to="/track" className="w-full md:w-1/2 hover:-translate-y-1 duration-500 ease-in-out transform transition-transform hover:bg-gray-800 dark:hover:bg-primary-dark h-16 sm:h-24 flex items-center px-5 py-6 shadow-sm rounded-xl bg-gray-900 dark:bg-primary dark:text-gray-900 text-white justify-between">
                                    <div className="mx-5">
                                        <h4 className="overline sm:text-lg">Information of tokens in Blockchain World</h4>
                                    </div>
                                    <RightArrow />
                                </Link>
                            </div>
                        </div>

                        <div className="flex w-full mt-4">
                            <div className="flex xl:flex-row flex-col w-full xl:space-x-4 xl:space-y-0 space-y-4">
                                <div className="p-6 shadow-smooth rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                    <div className='justify mobile-flex-column'>
                                        <div className='flex2'>
                                            <h2 className="mb-5 dark:text-white">Welcome to Valid.finance</h2>
                                            <h3 className="leading-relaxed mb-2 text-primary-dark dark:text-primary"> Valid.finance is a set of tools to make<br /> you a better DeFi trader. </h3>
                                        </div>
                                        <div className='flex1 p1'>
                                            <img src={logo} alt=''></img>
                                        </div>
                                    </div>
                                    {/* <p className="leading-relaxed text-gray-800 dark:text-gray-300 pb-3 "> Use BogSwap, our multi-chain DEX aggregator, to trade tokens from 20+ DEXes across Binance Smart Chain, Polygon, Cronos, Fantom, and Avalanche. </p>
                                    <p className="leading-relaxed text-gray-800 dark:text-gray-300 pb-3 "> Place Limit Orders and Stop Losses on your Pancakeswap and Apeswap tokens - coming soon to all DEXes and chains. </p> */}
                                </div>
                                <div className="flex md:flex-col md:space-y-4">
                                    <div className="w-full shadow-smooth rounded-lg bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-white h10">
                                        <div className="flex p-4 space-y-3 flex-col justify-between"><span className="flex-none overline text-primary-dark dark:text-primary"> Next feature unlocked in</span>
                                            <h4 className="text-gray-800 text-xs md:text-base w-full dark:text-white flex flex-row items-center"> Premium Features: </h4>
                                            <h5 className="text-gray-500 text-sm dark:text-gray-200"> Hold or Stake TRANSHUMAN COIN to unlock advanced features on TRANSHUMAN COIN Voting and Valid.Finance </h5></div>
                                        <div>
                                            <div className="flex flex-row items-center space-x-4 border-t border-gray-200 dark:hover:bg-gray-700 dark:hover:bg-opacity-40 dark:border-gray-700 py-4 px-4 transition-all duration-300 hover:bg-gray-200 hover:bg-opacity-30">
                                                <div className="flex justify-between flex-col">
                                                    <div className="flex flex-row items-center">
                                                        <h6 className="mr-2 font-semibold dark:text-secondary text-primary-dark"> Connect Wallet </h6></div>
                                                    <p className="font-heading text-sm text-gray-600 dark:text-gray-200 mt-1"> Connect your wallet. </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
export default Home;