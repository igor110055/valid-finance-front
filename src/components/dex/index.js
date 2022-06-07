

import '../../assets/css/dex.css';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { AiTwotoneCopy } from "react-icons/ai";

function Dex() {
    const [isLoading, setIsLoading] = useState(true);
    const [THCaddress, setTHCaddress] = useState('0x56083560594e314b5cdd1680ec6a493bb851bbd8');
    const isDark = useSelector((state) => state.Token.isDark);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000)
    }, [])

    // Copy Button
    const [copyStatus, setCopyStatus] = useState('Copy');

    function copyToClipboard() {

        const tempInput = document.createElement('input')
        tempInput.value = '0x56083560594e314b5cdd1680ec6a493bb851bbd8';
        window.document.body.appendChild(tempInput)
        tempInput.select()
        document.execCommand('copy')
        document.body.removeChild(tempInput)
        setCopyStatus('Copied!');
        setTimeout(() => {
            setCopyStatus('Copy');
        }, 2000)
    };

    return (
        <>
            <div className={isLoading ? '' : 'dis-n'}>
                <Box sx={{ display: 'flex', justifyContent: 'center', position: 'relative', top: window.innerHeight / 2 - 50 }}>
                    <CircularProgress />
                </Box >
            </div>
            <div className={`margin ${isLoading ? 'opa0' : 'opa1'}`}>
                <div className='iframe-border'>
                    {isDark
                        ?
                        <iframe className={`bogged-dex`} id="aggregater" src="https://app.bogged.finance/bsc/swap?chain=bsc&amp;tokenIn=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&amp;tokenOut=0x56083560594e314b5cdd1680ec6a493bb851bbd8&amp;embed=1&amp;theme=dark"></iframe>
                        :
                        <iframe className={`bogged-dex`} id="aggregater" src="https://app.bogged.finance/bsc/swap?chain=bsc&amp;tokenIn=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&amp;tokenOut=0x56083560594e314b5cdd1680ec6a493bb851bbd8&amp;embed=1&amp;theme=light"></iframe>
                    }
                    {/* <iframe className="bogged-dex" id="aggregater" src="https://app.bogged.finance/bsc/swap?chain=bsc&amp;tokenIn=0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c&amp;tokenOut=0x56083560594e314b5cdd1680ec6a493bb851bbd8&amp;embed=1&amp;theme=dark"></iframe> */}
                    <div className='for-iframe-top'>
                        <h3>TRANSHUMAN COIN Swap Dex Aggregator</h3>
                    </div>
                    <div className='for-iframe-bottom'>
                        <h4>Very fast and user-friendly Swap</h4>
                        <span className='justify' style={{ fontSize: '13px' }}>TRANSHUMAN COIN ADDRESS :
                            <span style={{ color: '#1bc870' }}>
                                {THCaddress.slice(0, 5)}
                                ....
                                {THCaddress.slice(THCaddress.length - 5, THCaddress.length)}
                            </span>
                            &nbsp;&nbsp;&nbsp;
                            <div onClick={copyToClipboard} className='tooltip'>
                                <span className="tooltiptext">{copyStatus}</span>
                                <AiTwotoneCopy className='cu-co w-5 h-5 flex-shrink-0 fill-current text-primary-dark dark:text-primary' />
                            </div>
                        </span>
                        {/* <div>
                            {
                                window.document.queryCommandSupported('copy') &&
                                <div>
                                </div>
                            }
                        </div> */}
                    </div>
                </div>


            </div>

        </>

    )
}
export default Dex;