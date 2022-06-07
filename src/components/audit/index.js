
import bscSymbol from '../../assets/home-img/bsc-symbol.svg';
import { RightArrow } from '../../assets/svg/svg';
import '../../assets/css/audit.css';
import {
    BrowserView,
    MobileView,
} from "react-device-detect";

import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { BsFillFlagFill, BsGlobe2, BsCart4, BsCurrencyExchange } from "react-icons/bs";
import { FaTelegramPlane, FaTwitter, FaAngleDown, FaAngleUp, FaRegCheckCircle, FaFeatherAlt } from 'react-icons/fa';
import { AiOutlineAudit, AiFillDollarCircle } from 'react-icons/ai';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

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
const Report = (props) => {
    const [status, setStatus] = useState({
        success: false,
        verified: false,
        sent: 0,
        email: '',
        code: '',
        contents: '',
        error: ''
    })

    const sendMail = async () => {
        const { email } = status
        if (/[a-zA-Z0-9.]+@[a-z]+\.[a-z]{2,10}/.test(email) === true) {
            await axios.post(`${process.env.REACT_APP_BASE_URL}`,
                {
                    email: email,
                    url: '/users/send-verify-email'
                },
                {
                    headers: {
                        'content-type': 'application/json'
                    }
                }
            ).then(res => {
                if (res.data.status === true) {
                    setStatus({ ...status, sent: new Date() })
                }
            }).catch(err => {
                console.log(err.error);
                toast.error('mail send error')
            })
        } else {
            toast.error('no mail')
        }
    }
    const verifyCode = async () => {
        const { email, code } = status

        if (/\d{6,6}/.test(code) === true) {

            await axios.post(`${process.env.REACT_APP_BASE_URL}`,
                {
                    email: email,
                    code: code,
                    url: '/users/send-verify-code'
                },
                {
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(res => {
                    console.log("res ", res);
                    if (res.data.status === true) {
                        setStatus({ ...status, verified: true })
                    } else if (res.data.status === 'failupdate') {
                        toast.error('server error');
                    } else if (res.data.status === 'nofind') {
                        toast.error('your verification code is invalid.please try again');
                    }
                }).catch(err => {
                    console.log(err.error);
                    toast.error('server error');
                })
        }
    }
    const submit = async () => {
        const { email, code, contents } = status
        if (contents.length === 0) {
            toast.success('please input contents');
            // setStatus({ ...status, error: 'please input contents' })
        }
        await axios.post(`${process.env.REACT_APP_BASE_URL}`,
            {
                contents: contents,
                email: email,
                code: code,
                url: '/users/submit-report'
            },
            {
                headers: {
                    'content-type': 'application/json'
                }
            }).then(res => {
                if (res.data.status === true) {
                    toast.success('success')
                    setStatus({ status, verified: false })
                    props.setReportModal(false);
                } else if (res.data.status === 'clientissue') {
                    toast.error('client issue');
                }
            }).catch(err => {
                console.log(err.error);
            })

    }

    return (

        <div style={{ right: 0, left: 0, top: 0, bottom: 0 }} className='fixed h-full w-full flex justify-center items-center p-4 z-20'>
            <div className="top-0 fixed z-20 w-full left-0 h-full bg-gray-900 bg-opacity-60" style={{ backdropFilter: 'blur(1.2px)' }}></div>

            <div className="proposal lg:left-50-256 w-full flex flex-col dark:bg-gray-800 bg-white rounded-2xl overflow-hidden z-40 border border-white dark:border-gray-600" style={{ maxWidth: '700px' }}>

                <div className="px-6 py-4 border-b dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-gray-700 flex flex-row justify-between items-center">
                    <h4 className="dark:text-white text-gray-800 mb-2 mt-2">Your Opinion</h4>
                    <div className="flex flex-row">
                        <a onClick={() => props.setReportModal(false)} href className="dark:text-primary text-gray-400 hover:bg-gray-300 cursor-pointer rounded-full dark:hover:bg-primary p-1 hover:bg-opacity-20 dark:hover:bg-opacity-20 transition-colors">
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
                        {!status.verified ? (
                            <>
                                <div style={{ position: 'relative' }}>
                                    <input type={'email'} style={{ borderBottom: '1px grey solid', width: '100%', paddingRight: 80 }} placeholder='Your email' value={status.email} onChange={(e) => setStatus({ ...status, email: e.target.value })} className='flex email-input flex1 flex-col p-4 dark:text-gray-100 text-gray-600' />
                                    <button onClick={sendMail} style={{ position: 'absolute', right: 10, top: 5, bottom: 5, color: 'white' }}>Send</button>
                                </div>
                                {status.sent !== 0 && (
                                    <>
                                        <div style={{ position: 'relative' }}>
                                            <input type={'email'} style={{ borderBottom: '1px grey solid', width: '100%', paddingRight: 80 }} placeholder='Your verify code' value={status.code} onChange={(e) => setStatus({ ...status, code: e.target.value })} className='flex email-input flex1 flex-col p-4 dark:text-gray-100 text-gray-600' />
                                            <button onClick={verifyCode} style={{ position: 'absolute', right: 10, top: 5, bottom: 5, color: 'white' }}>Verify</button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col">
                                    {/* <span className="caption rounded-md dark:text-primary text-primary-dark px-2 py-1 bg-primary bg-opacity-20 place-self-start mb-2">Balances &amp; Stakes</span> */}
                                    <textarea value={status.contents} onChange={(e) => setStatus({ ...status, contents: e.target.value })} style={{ resize: 'none' }} rows={9} className='flex flex1 flex-col border-n p-4 dark:text-gray-100 text-gray-600' />
                                </div>
                                <div className="w-full overflow-y-auto max-h-96 dark:text-white text-gray-600">
                                    <div className="px-6 py-4">
                                        <button onClick={submit} className="m-auto flex hover:bg-opacity-100 hover:text-white rounded-lg py-3 px-4 bg-error-bright bg-opacity-20 text-error-bright text-white border border-error-bright transition-colors duration-200 ease-in-out"> Submit </button>
                                    </div>
                                </div>
                            </>
                        )}



                    </div>
                </div>




            </div>
        </div>
    )
}
const linkTagIconClass = 'text-gray-300 hover:opacity-70 dark:hover:opacity-100 dark:text-gray-400 dark:hover:text-white transition-all duration-300 fill-current h-5 w-5';

function Audit() {
    const isDark = useSelector((state) => state.Token.isDark);
    const [reportModal, setReportModal] = useState(false);
    return (
        <div>
            <section className=" h-full mt-16 z-10">
                <div className="mx-auto container px-2 py-2 xs:px-4 xs:py-4 sm:py-6 sm:px-8">
                    <div className={`px-5 mt-6 block duration-75 ease-in-out opacity-100`} style={{ minWidth: '288px' }}>
                        <div className="flex flex-row items-center space-x-3">
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
                    </div>


                    <div className="flex w-full mt-4">
                        <div className="flex xl:flex-row flex-col w-full ">
                            <div className="flex w10">
                                <div className="w-full shadow-smooth rounded-lg bg-white border border-gray-200 dark:border-gray-700 dark:bg-gray-800 text-white h10">
                                    <div className="flex p-4 space-y-3 flex-col justify-between">
                                        <h3>
                                            <span className="flex-none overline text-primary-dark dark:text-primary mauto"> Disclaimer</span>
                                        </h3>

                                        <h4 className="text-gray-800 text-xs md:text-base w-full dark:text-white flex flex-row items-center">
                                            This is a limited report on our findings based on our analysis, in accordance with good industry practice as at the date of this report, in relation to cybersecurity vulnerabilities and issues in the framework and algorithms based on smart contracts, the details of which are set out in this report. In order to get a full view of our analysis, it is crucial for you to read the full report. While we have done our best in conducting our analysis and producing this report, it is important to note that you should not rely on this report and cannot claim against us on the basis of what it says or doesn’t say, or how we produced it, and it is important for you toconduct your own independent investigations before making any decisions.
                                            –please make sure to read it in full
                                        </h4>
                                        <div className="w-full dis-f overflow-y-auto max-h-96 dark:text-white text-gray-600">
                                            <div className='mauto dis-f'>
                                                <a href="https://www.transhumancoin.finance/thcaudit.pdf" target={'_blank'}>
                                                    <button className="ml1 mr1 flex hover:bg-opacity-100 hover:text-white rounded-lg py-3 px-4 bg-error-bright bg-opacity-20 text-error-bright text-white border border-error-bright transition-colors duration-200 ease-in-out"> Audit Page </button>
                                                </a>
                                                <button onClick={() => setReportModal(true)} className="mr1 ml1 flex hover:bg-opacity-100 hover:text-white rounded-lg py-3 px-4 bg-error-bright bg-opacity-20 text-error-bright text-white border border-error-bright transition-colors duration-200 ease-in-out"> &nbsp; &nbsp; Report &nbsp; &nbsp; </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-row items-center space-x-4 border-t border-gray-200 dark:hover:bg-gray-700 dark:hover:bg-opacity-40 dark:border-gray-700 py-4 px-4 transition-all duration-300 hover:bg-gray-200 hover:bg-opacity-30">
                                            <div className="flex justify-between flex-col">
                                                <div className="flex flex-row items-center">
                                                    <a href="https://www.transhumancoin.finance/thcaudit.pdf" target={'_blank'}>
                                                        <h6 className="mr-2 font-semibold dark:text-secondary text-primary-dark">Go to Audit page </h6>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            {reportModal === true
                ? <Report setReportModal={setReportModal} />
                : <></>
            }
        </div>

    )
}
export default Audit;