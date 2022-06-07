import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import { Button } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMetaMask } from "metamask-react";
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import MetaMaskOnboarding from '@metamask/onboarding';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from 'ethers';
import {
    BrowserView,
    MobileView,
} from "react-device-detect";

import { SetTokenName, SetIsConnect, SetNetwork, SetMinSiderBar, SetIsDark, SetIsTokenSearchBar, SetBalanceOfTranshumanToken, SetNoneSidebar } from '../../store/Token';
import '../../assets/css/header.css';
import bscSymbol from '../../assets/home-img/bsc-symbol.svg';
import THCToken from '../../assets/home-img/thc.png';
import logo from '../../assets/logo-png.png';
import { ScanSvg, CopyAddressSvg } from '../../assets/svg/svg';
import { transhumantokenContract } from "../../contract";
import { toBigNum, fromBigNum } from "../../need";


const forwarderOrigin = 'http://localhost:3000';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}));

const NoNeedNetwork = (props) => {
    return (
        <>
            <div className='fixed h-full w-full flex justify-center items-center p-4 bottom-10 sm:bottom-20 z-20'>
                <div className="top-0 fixed z-20 w-full left-0 h-full bg-gray-900 bg-opacity-60" style={{ backdropFilter: 'blur(1.2px)' }}></div>

                <div className="lg:left-50-256 w-full flex flex-col dark:bg-gray-800 bg-white rounded-2xl overflow-hidden z-40 border border-white dark:border-gray-600" style={{ maxWidth: '700px' }}>
                    <div className="px-6 py-4 border-b dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 flex flex-row justify-between items-center">
                        <h4 className="mauto dark:text-white text-gray-800 mb-2 mt-2">Not Binance Smart Chain Network</h4>
                    </div>
                    {/* <div className="px-6 py-6 w-full overflow-y-auto max-h-96 dark:text-white text-gray-600">
                        <div className="flex items-start flex-col">
                            <h4 className="dark:text-white pt-3 font-semibold md:hidden block">{'props.accountStyled'}</h4>
                        </div>
                    </div> */}
                    <div className="tc flex flex-col p-4 dark:text-gray-100 text-gray-600">
                        This product is not yet supported on not Binance
                    </div>
                    <div className="w-full overflow-y-auto max-h-96 dark:text-white text-gray-600">
                        <div className="px-6 py-4">
                            <button onClick={props.changeNetwork} className="m-auto flex hover:bg-opacity-100 hover:text-white rounded-lg py-3 px-4 bg-error-bright bg-opacity-20 text-error-bright text-white border border-error-bright transition-colors duration-200 ease-in-out"> Network Change as BSC </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function Header() {

    const isDark = useSelector((state) => state.Token.isDark);
    const isConnect = useSelector((state) => state.Token.isConnect);
    const dispatch = useDispatch();

    const [networkChangeBtn, setNetworkChangeBtn] = useState(false);
    const [networkDisplay, setNetworkDisplay] = useState('BSC Network');
    const [isBSC, setIsBSC] = useState(false);

    const noneSidebar = useSelector((state) => state.Token.noneSidebar);
    const minSidebar = useSelector((state) => state.Token.minSidebar);
    const isTokenSearchBar = useSelector((state) => state.Token.isTokenSearchBar);
    const THCtokenBalance = useSelector((state) => state.Token.balanceOfTranshumanToken);

    const [walletInfoModal, setWalletInfoModal] = useState(false);
    const [accountStyled, setAccountStyled] = useState('');
    const [balanceOfBNB, setBalanceOfBNB] = useState('');

    const { status, connect, account } = useMetaMask();
    const [searchValue, setSearchValue] = useState('0x56083560594e314b5cdd1680ec6a493bb851bbd8');//transhuman coin address
    const [tokenData, setTokenData] = useState([]);
    const [age, setAge] = useState('bsc');

    useEffect(() => {
        dispatch(SetIsDark(true));
        window.document.body.classList.add('dark');
    }, [])
    const handleClickAway = () => {
        setOpen(false);
    };

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const isMetaMaskInstalled = () => {
        const ether = window.ethereum;
        return Boolean(ether && ether.isMetaMask);
    };
    const MetamaskInstall = () => {
        const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
        const _MetamaskInstall = () => {
            onboarding.startOnboarding();
        };
        _MetamaskInstall();
    }

    const fetchData = async () => {
        try {
            if (searchValue !== '') {
                const res = await axios.get(`https://api.dex.guru/v2/tokens/search/${searchValue}?network=bsc,eth,polygon,fantom,avalanche`)
                console.log('Header data call : ', res.data);
                if (res.data.total !== 0) {
                    setTokenData(res.data.data);
                    if (res.data.total === 1) {
                        dispatch(SetNetwork(res.data.data[0]));
                    }
                } else {
                    setTokenData();
                }

            } else {
                setTokenData();
            }
        } catch (error) {
            console.log(error)
        }
    }
    const setSearchValue_function = (value) => {
        setSearchValue(value);
        fetchData()
    }
    useEffect(() => {
        fetchData();
    }, [])

    const handleChange = (event) => {

        dispatch(SetTokenName(event.target.value));
        setAge(event.target.value);
        if (event.target.value === 'eth') {
            setSearchValue('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
        } else if (event.target.value === 'avalanche') {
            setSearchValue('0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7')
        } else if (event.target.value === 'bsc') {
            setSearchValue('0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
        } else if (event.target.value === 'fantom') {
            setSearchValue('0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83')
        } else if (event.target.value === 'polygon') {
            setSearchValue('0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270')
        }
    };
    const metamaskConnectClick = async () => {
        if (isConnect === true && status === 'connected') {
            setWalletInfoModal(true);
        } else {
            await connect();
            MetaMask_Connect()
        }
    }
    const MetaMask_Connect = () => {
        if (!isMetaMaskInstalled()) {
            return (
                <button className="dark:hover:bg-opacity-100 focus:outline-none hover:text-primary dark:hover:text-primary-xtra_dark rounded-lg py-2 px-2 lg:py-3 lg:px-4 dark:bg-primary bg-gray-900 hover:bg-gray-800 dark:bg-opacity-20 text-white dark:text-primary border-gray-900 border dark:border-primary transition-colors duration-200 ease-in-out" style={{ height: '42px' }} onClick={MetamaskInstall}>
                    <span className="lg:block hidden bold">
                        Install
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block fill-current lg:hidden">
                        <path opacity="0.35" d="M18 21H6C4.343 21 3 19.657 3 18V6H18C19.657 6 21 7.343 21 9V18C21 19.657 19.657 21 18 21Z"></path>
                        <path d="M17.5 15C18.3284 15 19 14.3284 19 13.5C19 12.6716 18.3284 12 17.5 12C16.6716 12 16 12.6716 16 13.5C16 14.3284 16.6716 15 17.5 15Z"></path>
                        <path d="M3 6C3 4.343 4.343 3 6 3H15C16.657 3 18 4.343 18 6H3Z"></path>
                    </svg>
                    <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </button>
            )
        }
        if (status === "notConnected" || isConnect === false) {
            return (
                <button className="dark:hover:bg-opacity-100 focus:outline-none hover:text-primary dark:hover:text-primary-xtra_dark rounded-lg py-2 px-2 lg:py-3 lg:px-4 dark:bg-primary bg-gray-900 hover:bg-gray-800 dark:bg-opacity-20 text-white dark:text-primary border-gray-900 border dark:border-primary transition-colors duration-200 ease-in-out" style={{ height: '42px' }} onClick={metamaskConnectClick}>
                    <span className="lg:block hidden bold">
                        Connect
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block fill-current lg:hidden">
                        <path opacity="0.35" d="M18 21H6C4.343 21 3 19.657 3 18V6H18C19.657 6 21 7.343 21 9V18C21 19.657 19.657 21 18 21Z"></path>
                        <path d="M17.5 15C18.3284 15 19 14.3284 19 13.5C19 12.6716 18.3284 12 17.5 12C16.6716 12 16 12.6716 16 13.5C16 14.3284 16.6716 15 17.5 15Z"></path>
                        <path d="M3 6C3 4.343 4.343 3 6 3H15C16.657 3 18 4.343 18 6H3Z"></path>
                    </svg>
                    <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </button>
            )
        }
        let decision = '';
        if (status === "initializing") decision = 'Synchronisation with MetaMask ongoing...';

        if (status === "unavailable") decision = 'MetaMask not available';

        if (status === "connecting") decision = 'Connecting ...';

        if (status === "connected") {
            return (
                <button className="dark:hover:bg-opacity-100 focus:outline-none hover:text-primary dark:hover:text-primary-xtra_dark rounded-lg py-2 px-2 lg:py-3 lg:px-4 dark:bg-primary bg-gray-900 hover:bg-gray-800 dark:bg-opacity-20 text-white dark:text-primary border-gray-900 border dark:border-primary transition-colors duration-200 ease-in-out" style={{ height: '42px' }} onClick={metamaskConnectClick} >
                    <span className="lg:block hidden bold">
                        {decision = account.slice(0, 6) + '...' + account.slice(account.length - 4)}
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block fill-current lg:hidden">
                        <path opacity="0.35" d="M18 21H6C4.343 21 3 19.657 3 18V6H18C19.657 6 21 7.343 21 9V18C21 19.657 19.657 21 18 21Z"></path>
                        <path d="M17.5 15C18.3284 15 19 14.3284 19 13.5C19 12.6716 18.3284 12 17.5 12C16.6716 12 16 12.6716 16 13.5C16 14.3284 16.6716 15 17.5 15Z"></path>
                        <path d="M3 6C3 4.343 4.343 3 6 3H15C16.657 3 18 4.343 18 6H3Z"></path>
                    </svg>
                    <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </button>
            )

        }

        return (
            <button className="dark:hover:bg-opacity-100 focus:outline-none hover:text-primary dark:hover:text-primary-xtra_dark rounded-lg py-2 px-2 lg:py-3 lg:px-4 dark:bg-primary bg-gray-900 hover:bg-gray-800 dark:bg-opacity-20 text-white dark:text-primary border-gray-900 border dark:border-primary transition-colors duration-200 ease-in-out" style={{ height: '42px' }} >
                <span className="lg:block hidden bold">
                    {decision}
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block fill-current lg:hidden">
                    <path opacity="0.35" d="M18 21H6C4.343 21 3 19.657 3 18V6H18C19.657 6 21 7.343 21 9V18C21 19.657 19.657 21 18 21Z"></path>
                    <path d="M17.5 15C18.3284 15 19 14.3284 19 13.5C19 12.6716 18.3284 12 17.5 12C16.6716 12 16 12.6716 16 13.5C16 14.3284 16.6716 15 17.5 15Z"></path>
                    <path d="M3 6C3 4.343 4.343 3 6 3H15C16.657 3 18 4.343 18 6H3Z"></path>
                </svg>
                <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
            </button>
        )
    }

    const SelectList = (token) => {
        console.log(token, 8989)
        setSearchValue(token.address);
        dispatch(SetNetwork(token));
        setOpen(false);
    }
    const getBalance = async () => {
        try {
            if (status === "connected") {
                var provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                var MyContract = transhumantokenContract.connect(signer);
                let balance = await MyContract.balanceOf(account);
                let bigBal = fromBigNum(balance, 9);
                console.log(bigBal)
                dispatch(SetBalanceOfTranshumanToken(bigBal.toFixed(2)));
                // return fromBigNum(balance, 9);

            } else if (status === "notConnected") {
                // return "0";
                dispatch(SetBalanceOfTranshumanToken(0));
                toast('Please Wallet Connect', {
                    icon: '🔊 ',
                });
            }
        } catch (err) {
            console.log("context : getBalance error", err);
            // toast.error("context : getBalance error", err);
            // return 0;
        }
    }
    useEffect(() => {
        if (status === 'connected') {
            dispatch(SetIsConnect(true));
        }

        getBalance();
    }, [account])
    // *************

    const WalletInfo = (props) => {
        return (
            <div className='fixed h-full w-full flex justify-center items-center p-4 bottom-10 sm:bottom-20 z-20'>
                <div onClick={() => props.setWalletInfoModal(false)} className="top-0 fixed z-20 w-full left-0 h-full bg-gray-900 bg-opacity-60" style={{ backdropFilter: 'blur(1.2px)' }}></div>

                <div className="lg:left-50-256 w-full flex flex-col dark:bg-gray-800 bg-white rounded-2xl overflow-hidden z-40 border border-white dark:border-gray-600" style={{ maxWidth: '700px' }}>
                    <div className="px-6 py-4 border-b dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 flex flex-row justify-between items-center">
                        <h4 className="dark:text-white text-gray-800 mb-2 mt-2">Your Wallet</h4>
                        <div className="flex flex-row">
                            <a onClick={() => props.setWalletInfoModal(false)} href className="dark:text-primary text-gray-400 hover:bg-gray-300 cursor-pointer rounded-full dark:hover:bg-primary p-1 hover:bg-opacity-20 dark:hover:bg-opacity-20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div className="px-6 py-6 w-full overflow-y-auto max-h-96 dark:text-white text-gray-600">
                        <div className="flex items-start flex-col">
                            <h4 className="dark:text-white text-gray-700 pt-3 font-semibold md:block">
                                {props.account}
                            </h4>
                            <h4 className="dark:text-white pt-3 font-semibold md:hidden block">{props.accountStyled}</h4>
                            <div className="flex flex-row mt-4">
                                <a href={`https://bscscan.com/address/${props.account}`} target="_blank" className="items-center mr-3 flex hover:underline caption rounded-lg text-primary-dark dark:text-primary"> BscScan
                                    <ScanSvg />
                                </a>
                                {/* <a className="mr-3 hover:underline caption rounded-lg text-primary-dark dark:text-primary cursor-pointer">
                                        <span className="flex items-center"> Copy Address
                                            <CopyAddressSvg />
                                        </span>
                                    </a> */}
                            </div>
                        </div>
                    </div>
                    <div className="mx-4 my-4 font-heading text-sm flex justify-between border dark:border-primary border-primary-dark dark:border-opacity-40 border-opacity-40 bg-primary bg-opacity-5 bg-white rounded-md overflow-hidden">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-col">
                                <div className="w-full">
                                    <div className="flex flex-col p-4 dark:text-gray-100 text-gray-600">
                                        {/* <span className="caption rounded-md dark:text-primary text-primary-dark px-2 py-1 bg-primary bg-opacity-20 place-self-start mb-2">Balances &amp; Stakes</span> */}
                                        {/* <span className="text-sm"> BNB Balance: {props.balanceOfBNB / 1000000000000000000} </span> */}
                                        <span className="text-sm"> THC Balance: {THCtokenBalance} </span>
                                        {/* <span className="text-sm"> ETH Balance: {props.balanceOfETH} </span>
                                    <span className="text-sm"> Transhuman Balance: {props.balanceOfTHC} THC </span> */}
                                        {/* <span className="text-sm"> Tool access level: 0 </span> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full overflow-y-auto max-h-96 dark:text-white text-gray-600">
                        <div className="px-6 py-4">
                            <button onClick={() => { props.MetamaskModalClose() }} className="m-auto flex hover:bg-opacity-100 hover:text-white rounded-lg py-3 px-4 bg-error-bright bg-opacity-20 text-error-bright text-white border border-error-bright transition-colors duration-200 ease-in-out"> Disconnect </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Navigate monitor
    let location = useLocation();
    const [isChart, setIsChart] = useState(false);
    useEffect(() => {
        if (location.pathname === '/chart') {
            dispatch(SetIsTokenSearchBar(true));
            setIsChart(true);
        } else {
            dispatch(SetIsTokenSearchBar(false));
            setIsChart(false);
        }
    }, [location])

    const MetamaskModalClose = () => {
        setWalletInfoModal(false);
        dispatch(SetIsConnect(false));
        MetaMask_Connect();
    }

    // Dark Switch
    const darkSwitch = () => {
        if (window.document.body.classList.value === 'dark') {
            window.document.body.classList.remove('dark');
            window.document.body.classList.add('light');
            dispatch(SetIsDark(false));
        } else {
            window.document.body.classList.remove('light');
            window.document.body.classList.add('dark');
            dispatch(SetIsDark(true));
        }
    }

    useEffect(() => {
        if (window.innerWidth < 567) {
            dispatch(SetNoneSidebar(true));
        }

    }, [window.innerWidth]);

    const minSidebarFunc = () => {
        if (window.innerWidth > 1200) {
            dispatch(SetNoneSidebar(false));
            dispatch(SetMinSiderBar(!minSidebar));
        } else {
            dispatch(SetMinSiderBar(false));
            dispatch(SetNoneSidebar(!noneSidebar));
        }
    }


    // Network
    const NetworkCheck = () => {
        // if (window.ethereum.chainId !== '0x38') {
        //     setIsBSC(false);
        // } else {
        //     setIsBSC(true)
        // }
    }
    // useEffect(() => {
    //     NetworkCheck();
    // }, [window.ethereum.chainId])
    const [IsTimeout, setIsTimeout] = useState();

    const networkSelect = (networkName) => {
        setNetworkDisplay(networkName);
        setNetworkChangeBtn(false)
    }
    const changeNetwork = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0x38' }],
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    return (
        <header className="h-16 flex justify-between items-center py-1 md:pl-0 pl-0 pr-4 border-b dark:border-gray-700 border-gray-200 dark:bg-gray-800 bg-white">
            <div className="flex items-center w-auto lg:w-4/12">
                <div onClick={() => minSidebarFunc()} className="hover:text-opacity-70 duration-300 text-primary cursor-pointer transition-all w-16 h-16 flex items-center xl:border-r dark:border-gray-700 place-content-center focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" className="fill-current">
                        <path d="M2 5v2h20V5H2zm0 6v2h20v-2H2zm0 6v2h20v-2H2z"></path>
                    </svg>
                </div>
                {/* className = hidden-logo */}
                <Link to="/" aria-current="page" className="hidden lg:block ml-4 router-link-exact-active router-link-active" aria-hidden="true">
                    <img src={logo} style={{ width: '60px', height: '45px' }} alt=''></img>
                </Link>
            </div>

            <div id="tokenSearch" className={`${isTokenSearchBar === true ? '' : 'dis-n'} xl:relative h-full xl:w-full lg:w-4/12`} >
                <ClickAwayListener
                    mouseEvent="onMouseDown"
                    touchEvent="onTouchStart"
                    onClickAway={handleClickAway}
                >
                    <Search className='search-part'>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                            value={searchValue}
                            onClick={handleClick}
                            className='token-search-bar'
                            onChange={event => setSearchValue_function(event.target.value)}
                        />
                        {open ? (
                            <Box className='token-display'>
                                <List
                                    className="token-search-input"
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                    subheader={
                                        tokenData ?
                                            <></>
                                            :
                                            <ListSubheader component="div" id="nested-list-subheader">
                                                no result
                                            </ListSubheader>
                                    }
                                >
                                    {
                                        tokenData && tokenData.length > 0 ?
                                            tokenData.map((token, i) => {
                                                let defaultPath = './assets/logo.jpg';
                                                return (
                                                    <ListItemButton key={i} onClick={() => { SelectList(token) }}>
                                                        <ListItemIcon>
                                                            <img alt='img' src={token.logoURI ? token.logoURI : defaultPath} style={{ borderRadius: '50%', width: '30px' }} />
                                                        </ListItemIcon>
                                                        <div style={{ display: 'grid' }}>
                                                            <ListItemText primary={`Name : ${token.name}`} style={{ fontFamily: 'Pancake' }} />
                                                            <ListItemText primary={`Symbol : ${token.symbol}`} style={{ fontFamily: 'Pancake' }} />
                                                            <ListItemText primary={`Network : ${token.network}`} style={{ fontFamily: 'Pancake' }} />
                                                            <ListItemText primary={`Address : ${token.address.substr(0, 6)}...${token.address.substr(-6)}`} style={{ fontFamily: 'Pancake' }} />
                                                        </div>
                                                    </ListItemButton>
                                                )
                                            })
                                            :
                                            <></>
                                    }
                                </List>
                            </Box>
                        ) : null}
                    </Search>
                </ClickAwayListener>
                {/* </div> */}
                {/* <div className="xl:justify-start justify-end ml-3 items-center xl:hidden h-full flex mx-auto" > </div> */}

            </div>

            <div className="flex items-center space-x-4 w-auto xl:w-4/12 lg:min-w-75 justify-end">
                {/* <div className="hidden flex-row items-center xl:flex">
                        <img style={{ width: '30px', height: '30px' }} src={THCToken} alt='' />
                        <a className="ml1 mr1 dark:text-primary text-gray-700 caption cursor-pointer">
                            <span style={{ fontSize: '18px' }}>
                                {THCtokenBalance}
                            </span>
                        </a>
                    </div> */}
                <button onClick={() => { darkSwitch() }} aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-gray-300 dark:text-primary hover:opacity-70 transition-colors duration-200">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                </button>
                <div className={`${isChart ? 'dis-n-mobile' : ''} mr-3`}>
                    <span className='po-re'>
                        {/*   onClick={() => setNetworkChangeBtn(!networkChangeBtn)} */}
                        <button onClick={() => changeNetwork()} type="button" className={`flex flex-row items-center overflow-hidden transition-colors duration-300 font-heading text-sm rounded-lg cursor-pointer`}>
                            <div className="flex flex-row items-center space-x-3 py-2 px-2.5 bg-primary hover:bg-opacity-30 bg-opacity-20 text-primary-dark dark:text-primary">
                                <img src={bscSymbol} alt="BSC" className="w-6 h-6" />
                                <span className="hidden md:block">{networkDisplay}</span>
                                {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg> */}
                            </div>
                        </button>
                        <span className="po-ab" style={{ display: networkChangeBtn ? '' : 'none' }}>
                            <div className="fade-in text-gray-200 bg-gray-900 mt-2 left-0 rounded-md overflow-hidden text-base z-50 list-none text-left flex flex-col">
                                {/* <button onClick={() => { networkSelect('BSC') }} className="overline px-5 py-2 hover:bg-gray-700 hover:text-primary transition-colors flex flex-row"> BSC Network</button> */}
                                {/* <button onClick={() => { networkSelect('Ethereum') }} className="overline px-5 py-2 hover:bg-gray-700 hover:text-primary transition-colors flex flex-row"> Ethereum </button> */}
                            </div>
                        </span>
                    </span>

                    {/* <FormControl style={{ width: '100%' }}>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={age}
                                onChange={handleChange}
                                className='flex flex-row items-center bg-primary hover:bg-opacity-30 bg-opacity-20 text-primary-dark dark:text-primary network-select'
                            >
                                <MenuItem value={'eth'}>
                                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Pancake' }}>
                                        <img alt='token' src='./assets/ethereum.svg' style={{
                                            width: '30px', height: '30px', marginRight: '5px', borderRadius: '15px'
                                        }} />
                                        Ethereum
                                    </div>
                                </MenuItem>
                                <MenuItem value={'bsc'}>
                                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Pancake' }}>
                                        <img alt='token' src='./assets/binance.jpg' style={{
                                            width: '30px', height: '30px', marginRight: '5px', borderRadius: '15px'
                                        }} />
                                        Binance
                                    </div>
                                </MenuItem>
                                <MenuItem value={'polygon'}>
                                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Pancake' }}>
                                        <img alt='token' src='./assets/polygonscan.svg' style={{
                                            width: '30px', height: '30px', marginRight: '5px', borderRadius: '15px'
                                        }} />
                                        Polygon
                                    </div>
                                </MenuItem>
                                <MenuItem value={'fantom'}>
                                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Pancake' }}>
                                        <img alt='token' src='./assets/fantom.png' style={{
                                            width: '30px', height: '30px', marginRight: '5px', borderRadius: '15px'
                                        }} />
                                        Fantom
                                    </div>
                                </MenuItem>
                                <MenuItem value={'avalanche'}>
                                    <div style={{ display: 'flex', alignItems: 'center', fontFamily: 'Pancake' }}>
                                        <img alt='token' src='./assets/avalanche.svg' style={{
                                            width: '30px', height: '30px', marginRight: '5px', borderRadius: '15px'
                                        }} />
                                        Avalanche
                                    </div>
                                </MenuItem>
                            </Select>
                        </FormControl> */}
                </div>
                <span className="relative inline-flex rounded-md">
                    {MetaMask_Connect()}
                    {/* <button className="dark:hover:bg-opacity-100 focus:outline-none hover:text-primary dark:hover:text-primary-xtra_dark rounded-lg py-2 px-2 lg:py-3 lg:px-4 dark:bg-primary bg-gray-900 hover:bg-gray-800 dark:bg-opacity-20 text-white dark:text-primary border-gray-900 border dark:border-primary transition-colors duration-200 ease-in-out" style={{ height: '42px' }} onClick={() => walletConnectBtn()}>
                            <span className="lg:block hidden bold">
                                {wallet.status === 'connected' ? (
                                    <>{accountStyled}</>
                                ) : (
                                    <>
                                        {isMetaMaskInstalled() === true ? 'Connect Wallet' : 'Install Wallet'}
                                    </>
                                )}
                            </span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="block fill-current lg:hidden">
                                <path opacity="0.35" d="M18 21H6C4.343 21 3 19.657 3 18V6H18C19.657 6 21 7.343 21 9V18C21 19.657 19.657 21 18 21Z"></path>
                                <path d="M17.5 15C18.3284 15 19 14.3284 19 13.5C19 12.6716 18.3284 12 17.5 12C16.6716 12 16 12.6716 16 13.5C16 14.3284 16.6716 15 17.5 15Z"></path>
                                <path d="M3 6C3 4.343 4.343 3 6 3H15C16.657 3 18 4.343 18 6H3Z"></path>
                            </svg>
                            <span className="flex absolute h-3 w-3 top-0 right-0 -mt-1 -mr-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                            </span>
                        </button> */}

                </span>
            </div>
            {walletInfoModal === true
                ? <WalletInfo MetamaskModalClose={MetamaskModalClose} balanceOfBNB={balanceOfBNB} account={account} accountStyled={accountStyled} setWalletInfoModal={setWalletInfoModal} />
                : <></>
            }

            {/* {!isBSC && status === "connected" &&
                <NoNeedNetwork setIsBSC={setIsBSC} changeNetwork={changeNetwork} />
            } */}
            <Toaster
                reverseOrder={true}
            />
        </header>
    );
}