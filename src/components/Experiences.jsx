import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { filter, isEmpty } from 'lodash';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import { showTooltip, moveTooltip, hideTooltip } from '../utils';
import ClusterChart from './ClusterChart';
import ClusterSilhouette from './ClusterSilhouette';
import ClusterSymptoms from './ClusterSymptoms';
import ExperiencesChart from './ExperiencesChart';


export default function Experiences(props){

    function clearFilters(){

    }

    return (
        <div className='relative colony-main flex flex-col h-full w-full z-30'>
            <ExperiencesNavBar />
            <div className='flex flex-row gap-30 justify-between w-[85vw] h-[75vh] min-h-190 my-8 mx-auto text-white'>
                <div className='relative flex-1 flex flex-col h-7/10 max-w-[20vw]'>
                    <div className='gray-panel-content relative flex flex-col h-full gap-4 z-20'>
                        <h5 className='filter-header'>Select an Experience</h5>                  
                    </div>
                    <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />           
                </div>
                <div className='flex-1 h-full'>
                    <div className='w-full aspect-3/2'>
                        <ExperiencesChart />
                    </div>                   
                </div>
                <div className='flex-1 flex flex-col h-full max-w-[17vw]'>
                    
                </div>
            </div>
            <div className='h-25'></div>
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
                <span className='inline border-gray-400 border-1 h-5'></span>
                <a href={'/'}><img src='home.svg' style={{height: '20px'}} /></a>
                <img src='info.svg' style={{height: '20px'}} onMouseOver={(e) => showTooltip(e, paragraph, tooltipRef.current)} onMouseOut={(e) => hideTooltip(tooltipRef.current)}/>
            </div> 
            <div>
                <h1 className='colony-title text-center mt-8'>Experiences</h1>
            </div>          
            <div className='justify-self-end flex flex-row justify-end-safe gap-6 z-50'>
                <a href={'/colony'}>Colony of Symptoms</a>
                <a href={'/cluster'}>Symptom Clusters</a>
                <span className='inline border-gray-400 border-1 h-5'></span>
                <a href={'/'} className='mr-16'>Dear Peri</a>
            </div>               
        </div>       
    )
}
