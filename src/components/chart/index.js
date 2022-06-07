import { Box, Button, FilledInput, FormControl, InputAdornment, MenuItem, Typography, CircularProgress } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Select from '@mui/material/Select';
import SwapVertIcon from '@mui/icons-material/SwapVert';

import bscSymbol from '../../assets/home-img/bsc-symbol.svg';
import '../../assets/css/chart.css';
import TradingViewComponent from '../../tradingView'

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import moment from 'moment';
import NumberFormat from 'react-number-format'
import { BsFillFlagFill, BsGlobe2, BsCart4, BsCurrencyExchange } from "react-icons/bs";
import { FaTelegramPlane, FaTwitter, FaAngleDown, FaAngleUp, FaRegCheckCircle, FaFeatherAlt } from 'react-icons/fa';
import {
    BrowserView,
    MobileView,
} from "react-device-detect";
import toast, { Toaster } from 'react-hot-toast';


import { AiOutlineAudit, AiFillDollarCircle } from 'react-icons/ai';
const CMC = (classnames) => {
    return (
        <svg className={classnames} version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="20px" height="20px" viewBox="0 0 223.000000 226.000000"
            preserveAspectRatio="xMidYMid meet">
            <g transform="translate(0.000000,226.000000) scale(0.100000,-0.100000)"
                fill="#7f8fa9" stroke="none">
                <path d="M975 2250 c-354 -45 -685 -282 -849 -607 -82 -165 -117 -317 -117
                    -513 0 -313 102 -566 319 -792 183 -190 410 -300 680 -329 299 -33 635 78 839
                    276 43 41 53 58 53 84 0 69 -57 122 -115 107 -14 -4 -63 -36 -108 -71 -166
                    -132 -314 -185 -537 -192 -131 -4 -154 -2 -242 20 -100 26 -203 73 -294 133
                    -61 40 -167 140 -162 152 1 5 107 175 233 379 l230 370 6 -216 c5 -168 10
                    -227 24 -263 41 -114 156 -139 251 -56 19 17 81 105 138 197 56 91 129 209
                    162 261 l59 95 6 -170 c4 -147 8 -178 29 -230 58 -147 210 -226 371 -192 64
                    13 155 81 198 146 55 86 75 163 74 296 -1 321 -126 606 -362 827 -191 180
                    -435 282 -699 292 -64 3 -148 1 -187 -4z m325 -215 c264 -53 501 -239 627
                    -490 99 -197 129 -474 63 -583 -55 -90 -174 -95 -222 -9 -8 14 -15 95 -19 232
                    -5 166 -9 218 -23 250 -51 120 -163 146 -264 60 -44 -39 -91 -107 -248 -360
                    l-99 -160 -5 280 c-5 268 -6 282 -27 316 -37 59 -114 77 -174 42 -39 -23 -65
                    -62 -344 -513 -131 -212 -242 -389 -246 -394 -11 -12 -62 101 -84 182 -92 356
                    37 748 319 968 219 172 478 234 746 179z"/>
            </g>
        </svg>
    )
}

