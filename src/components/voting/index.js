import { Box, CircularProgress } from '@mui/material';
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
import { transhumantokenContract } from "../../contract";
import '../../assets/css/voting.css';

import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ethers } from 'ethers';
import { useMetaMask } from "metamask-react";
import {
    BrowserView,
    MobileView,
} from "react-device-detect";
const columns = [
    { id: 'account', label: 'Account', align: 'center' },
    { id: 'date', label: 'Date', align: 'center' },
    { id: 'proposal', label: 'Proposal', align: 'center', minWidth: '220px' }
];

const Proposal = (props) => {
    const [content, setContent] = useState('');
    return (

        <div style={{ right: 0, left: 0, top: 0, bottom: 0 }} className='fixed h-full w-full flex justify-center items-center p-4 z-20'>
            <div onClick={() => props.setProposalModal(false)} className="top-0 fixed z-20 w-full left-0 h-full bg-gray-900 bg-opacity-60" style={{ backdropFilter: 'blur(1.2px)' }}></div>

            <div className="proposal lg:left-50-256 w-full flex flex-col dark:bg-gray-800 bg-white rounded-2xl overflow-hidden z-40 border border-white dark:border-gray-600" style={{ maxWidth: '700px' }}>

                <div className="px-6 py-4 border-b dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 flex flex-row justify-between items-center">
                    <h4 className="dark:text-white text-gray-800 mb-2 mt-2">Your Proposal</h4>
                    <div className="flex flex-row">
                        <a onClick={() => props.setProposalModal(false)} href className="dark:text-primary text-gray-400 hover:bg-gray-300 cursor-pointer rounded-full dark:hover:bg-primary p-1 hover:bg-opacity-20 dark:hover:bg-opacity-20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </a>
                    </div>
                </div>

                {/* <div className="px-6 py-6 w-full overflow-y-auto max-h-96 dark:text-white text-gray-600">
                    <div className="flex items-start flex-col">
                        <h4 className="dark:text-white text-gray-700 pt-3 font-semibold hidden md:block">
                            sdfsdfsdfsdfsd
                        </h4>
                    </div>
                </div> */}
                <div style={{ borderSize: '1px' }} className="mx-4 my-4 font-heading text-sm flex justify-between border dark:border-primary border-primary-dark dark:border-opacity-40 border-opacity-40 bg-primary bg-opacity-5 bg-white rounded-md overflow-hidden">
                    <div style={{ borderSize: '1px' }} className="flex flex-col w-full">
                        <div className="flex flex-col">
                            {/* <span className="caption rounded-md dark:text-primary text-primary-dark px-2 py-1 bg-primary bg-opacity-20 place-self-start mb-2">Balances &amp; Stakes</span> */}
                            <textarea onChange={(e) => setContent(e.target.value)} style={{ resize: 'none' }} rows={9} className='flex flex1 flex-col p-4 dark:text-gray-100 text-gray-600'></textarea>
                        </div>
                    </div>
                </div>


                <div className="w-full overflow-y-auto max-h-96 dark:text-white text-gray-600">
                    <div className="px-6 py-4">
                        <button onClick={() => props.submit(content)} className="m-auto flex hover:bg-opacity-100 hover:text-white rounded-lg py-3 px-4 bg-error-bright bg-opacity-20 text-error-bright text-white border border-error-bright transition-colors duration-200 ease-in-out"> Submit </button>
                    </div>
                </div>

            </div>
        </div>
    )
}

