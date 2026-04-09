import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { filter, isEmpty } from 'lodash';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { showTooltip, moveTooltip, hideTooltip } from '../utils';
import ExperiencesChart from './ExperiencesChart';
import stories from '../data/experiences_dummy.json';

export default function Experiences(props){
    const [currentStory, setCurrentStory] = useState(-1);

    const chartProps = {
        stories: stories,
        currentStory: currentStory,
        setCurrentStory: setCurrentStory
    };

    return (
        <div className='relative colony-main flex flex-col h-full w-full z-30 items-center'>
            <ExperiencesNavBar />
            <div className='relative flex flex-row gap-30 justify-between w-[85vw] h-[70vh] min-h-180 my-8 mx-auto text-white'>
                <div>
                    <ExperiencesChart {...chartProps}/>
                </div>
            </div>
            <div className='absolute flex-1 flex flex-col w-100 h-25 bottom-[10vh]'>
                <div className='relative flex flex-col h-full gap-4 z-20 box-sizing py-5'>
                    <textarea type='text' id='input-story' placeholder='Write your story'></textarea>
                </div>
                <div className='absolute gray-panel w-full h-full top-0 left-0 z-10 text-input' />           
            </div>
            <div className='h-45'></div>
        </div>
    )
}

function ExperiencesNavBar(){
    const leftArrowRef = useRef(null);
    const tooltipRef = useRef(null);

    useEffect(() => {
        d3.select(leftArrowRef.current).select('span')
            .style('transition', 'transform 150ms ease')
        d3.select(leftArrowRef.current)
            .on('mouseover', e => {
                d3.select(leftArrowRef.current).select('span')
                    .style('transform', 'translate(-5px, 0)')
            })
            .on('mouseout', e => {
                d3.select(leftArrowRef.current).select('span')
                    .style('transform', null)
            })
    }, [])

    const paragraph = "(blank)"
    
    return (
        <div className='relative grid grid-cols-3 grid-rows-1 items-center w-full h-25'>
            <div ref={tooltipRef} className='tooltip'></div>
            <div className='justify-self-start flex flex-row gap-5 items-center justify-start z-50'>
                <a href={'/'} ref={leftArrowRef}><span className='relative inline-block'><img src='leftArrow.svg' className='inline h-6 ml-16 mr-3'/></span>Path</a>
                <span className='navbar-divider-left'></span>
                <a href={'/'}><img src='home.svg' style={{height: '20px'}} /></a>
                <img src='info.svg' style={{height: '20px'}} onMouseOver={(e) => showTooltip(e, paragraph, tooltipRef.current)} onMouseOut={(e) => hideTooltip(tooltipRef.current)}/>
            </div> 
            <div>
                <h1 className='colony-title text-center mt-8'>Experiences</h1>
            </div>          
            <div className='justify-self-end flex flex-row justify-end-safe gap-6 z-50'>
                <a href={'/colony'}>Colony of Symptoms</a>
                <a href={'/cluster'}>Symptom Clusters</a>
                <span className='navbar-divider-right'></span>
                <a href={'/'} className='mr-16'>Dear Peri</a>
            </div>               
        </div>       
    )
}
