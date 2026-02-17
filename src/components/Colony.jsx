import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import { filter, isEmpty } from 'lodash';
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import peridata from '../data/peridata.json'
import ColonySymptoms from './ColonySymptoms';
import ColonySelectorDivided from './ColonySelectorDivided';
import ColonySelectorPill from './ColonySelectorPill';
import ColonySilhouette from './ColonySilhouette';

const viewOptions = ['Intensity', 'Less Frequent', 'High Frequency'];
const hormoneOptions = ['Estrogen', 'Progesterone', 'FSH', 'Testosterone'];

export default function Colony(props){
    const viewProps = {
        options: viewOptions
    };

    const hormoneProps = {
        options: hormoneOptions
    };

    const silhouetteProps = {
        peridata: peridata.symptoms.children
    }

    return (
        <div className='colony-main flex flex-col h-full w-full'>
            <div className='flex flex-row items-center justify-center h-25'>
                <h1 className='colony-title'>Colony of Symptoms</h1>
            </div>
            <div className='flex flex-row gap-25 w-[90vw] h-190 my-8 mx-auto text-white'>
                <div className='flex-2 flex flex-col h-full'>
                    <div className='gray-panel flex flex-col h-full gap-4'>
                        <h5 className='filter-header'>Select a Symptom</h5>
                        <ColonySymptoms {...peridata}/>
                        <h5 className='filter-header mt-3'>View</h5>
                        <ColonySelectorDivided {...viewProps}/>
                        <div className='flex flex-row items-center mt-3'>
                            <h5 className='filter-header'>Stage</h5>
                            <ColonySelectorPill />
                        </div>   
                    </div>                 
                </div>
                <div className='h-full'>
                    <ColonySilhouette {...silhouetteProps}/>
                </div>
                <div className='flex-2 flex flex-col h-full'>
                    <div className='gray-panel flex-2 flex flex-col h-full gap-4'>
                        <h5 className='filter-header'>Hormones</h5>
                        <ColonySelectorDivided {...hormoneProps}/>
                        <h5 className='filter-header'>Age</h5>
                    </div>
                    <div className='flex-1 m-5'>
                        This visualization maps the range of symptoms experienced during this stage. The panel on the right lists symptoms identified through analysis of 38,900 comments from online community discussions on Reddit, ordered by frequency. On the left, the panel shows how low/high hormones results to symptoms and age range observed in the dataset.
                    </div>
                </div>
            </div>
        </div>
    )
}