function Voting() {
    const { status, connect, account } = useMetaMask();
    const [proposalModal, setProposalModal] = useState(false);
    const [selectVoting, setSelectVoting] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [voters, setVoters] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const THCtokenBalance = useSelector((state) => state.Token.balanceOfTranshumanToken);

    let location = useLocation();
    const TokenCheck = () => {
        if (location.pathname === '/voting') {
            if (status === "connected") {
                if (THCtokenBalance < 5000000) {
                    toast('you do not have enough TRANSHUMAN COIN. Please buy TRANSHUMAN COIN to proceed.',
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
                    toast('You have over 5000000 TRANSHUMAN COIN! Welcome to Voting System.',
                        {
                            icon: '🤗',
                            style: {
                                borderRadius: '10px',
                                background: '#333',
                                color: '#fff',
                                maxWidth: '290px',
                                boxShadow: '0px 0px 15px 0px green'
                            },
                        }
                    );
                }
            } else if (status === "notConnected") {
                toast('Please Wallet Connect', {
                    icon: '🔊 ',
                });
            }
        }
    }
    useEffect(() => {
        TokenCheck()
    }, [location])
    const getVoters = async () => {
        await axios.post(`${process.env.REACT_APP_BASE_URL}`,
            {
                url: '/users/getVoters'
            },
            {
                headers: {
                    'content-type': 'application/json'
                }
            }

        ).then(res => {
            console.log("res: ", res);
            // const array = [];
            // for (let k = 0; k < res.data.length; k++) {
            //     const element = res.data[k];
            //     array.push(
            //         {
            //             account: element.account.slice(0, 20) + '...' + element.account.slice(element.account.length - 10),
            //             date: element.date,
            //             proposal: element.proposal,
            //         });
            // }
            setVoters(res.data);
            setIsLoading(false);

        }).catch(err => {
            console.log(err.error);
        })
    }
    useEffect(() => {
        getVoters();
    }, [])

    const proposalHandle = () => {
        if (status === "connected") {
            if (THCtokenBalance < 5000000) {
                toast('you do not have enough TRANSHUMAN COIN. Please buy TRANSHUMAN COIN to proceed.',
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
                setProposalModal(true)
            }
        } else if (status === "notConnected") {
            toast('Please Wallet Connect', {
                icon: '🔊 ',
            });
        }


    }
    const submit = async (proposalOfuser) => {
        if (window.confirm('Really ?')) {
            // submit

            await axios.post(`${process.env.REACT_APP_BASE_URL}`,
                {
                    proposal: proposalOfuser,
                    account: account,
                    url: '/users/proposal-voting'
                },
                {
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    if (res.data === 'success') {
                        toast.success('Success')
                        getVoters();
                    } if (res.data === 'empty') {
                        toast.error('Please enter your proposal')
                    } if (res.data === 'exist') {
                        toast.error('You have already voted')
                    }
                }).catch(err => {
                    console.log(err.error);
                })
        };
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    // const getBalance = async () => {
    //     var provider = new ethers.providers.Web3Provider(window.ethereum);
    //     const signer = provider.getSigner();
    //     var MyContract = transhumantokenContract.connect(signer);
    //     let balance = await MyContract.balanceOf(window.ethereum.selectedAddress);
    //     let bigBal = fromBigNum(balance, 9);
    //     console.log(bigBal)
    // }

    return (
        <div className="mx-auto container px-2 py-2 xs:px-4 xs:py-4 sm:py-6 sm:px-8">
            {isLoading ?
                (
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', position: 'relative', top: window.innerHeight / 2 - 50
                    }}>
                        <CircularProgress />
                    </Box>
                )
                : <div>
                    <div className='dis-f jc-sb mobile-flex-d-cr'>
                        <div className='mobile-tc'>
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                                Propose a Transhumanist Project and Our Community will vote.
                            </h3>
                        </div>
                        <div className="mobile-flex-d-c" style={{ alignItems: 'flex-start' }}>
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
                    <div className="justify">
                        <button onClick={() => proposalHandle()} type="button" className="p1 justify text-white rounded-lg transition-opacity hover:opacity-70 bg-secondary focus:outline-none">
                            <ProposalSvg />
                            &nbsp;Make a Proposal
                        </button>
                    </div>

                    <div className="mt1 shadow-smooth rounded-2xl dark:bg-gray-800 border border-gray-200 dark:border-gray-700 bg-white" style={{ height: 'max(20vh, 430px)' }}>
                        <div className="h-full flex flex-col">
                            <div className="pl-4 flex flex-row items-center dark:bg-gray-700 bg-gray-100 rounded-t-2xl">
                                <ProposalSvg />
                                <h5 className="pt-4 pb-4 pl-2 flex items-center text-gray-400 dark:text-white overline"> Voting System </h5></div>
                            <div data-simplebar-auto-hide="false" className="relative mb-4 w-full h-full" style={{ height: 'max(20vh - 54px, 376px)' }} data-simplebar="init">
                                <div className="simplebar-wrapper" style={{ margin: '0px' }}>
                                    <div className="simplebar-height-auto-observer-wrapper">
                                        <div className="simplebar-height-auto-observer"></div>
                                    </div>
                                    <div className="simplebar-mask">
                                        <div className="simplebar-offset" style={{ right: '0px', bottom: '0px', overflow: 'auto' }}>
                                            <div className="simplebar-content-wrapper" tabIndex="0" role="region" aria-label="scrollable content" style={{ height: '100%', overflow: 'auto' }}>
                                                <div className="simplebar-content" style={{ overflow: 'auto', padding: '0px' }}>
                                                    {voters.length === 0 ?
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
                                                                <Table className='vot-currency-table' stickyHeader aria-label="sticky table">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            {columns.map((column) => (
                                                                                <TableCell
                                                                                    key={column.id}
                                                                                    align={column.align}
                                                                                    style={{ minWidth: column.minWidth }}
                                                                                    className='vot-currency-table-header'
                                                                                >
                                                                                    {column.label}
                                                                                </TableCell>
                                                                            ))}
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody className='vot-currency-table-body'>
                                                                        {voters
                                                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                            .map((row, i) => {
                                                                                return (
                                                                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.name + i} >
                                                                                        {columns.map((column) => {
                                                                                            const value = row[column.id];
                                                                                            if (column.id === 'chart') {
                                                                                                return (
                                                                                                    <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', color: '#ff4a68' }}>
                                                                                                        <img alt='img' src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${value}.png`} style={{ width: '30px' }} />
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
                                                            <TablePagination
                                                                rowsPerPageOptions={[10, 25, 100]}
                                                                component="div"
                                                                count={voters.length}
                                                                rowsPerPage={rowsPerPage}
                                                                page={page}
                                                                onPageChange={handleChangePage}
                                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                                className='vot-currency-table-footer'
                                                            />
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
                </div>}
            {proposalModal === true
                ? <Proposal setProposalModal={setProposalModal} submit={submit} />
                : <></>
            }
            <Toaster
                reverseOrder={true}
            />

        </div>
    )
}
export default Voting;