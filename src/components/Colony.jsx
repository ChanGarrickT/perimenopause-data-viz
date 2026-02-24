import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { filter, isEmpty } from 'lodash';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import peridata from '../data/peridata.json'
import ColonySymptoms from './ColonySymptoms';
import ColonySelectorDivided from './ColonySelectorDivided';
import ColonySelectorPill from './ColonySelectorPill';
import ColonySilhouette from './ColonySilhouette';
import { NavLink } from 'react-router-dom';

const viewOptions = ['Intense', 'Less Frequent', 'High Frequency'];
const hormoneOptions = ['Estrogen', 'Progesterone', 'FSH', 'Testosterone'];

export default function Colony(props){
    const [currentCategory, setCurrentCategory] = useState('');
    const [currentView, setCurrentView] = useState('');
    const [currentStage, setCurrentStage] = useState('');
    const [currentHormone, setCurrentHormone] = useState('');

    const symptomsProps = {
        peridata: peridata.symptoms.children,
        currentCategory: currentCategory,
        setCurrentCategory: setCurrentCategory
    }

    const viewProps = {
        options: viewOptions,
        currentOption: currentView,
        setCurrentOption: setCurrentView     
    };

    const stageProps = {
        options: ['Early', 'Late'],
        currentOption: currentStage,
        setCurrentOption: setCurrentStage,
    }

    const hormoneProps = {
        options: hormoneOptions,
        currentOption: currentHormone,
        setCurrentOption: setCurrentHormone  
    };

    const silhouetteProps = {
        peridata: peridata.symptoms.children,
        currentCategory: currentCategory,
        currentView: currentView,
        currentStage: currentStage,
    }

    return (
        <div className='relative colony-main flex flex-col h-full w-full z-30'>
            <ColonyNavBar />
            <div className='flex flex-row gap-25 justify-between w-[90vw] h-[75vh] min-h-190 my-8 mx-auto text-white'>
                <div className='relative flex-2 flex flex-col h-full max-w-[25vw]'>
                    <div className='gray-panel-content flex flex-col h-full gap-4 z-20'>
                        <h5 className='filter-header'>Select a Symptom</h5>
                        <ColonySymptoms {...symptomsProps}/>
                        <h5 className='filter-header mt-3'>View</h5>
                        <ColonySelectorDivided {...viewProps}/>
                        <div className='flex flex-row items-center mt-3'>
                            <h5 className='filter-header'>Stage</h5>
                            <ColonySelectorPill {...stageProps}/>
                        </div> 
                    </div>
                    <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />           
                </div>
                <div className='h-full'>
                    <ColonySilhouette {...silhouetteProps}/>
                </div>
                <div className='flex-2 flex flex-col h-full max-w-[25vw]'>
                    <div className='relative flex-2 h-full'>
                        <div className='gray-panel-content relative flex flex-col h-full gap-4 z-20'>
                            <h5 className='filter-header'>Hormones</h5>
                            <ColonySelectorDivided {...hormoneProps}/>
                            <h5 className='filter-header'>Age</h5>
                        </div>
                        <div className='absolute gray-panel w-full h-full top-0 left-0 z-10' />
                    </div>
                    <div className='flex-1 m-5'>
                        This visualization maps the range of symptoms experienced during this stage. The panel on the right lists symptoms identified through analysis of 38,900 comments from online community discussions on Reddit, ordered by frequency. On the left, the panel shows how low/high hormones results to symptoms and age range observed in the dataset.
                    </div>
                </div>
            </div>
            <div className='h-25'></div>
        </div>
    )
}

function ColonyNavBar(){
    const leftArrowRef = useRef(null);

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

    return (
        <Fragment>
        <div className='absolute w-full pointer-events-none'>
            <img src='navbar_ornament.svg' className='mx-auto mt-12'/>
        </div>
        <div className='flex flex-row items-center justify-between w-[95vw] h-25 mx-auto'>
            <div className='flex-1 flex flex-row items-center justify-start mt-13'>
                <a href={'/'} ref={leftArrowRef}><span className='relative inline-block'><img src='leftArrow.svg' className='inline h-6 mr-3'/></span>Home</a>
                <a href={'/'} className='blue-button'>Symptom Cluster</a>
            </div>
            <h1 className='flex-1 colony-title text-center'>Colony of Symptoms</h1>
            <div className='flex-1 flex flex-row justify-end-safe gap-10 mt-13'>
                <a href={'/'}>Tides</a>
                <a href={'/'}>Bearing</a>
                <a href={'/'}>Dear Peri</a>
            </div>               
        </div>       
        </Fragment>
    )
}