export default function Chart() {

    const defaultPath = './assets/logo.jpg';
    const Token = useSelector((state) => state.Token.TokenName);
    const Network = useSelector((state) => state.Token.Network);
    const [trendingOption, setTrendingOption] = React.useState([]);
    const [state, setState] = React.useState(true);
    const [tradingHistory, setTradingHistory] = React.useState({});
    const [basic, setBasic] = React.useState('');
    const [total2, setTotal2] = React.useState('');

    const [amountOfToken, setAmountOfToken] = React.useState('');

    const [values, setValues] = React.useState({
        amount1: 0,
        amount2: 0,
        password: 0,
        weight: '',
        weightRange: '',
        showPassword: false,
    });

    const [token1, setToken1] = React.useState('USDC');

    const [token2, setToken2] = React.useState('USDC');

    const ChangeState = () => {
        setState(!state);
    }

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const [symbol, setSymbol] = useState('avaxusd')

    const [isLoading, setIsLoading] = React.useState(true);

    const [ads, setAds] = React.useState([]);
    useEffect(() => {
        if (Token === 'avalanche') {
            setSymbol('AVAXUSD');
        } else if (Token === 'eth' || Token === 'optimism' || Token === 'arbitrum') {
            setSymbol('ETHUSD')
        } else if (Token === 'bsc') {
            setSymbol('BNBUSD')
        } else if (Token === 'fantom') {
            setSymbol('FTMUSD')
        } else if (Token === 'polygon') {
            setSymbol('MATICUSD')
        } else if (Token === 'celo') {
            setSymbol('CELOUSD')
        }

        // async function fetchData1() {
        //     await axios.post(`${process.env.REACT_APP_BASE_URL}/trending/optionlist`, {
        //         network: Token,
        //     })
        //         .then(res => {
        //             if (res.data) {
        //                 setTrendingOption(res.data);
        //             }
        //         })
        //         .catch(err => {
        //             console.log(err, 'error');
        //         })
        // }

        // async function fetchData2() {
        //     await axios.post(`${process.env.REACT_APP_BASE_URL}/trending/getAds`, {
        //         network: Token,
        //     })
        //         .then(res => {
        //             if (res.data) {
        //                 setAds(res.data[0]);
        //             }
        //         })
        //         .catch(err => {
        //             console.log(err, 'error');
        //         })
        // }

        // fetchData1();
        // fetchData2();

    }, [Token])

    useEffect(async () => {


        if (Network.network === 'avalanche') {
            setSymbol(`${Network.symbol}USD`);
        } else if (Network.network === 'eth' || Network.network === 'optimism' || Network.network === 'arbitrum') {
            setSymbol(`${Network.symbol}USD`)
        } else if (Network.network === 'bsc') {
            setSymbol(`${Network.symbol}USD`)
        } else if (Network.network === 'fantom') {
            setSymbol(`${Network.symbol}USD`)
        } else if (Network.network === 'polygon') {
            setSymbol(`${Network.symbol}USD`)
        }

        async function fetchData() {
            try {

                // const api = `https://www.dextools.io/chain-bsc/api/PancakeSwap/1/pairexplorer?v=2.10.0&pair=0x62be1533f3a78de99ca297ebbe489a3fb7253bef&ts=1649298933-0`;
                const res = await axios.post(
                    `${process.env.REACT_APP_BASE_URL}`,
                    {
                        address: Network.address,
                        network: Network.network,
                        url: '/trending/get_trending_history'
                    },
                    {
                        headers: {
                            'content-type': 'application/json'
                        }
                    }
                );
                console.log(res.data);

                // 'X-API-KEY' :'BQYW1cs0dsGDCZUnVUsvOcNjb95Ih5X3'

                // const options = {
                //     method: 'GET',
                //     url: api,
                //     headers: {
                //         'Cookie': 'ai_user=QCJGNbrO82FQx+pVnTCU0B|2022-03-13T15:55:57.797Z; _pk_id.4.b299=c614dacdc3685848.1649195968.'
                //     }
                // };


                // const res = await axios.request(options);

                if (res.data.result) {
                    const data = res.data.result
                    setBasic(res.data.token.symbol)
                    setTotal2('Total ' + res.data.tokenRef.symbol)
                    setAmountOfToken('Amount ' + res.data.token.symbol);
                    let array = [];
                    for (let k = 0; k < data.length; k++) {
                        const element = data[k];
                        let date = moment(element.timestamp).format();
                        array.push({
                            date: date,
                            type: element.type,
                            usd: `$${element.price}`,
                            amount: element.amountToken,
                            total2: element.amountRef,
                            transaction: element.blockHash
                        });
                    }
                    setTradingHistory(array);
                    setIsLoading(false);
                } else {
                    // toast('NETWORK ERROR.',
                    //     {
                    //         icon: '❌',
                    //         style: {
                    //             borderRadius: '10px',
                    //             background: '#333',
                    //             color: '#fff',
                    //             boxShadow: '0px 0px 15px 0px red'
                    //         },
                    //     })
                }
            } catch (error) {
                console.log('get_trending_history : ', error);
            }
        }
        if (Network.address) {
            fetchData();
        }

    }, [Network])

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };
    const handleChangeToken1 = (event) => {
        setToken1(event.target.value);
    };
    const handleChangeToken2 = (event) => {
        setToken2(event.target.value);
    };
    const columns = [
        { id: 'date', label: 'Date', minWidth: 200, align: 'center' },
        { id: 'type', label: 'Type', minWidth: 100, align: 'center' },
        {
            id: 'usd',
            label: 'Price USD',
            minWidth: 100,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'amount',
            label: amountOfToken,
            minWidth: 100,
            align: 'center',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'total2',
            label: total2,
            minWidth: 100,
            align: 'center',
            format: (value) => value.toFixed(2)
        },
        {
            id: 'transaction',
            label: 'TXN',
            align: 'left',
            format: (value) => value.toFixed(2)
        }
    ];
    const linkTagIconClass = 'text-gray-300 hover:opacity-70 dark:hover:opacity-100 dark:text-gray-400 dark:hover:text-white transition-all duration-300 fill-current h-5 w-5';

    return (
        <Box >
            {isLoading ?
                (
                    <Box sx={{
                        display: 'flex', justifyContent: 'center', position: 'relative', top: window.innerHeight / 2 - 50
                    }}>
                        <CircularProgress />
                    </Box>
                )
                :

                <div style={{ height: '100%' }} className="w10 ml4 mx-auto container px-2 py-2 xs:px-4 xs:py-4 sm:py-6 sm:px-8">
                    <div className="mt3 flex flex-row items-center space-x-3">
                        <div className="space-x-3 flex flex-row my-3">
                            <div className="flex flex-row items-center">
                                <a href="http://t.me/buytranshumancoin" target="_blank" rel="noopener norefferer" aria-hidden="true">
                                    <div className='tooltip'>
                                        <span className="tooltiptext">Telegram</span>
                                        <FaTelegramPlane className={linkTagIconClass} />
                                    </div>
                                </a>
                            </div>
                            <div className="flex flex-row items-center">
                                <a href="/" rel="noopener norefferer" aria-hidden="true" target="_blank">
                                    <div className='tooltip'>
                                        <span className="tooltiptext">Twitter</span>
                                        <FaTwitter className={linkTagIconClass} />
                                    </div>
                                </a>
                            </div>
                            <div className="flex flex-row items-center">
                                <a href="https://coinmarketcap.com/currencies/transhuman-coin/" rel="noopener norefferer" aria-hidden="true" target="_blank">
                                    <div className='tooltip'>
                                        <span className="tooltiptext">Coin Market Cap</span>
                                        <CMC className={linkTagIconClass} />
                                    </div>
                                </a>
                            </div>
                            <div className="flex flex-row items-center">
                                <a href="www.transhumancoin.finance" rel="noopener norefferer" aria-hidden="true" target="_blank">
                                    <div className='tooltip'>
                                        <span className="tooltiptext">Our Site</span>
                                        <BsGlobe2 className={linkTagIconClass} />
                                    </div>
                                </a>
                            </div>
                            <div className="flex flex-row items-center">
                                <a href="www.transhumancoin.finance/shop" rel="noopener norefferer" aria-hidden="true" target="_blank">
                                    <div className='tooltip'>
                                        <span className="tooltiptext">Shop</span>
                                        <BsCart4 className={linkTagIconClass} />
                                    </div>
                                </a>
                            </div>
                            <div className="flex flex-row items-center">
                                <a href="https://bscscan.com/address/0x56083560594e314b5cdd1680ec6a493bb851bbd8#code" rel="noopener norefferer" aria-hidden="true" target="_blank">
                                    <div className='tooltip'>
                                        <span className="tooltiptext">Contract</span>
                                        <AiOutlineAudit className={linkTagIconClass} />
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full mt-1 w10" style={{ height: '100%' }}>
                        <div style={{ height: '100%' }} className="flex xl:flex-row flex-col w-full xl:space-x-4 xl:space-y-0 space-y-4">
                            <Box style={{ width: '100%' }}>
                                <Box sx={{ width: '100%', borderRadius: '10px', margin: '0px', display: 'flex' }}>
                                    <Box className='chart-container1'>

                                        <Box className='p1'>
                                            <h4 className='text-gray-800 text-xs md:text-base w-full dark:text-white flex flex-row items-center'>
                                                On a candlestick chart, bars get a colour based on how the close compares to the open. A green candle is a candlestick bar that closed higher than its opening price. And red candles, on the other hand, are bars that closed lower than their opening price
                                            </h4><br />
                                        </Box>
                                        <Box className='chart-container2'>
                                            <Box className='chart-container3'>
                                                <Box className='tradingview'>
                                                    <TradingViewComponent />
                                                </Box>
                                                <Box className='tradingview-detail' >
                                                    <Box className='tradingview-detail-con'>
                                                        <Typography gutterBottom component="div" style={{
                                                            margin: '0px', fontSize: '25px', fontFamily: 'Pancake', borderBottom: '1px solid gray'
                                                        }}>
                                                            {
                                                                Network.name ?
                                                                    <span>
                                                                        {Network.name}
                                                                    </span>
                                                                    :
                                                                    ''
                                                            }
                                                        </Typography>
                                                        <Box style={{ display: 'flex' }}>
                                                            {
                                                                Network.network ?
                                                                    <Box style={{ display: 'flex' }}>
                                                                        <Box style={{ fontSize: 'small', display: 'grid', minWidth: '155px' }} >
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Verified:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Decimals:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Symbol:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Network:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Market Cap:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Market CapChange 24H:</span>
                                                                            {/* <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Liquidity ETH:</span> */}
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Liquidity USD:</span>
                                                                            {/* <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Price ETH:</span> */}
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Price ETHChange 24H:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Price USD:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>PriceUSDChange 24H:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Volume24hETH:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>Volume24hUSD:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>VolumeETHChange24h:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>VolumeUSDChange24h:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>txns24hChange:</span>
                                                                            <span style={{ fontFamily: 'Pancake', fontSize: '13px' }}>txns24h:</span>

                                                                        </Box>
                                                                        <Box style={{ fontSize: 'small', display: 'grid' }} >
                                                                            <Box component="span" >{Network.verified ? 'true' : 'false'}</Box>
                                                                            <Box component="span" >{Network.decimals}</Box>
                                                                            <Box component="span" >{Network.symbol}</Box>
                                                                            <Box component="span" >{Network.network}</Box>
                                                                            <NumberFormat value={Network.marketCap.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.marketCapChange24h.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            {/* <NumberFormat value={Network.liquidityETH.toFixed(4)} displayType={'text'} thousandSeparator={true} /> */}
                                                                            <NumberFormat value={Network.liquidityUSD.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            {/* <NumberFormat value={Network.priceETH.toFixed(4)} displayType={'text'} thousandSeparator={true} /> */}
                                                                            <NumberFormat value={Network.priceETHChange24h.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.priceUSD.toFixed(10)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.priceUSDChange24h.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.volume24hETH.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.volume24hUSD.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.volumeETHChange24h.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.volumeUSDChange24h.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.txns24hChange.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                            <NumberFormat value={Network.txns24h.toFixed(4)} displayType={'text'} thousandSeparator={true} />
                                                                        </Box>
                                                                    </Box>
                                                                    :
                                                                    <></>
                                                            }

                                                        </Box>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Paper sx={{ width: '100%', overflow: 'hidden', border: '1px solid gray', mt: '20px', display: 'grid' }}>
                                            <TableContainer style={{ width: '100%' }}>
                                                <Table className='currency-table' style={{ width: '100%' }} stickyHeader aria-label="sticky table">
                                                    <TableHead >
                                                        <TableRow>
                                                            {columns.map((column) => (
                                                                <TableCell
                                                                    key={column.id}
                                                                    align={column.align}
                                                                    className='currency-table-header'

                                                                >
                                                                    {column.label}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody className='chart-table-body'>
                                                        {
                                                            tradingHistory ?
                                                                tradingHistory
                                                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                                    .map((row, i) => {
                                                                        if (row.type === 'buy') {
                                                                            return (
                                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.type + i} >
                                                                                    {columns.map((column) => {
                                                                                        const value = row[column.id];
                                                                                        if (column.id === 'transaction') {
                                                                                            let hashNetwork = 'snowtrace.io';
                                                                                            if (Network.network === 'eth') {
                                                                                                hashNetwork = 'etherscan.io';
                                                                                            } else if (Network.network === 'bsc') {
                                                                                                hashNetwork = 'bscscan.com';
                                                                                            } else if (Network.network === 'polygon') {
                                                                                                hashNetwork = 'polygonscan.com'
                                                                                            } else if (Network.network === 'fantom') {
                                                                                                hashNetwork = 'ftmscan.com'
                                                                                            }
                                                                                            return (
                                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#29b0ff' }}>
                                                                                                    <a target='blank' style={{ color: '#29b0ff' }} href={`https://${hashNetwork}/tx/${value}`}>
                                                                                                        {value.slice(0, 20) + '.....' + value.slice(value.length - 10)}
                                                                                                    </a>
                                                                                                </TableCell>
                                                                                            );
                                                                                        } else {
                                                                                            return (
                                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#29b0ff' }}>
                                                                                                    {value}
                                                                                                </TableCell>
                                                                                            );
                                                                                        }
                                                                                    })}
                                                                                </TableRow>
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <TableRow hover role="checkbox" tabIndex={-1} key={row.type + i} >
                                                                                    {columns.map((column) => {
                                                                                        const value = row[column.id];
                                                                                        if (column.id === 'transaction') {
                                                                                            let hashNetwork = 'snowtrace.io';
                                                                                            if (Network.network === 'eth') {
                                                                                                hashNetwork = 'etherscan.io';
                                                                                            } else if (Network.network === 'bsc') {
                                                                                                hashNetwork = 'bscscan.com';
                                                                                            } else if (Network.network === 'polygon') {
                                                                                                hashNetwork = 'polygonscan.com'
                                                                                            } else if (Network.network === 'fantom') {
                                                                                                hashNetwork = 'ftmscan.com'
                                                                                            }
                                                                                            return (
                                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#ff6a6a' }}>
                                                                                                    <a target='blank' style={{ color: '#ff6a6a' }} href={`https://${hashNetwork}/tx/${value}`}>
                                                                                                        {value.slice(0, 20) + '.....' + value.slice(value.length - 10)}
                                                                                                    </a>
                                                                                                </TableCell>
                                                                                            );
                                                                                        } else {
                                                                                            return (
                                                                                                <TableCell key={column.id + i} align={column.align} style={{ borderBottom: 'gray', fontFamily: 'Pancake', color: '#ff6a6a' }}>
                                                                                                    {value}
                                                                                                </TableCell>
                                                                                            );
                                                                                        }
                                                                                    })}
                                                                                </TableRow>
                                                                            );
                                                                        }
                                                                    })
                                                                :
                                                                <></>
                                                        }
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                            <TablePagination
                                                rowsPerPageOptions={[10, 25, 100]}
                                                component="div"
                                                count={tradingHistory.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={handleChangePage}
                                                onRowsPerPageChange={handleChangeRowsPerPage}
                                                className='currency-table-footer'
                                            />
                                        </Paper>
                                    </Box>
                                </Box>
                            </Box>
                        </div>
                    </div>
                    <Toaster
                        reverseOrder={true}
                    />
                </div>
            }
        </Box>
    );
}