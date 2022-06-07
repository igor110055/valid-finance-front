import ads1 from '../../src/assets/ads/1.webp';
import ads2 from '../../src/assets/ads/2.webp';
import ads3 from '../../src/assets/ads/3.webp';
import ads4 from '../../src/assets/ads/4.webp';
import ads5 from '../../src/assets/ads/5.gif';
import ads6 from '../../src/assets/ads/6.webp';

import ads1_m from '../../src/assets/ads/1-m.webp';
import ads2_m from '../../src/assets/ads/2-m.webp';
import ads3_m from '../../src/assets/ads/3-m.webp';
import ads4_m from '../../src/assets/ads/4-m.webp';
import ads5_m from '../../src/assets/ads/5-m.gif';
import ads6_m from '../../src/assets/ads/6-m.webp';

import { useEffect, useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import {
    BrowserView,
    MobileView,
} from "react-device-detect";

function Layout(props) {
    const [currentSlideNumner, setCurrentSlideNumner] = useState(0);
    const [totalBabyMana, setTotalBabyMana] = useState(3);

    return (
        <div className='flex fixed w-screen h-full dark:bg-gray-900 bg-background'>
            <div className=" flex relative pt-16 h-full">
                <Sidebar />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="left-0 absolute w-screen z-10 h-16">
                    <Header />
                </div>

                <div className='for-desktop w-full relative left-0 top-16' style={{ width: '100%', height: '121px', borderBottom: '1px grey solid' }}>
                    <CarouselProvider
                        naturalSlideWidth={100}
                        naturalSlideHeight={120}
                        totalSlides={5}
                        currentSlide={0}
                        touchEnabled={false}
                        dragEnabled={false}
                        interval={7000}
                        isPlaying={true}
                        playDirection={'forward'}
                    >
                        <Slider style={{ width: '100%', height: '120px' }}>
                            <Slide index={0} >
                                <img draggable={false} alt='' src={ads1} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={1} >
                                <img draggable={false} alt='' src={ads2} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={2} >
                                <img draggable={false} alt='' src={ads3} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={3} >
                                <img draggable={false} alt='' src={ads4} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={4} >
                                <img draggable={false} alt='' src={ads5} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={5} >
                                <img draggable={false} alt='' src={ads6} width='100%' style={{ height: '120px' }}></img>
                            </Slide>

                        </Slider>
                    </CarouselProvider>

                    {/* <h3 className='white'>Space for Advertising Banner</h3> */}
                </div>
                <div className='for-mobile w-full relative left-0 top-16' style={{ width: '100%', height: '121px', borderBottom: '1px grey solid' }}>
                    <CarouselProvider
                        naturalSlideWidth={100}
                        naturalSlideHeight={120}
                        totalSlides={5}
                        currentSlide={0}
                        touchEnabled={false}
                        dragEnabled={false}
                        interval={10000}
                        isPlaying={true}
                        playDirection={'forward'}
                    >
                        <Slider style={{ width: '100%', height: '120px' }}>
                            <Slide index={0} >
                                <img draggable={false} alt='' src={ads1_m} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={1} >
                                <img draggable={false} alt='' src={ads2_m} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={2} >
                                <img draggable={false} alt='' src={ads3_m} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={3} >
                                <img draggable={false} alt='' src={ads4_m} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={4} >
                                <img draggable={false} alt='' src={ads5_m} width='100%' style={{ height: '120px' }}></img>
                            </Slide>
                            <Slide index={5} >
                                <img draggable={false} alt='' src={ads6_m} width='100%' style={{ height: '120px' }}></img>
                            </Slide>

                        </Slider>
                    </CarouselProvider>

                    {/* <h3 className='white'>Space for Advertising Banner</h3> */}
                </div>

                <main style={{ overflow: 'auto auto' }} className=" h-full mt-16 z-index8">
                    {props.children}
                </main>
            </div>
        </div>
    )
}
export default Layout;