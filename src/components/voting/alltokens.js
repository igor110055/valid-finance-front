import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { CircularProgress } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { toBigNum, fromBigNum } from "../../need";
import { ProposalSvg } from '../../assets/svg/svg';
import THCToken from '../../assets/home-img/thc.png';
import '../../assets/css/all-token.css';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useMetaMask } from "metamask-react";

import { BsEmojiSmile } from "react-icons/bs";
import {
    BrowserView,
    MobileView,
} from "react-device-detect";

const defaultPath = './assets/logo.jpg';

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

const columns = [
    { id: 'logoURI', label: 'Logo', align: 'center' },
    { id: 'symbol', label: 'Symbol', align: 'center' },
    { id: 'number', label: 'Voters', align: 'center' }
];

function VotingAll() {
    const isConnect = useSelector((state) => state.Token.isConnect);

    const { status, connect, account } = useMetaMask();
    const [topTokens, setTopTokens] = useState([]);
    const [searchValue, setSearchValue] = useState('0x56083560594e314b5cdd1680ec6a493bb851bbd8');//TRANSHUMAN COIN address
    const [tokenData, setTokenData] = useState([]);
    const [age, setAge] = useState('bsc');
    const [tokenInfo, setTokenInfo] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    const THCtokenBalance = useSelector((state) => state.Token.balanceOfTranshumanToken);
    const submit = async (proposalOfuser) => {
        if (status === "connected") {
            if (THCtokenBalance < 5000000) {//5000000
                toast('You do not have enough TRANSHUMAN COIN. Please buy TRANSHUMAN COIN to proceed.',
                    {
                        icon: '😲',
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                            boxShadow: '0px 0px 15px 0px red'
                        },
                    }
                );
            } else {
                if (window.confirm('Really ?')) {
                    // submit
                    await axios.post(`${process.env.REACT_APP_BASE_URL}`,
                        {
                            tokenInfo: tokenInfo,
                            account: account,
                            url: '/users/tokenVoting'
                        },
                        {
                            headers: {
                                'content-type': 'application/json'
                            }
                        }
                    ).then(res => {
                        if (res.data === 'success') {
                            getTokenVoting();
                            toast.success('Success')
                            // getVoters();
                        } if (res.data === 'exist') {
                            toast.error('You have already voted to this Token')
                        } if (res.data === 'update') {
                            getTokenVoting();
                            toast.success('Success')
                        } if (res.data === 'update-err') {
                            toast.error('error')
                        }
                    }).catch(err => {
                        console.log(err.error);
                    })
                };
            }
        } else if (status === "notConnected") {
            toast('Please Wallet Connect', {
                icon: '🔊 ',
            });
        }

    }

    const handleClickAway = () => {
        setOpen(false);
    };

    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    useEffect(() => {
        async function fetchData() {
            if (searchValue !== '') {
                await axios.post(
                    `${process.env.REACT_APP_BASE_URL}`,
                    {
                        value: searchValue,
                        network: age,
                        url: '/trending/search'
                    },
                    {
                        headers: {
                            'content-type': 'application/json'
                        }
                    }
                ).then(res => {
                    console.log(res.data.total, 5555)
                    if (res.data.total !== 0) {
                        setTokenData(res.data.data);
                    } else {
                        setTokenData();
                    }
                })
                    .catch(err => {
                        console.log(err, 'error');
                    })
            } else {
                setTokenData();
            }
        }
        fetchData();
    }, [searchValue])


    const styles = {
        position: 'absolute',
        right: 0,
        left: 0,
        zIndex: 20,
        marginTop: '5px',
        border: '1px solid gray',
        p: 1,
        bgcolor: '#142028',
        maxHeight: '400px',
        overflowY: 'overlay'
    };

    const SelectList = (token) => {
        setTokenInfo(token);
        setSearchValue(token.address);
        setOpen(false);
    }

    const getTokenVoting = async () => {
        await axios.post(`${process.env.REACT_APP_BASE_URL}`,
            {
                url: '/users/getTokenVoting'
            },
            {
                headers: {
                    'content-type': 'application/json'
                }
            }
        ).then(res => {
            console.log("res: ", res);
            // res.data.sort(function (a, b) {
            //     return b.voters.length - a.voters.length;
            // });
            console.log(res.data)
            setTopTokens(res.data.slice(0, 5));
            setIsLoading(false)
        }).catch(err => {
            console.log(err.error);
        })
    }
    useEffect(() => {
        getTokenVoting();
    }, [])
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <> {isLoading ?
            (
                <Box sx={{
                    display: 'flex', justifyContent: 'center', position: 'relative', top: window.innerHeight / 2 - 50
                }}>
                    <CircularProgress />
                </Box>
            )
            :
            <div className="mx-auto container px-2 py-2 xs:px-4 xs:py-4 sm:py-6 sm:px-8">
                <div>
                    <div className='justify mobile-flex-d-cr'>
                        <div className='mobile-tc'>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Which tokens do you like?</h3>
                        </div>
                        <div className={`${isConnect ? 'dis-n' : ''}`} style={{ alignItems: 'flex-start' }}>
                            <div className='justify mobile-flex-d-c'>
                                <img style={{ width: '30px', height: '30px' }} src={THCToken} alt='' />
                                <a className="ml1 mr1 dark:text-primary text-gray-700 caption cursor-pointer">
                                    <span style={{ fontSize: '18px' }}>
                                        {THCtokenBalance}
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="dis-f">
                        <div className="token-search-bar-container">
                            <ClickAwayListener
                                mouseEvent="onMouseDown"
                                touchEvent="onTouchStart"
                                onClickAway={handleClickAway}
                                className='dis-f flex1'
                            >
                                <Search className='search-part-for-alltoken' style={{ width: '100%!important' }}>
                                    <SearchIconWrapper>
                                        <SearchIcon />
                                    </SearchIconWrapper>
                                    <StyledInputBase
                                        placeholder="Search…"
                                        inputProps={{ 'aria-label': 'search' }}
                                        value={searchValue}
                                        onClick={handleClick}
                                        className='token-search-bar'
                                        style={{ width: '100%!important' }}
                                        onChange={event => setSearchValue(event.target.value)}
                                    />
                                    {open ? (
                                        <Box sx={styles}>
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
                                                                        <img alt='img' src={token.logoURI ? token.logoURI : defaultPath} style={{ width: '30px' }} />
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
                        </div>

                    </div>
                    <div className='justify upvote-container'>
                        {/* token select */}
                        <div className="mt1 ml1 mr1 w10 shadow-smooth rounded-2xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 bg-white" style={{ height: 'max(10vh, 430px)' }}>
                            <div className="h-full flex flex-col">
                                <div className="pl-4 flex flex-row items-center dark:bg-gray-700 bg-gray-100 rounded-t-2xl">
                                    <ProposalSvg />
                                    <h5 className="pt-4 pb-4 pl-2 flex items-center text-gray-400 dark:text-white overline"> Top 5 Token list by Voting </h5></div>
                                <div data-simplebar-auto-hide="false" className="relative mb-4 w-full h-full" style={{ height: 'max(20vh - 54px, 376px)' }} data-simplebar="init">
                                    <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                                        <div className="simplebar-height-auto-observer-wrapper">
                                            <div className="simplebar-height-auto-observer"></div>
                                        </div>
                                        <div className="simplebar-mask">
                                            <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                                                <div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{ height: '100%', overflow: 'hidden' }}>
                                                    <div className="simplebar-content" style={{ padding: '0px' }}>

                                                        {tokenInfo === ''
                                                            ?
                                                            <div className="flex w-full text-center flex-col justify-center h-full absolute top-0 place-items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48" className="fill-current text-gray-300 dark:text-gray-600">
                                                                    <path fill="" d="M37 10H11a3.001 3.001 0 010-6h26a3.001 3.001 0 010 6zM37 44H11a3.001 3.001 0 010-6h26a3.001 3.001 0 010 6z"></path>
                                                                    <path fill="" d="M38 13.406V12c0-2.21-1.79-4-4-4H14c-2.21 0-4 1.79-4 4v1.406a10 10 0 006.062 9.192L19.334 24l-3.274 1.402A10.002 10.002 0 0010 34.594V36a4 4 0 004 4h20a4 4 0 004-4v-1.406a10 10 0 00-6.062-9.192L28.666 24l3.274-1.404a9.997 9.997 0 006.06-9.19z" opacity=".35"></path>
                                                                    <path fill="" d="M16.892 18a5.701 5.701 0 002.572 2.198l4.538 1.944 4.536-1.944A5.686 5.686 0 0031.108 18H16.892zM16 38.142h16v-1.088a5.712 5.712 0 00-3.464-5.252l-4.538-1.944-4.536 1.944A5.714 5.714 0 0016 37.054v1.088z"></path>
                                                                </svg>
                                                                <span className="text-white overline w-full text-gray-500 dark:text-gray-300 mt-2">
                                                                    Please select token for voting
                                                                </span>
                                                            </div> :
                                                            <>
                                                                <div className="flex w-full text-center flex-col justify-center h-full absolute top-0 place-items-center">
                                                                    <div className='dis-f ai-c jc-c' style={{ width: '100%' }}>
                                                                        <ListItemButton className='token-info text-white overline w-full text-gray-500 dark:text-gray-300'>
                                                                            <ListItemIcon>
                                                                                <img alt='img' src={tokenInfo.logoURI ? tokenInfo.logoURI : defaultPath} style={{ borderRadius: '50%', width: '140px' }} />
                                                                            </ListItemIcon>
                                                                            <div style={{ display: 'grid', marginLeft: '10px' }}>
                                                                                <ListItemText primary={`Name : ${tokenInfo.name}`} />
                                                                                <ListItemText primary={`Symbol : ${tokenInfo.symbol}`} />
                                                                                <ListItemText primary={`Network : ${tokenInfo.network}`} />
                                                                                <ListItemText primary={`Address : ${tokenInfo.address.substr(0, 6)}...${tokenInfo.address.substr(-6)}`} />
                                                                            </div>
                                                                        </ListItemButton>
                                                                    </div>
                                                                    <div className='mt2'>
                                                                        <div className='tooltip'>
                                                                            <span className="tooltiptext">I like this Token</span>
                                                                            <BsEmojiSmile onClick={() => submit()} className='upvote-symbol flex-shrink-0 fill-current text-primary-dark dark:text-primary' />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="simplebar-placeholder" style={{ width: 'auto', height: '0px' }}></div>
                                    </div>
                                    <div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}>
                                        <div className="simplebar-scrollbar simplebar-visible" style={{ width: '0px', display: 'none' }}></div>
                                    </div>
                                    <div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}>
                                        <div className="simplebar-scrollbar simplebar-visible" style={{ height: '0px', display: 'none' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* display token list */}
                        <div className="mt1 ml1 mr1 w10 shadow-smooth rounded-2xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 bg-white" style={{ height: 'max(10vh, 430px)' }}>
                            <div className="h-full flex flex-col">
                                <div className="pl-4 flex flex-row items-center dark:bg-gray-700 bg-gray-100 rounded-t-2xl">
                                    <ProposalSvg />
                                    <h5 className="pt-4 pb-4 pl-2 flex items-center text-gray-400 dark:text-white overline"> Top 5 Token list by Voting </h5></div>
                                <div data-simplebar-auto-hide="false" className="relative mb-4 w-full h-full" style={{ height: 'max(20vh - 54px, 376px)' }} data-simplebar="init">
                                    <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                                        <div className="simplebar-height-auto-observer-wrapper">
                                            <div className="simplebar-height-auto-observer"></div>
                                        </div>
                                        <div className="simplebar-mask">
                                            <div className="simplebar-offset" style={{ right: '0px', bottom: '0px' }}>
                                                <div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{ height: '100%', overflow: 'hidden' }}>
                                                    <div className="simplebar-content" style={{ padding: '0px' }}>
                                                        {topTokens.length === 0 ?
                                                            <div className="flex w-full text-center flex-col justify-center h-full absolute top-0 place-items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" viewBox="0 0 48 48" className="fill-current text-gray-300 dark:text-gray-600">
                                                                    <path fill="" d="M37 10H11a3.001 3.001 0 010-6h26a3.001 3.001 0 010 6zM37 44H11a3.001 3.001 0 010-6h26a3.001 3.001 0 010 6z"></path>
                                                                    <path fill="" d="M38 13.406V12c0-2.21-1.79-4-4-4H14c-2.21 0-4 1.79-4 4v1.406a10 10 0 006.062 9.192L19.334 24l-3.274 1.402A10.002 10.002 0 0010 34.594V36a4 4 0 004 4h20a4 4 0 004-4v-1.406a10 10 0 00-6.062-9.192L28.666 24l3.274-1.404a9.997 9.997 0 006.06-9.19z" opacity=".35"></path>
                                                                    <path fill="" d="M16.892 18a5.701 5.701 0 002.572 2.198l4.538 1.944 4.536-1.944A5.686 5.686 0 0031.108 18H16.892zM16 38.142h16v-1.088a5.712 5.712 0 00-3.464-5.252l-4.538-1.944-4.536 1.944A5.714 5.714 0 0016 37.054v1.088z"></path>
                                                                </svg>
                                                                <span className="text-white overline w-full text-gray-500 dark:text-gray-300 mt-2">
                                                                    no voters
                                                                </span>
                                                            </div> :
                                                            <Paper sx={{ width: '100%', background: 'transparent' }}>
                                                                <TableContainer>
                                                                    <Table className='toplist-currency-table' stickyHeader aria-label="sticky table">
                                                                        <TableHead>
                                                                            <TableRow>
                                                                                {columns.map((column) => (
                                                                                    <TableCell
                                                                                        key={column.id}
                                                                                        align={column.align}
                                                                                        className='toplist-currency-table-header'
                                                                                    >
                                                                                        {column.label}
                                                                                    </TableCell>
                                                                                ))}
                                                                            </TableRow>
                                                                        </TableHead>
                                                                        <TableBody className='toplist-currency-table-body'>
                                                                            {topTokens
                                                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                                .map((row, i) => {
                                                                                    let defaultPath = './assets/logo.jpg';

                                                                                    return (
                                                                                        <TableRow hover role="checkbox" tabIndex={-1} key={row.name + i} >
                                                                                            {columns.map((column) => {
                                                                                                const value = row[column.id];
                                                                                                if (column.id === 'logoURI') {
                                                                                                    return (
                                                                                                        <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', color: '#ff4a68' }}>
                                                                                                            <img alt='img' src={`${value ? value : defaultPath}`} style={{ width: '30px', borderRadius: '50%' }} />
                                                                                                        </TableCell>
                                                                                                    )
                                                                                                } else if (column.id === 'voters') {
                                                                                                    return (
                                                                                                        <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray' }}>
                                                                                                            {value.number}
                                                                                                        </TableCell>
                                                                                                    )
                                                                                                } else {
                                                                                                    return (
                                                                                                        <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray' }}>
                                                                                                            {value}
                                                                                                        </TableCell>
                                                                                                    );
                                                                                                }
                                                                                            })}
                                                                                        </TableRow>
                                                                                    );
                                                                                }
                                                                                )}
                                                                        </TableBody>
                                                                    </Table>
                                                                </TableContainer>
                                                            </Paper>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="simplebar-placeholder" style={{ width: 'auto', height: '0px' }}></div>
                                    </div>
                                    <div className="simplebar-track simplebar-horizontal" style={{ visibility: 'hidden' }}>
                                        <div className="simplebar-scrollbar simplebar-visible" style={{ width: '0px', display: 'none' }}></div>
                                    </div>
                                    <div className="simplebar-track simplebar-vertical" style={{ visibility: 'hidden' }}>
                                        <div className="simplebar-scrollbar simplebar-visible" style={{ height: '0px', display: 'none' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster
                    reverseOrder={true}
                />

            </div>
        }
        </>

    )
}
export default VotingAll;