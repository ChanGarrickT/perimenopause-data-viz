import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";

export default function ColonySymptoms(props){
    // Used to calculate bar width
    let maxCount = 0;
    for(const entry of props.peridata){
        maxCount = Math.max(maxCount, entry.value);
    }

    return (
        <div className='flex flex-col h-1/2 px-4'>
            {
                props.peridata.map((category, index) => {
                    const chartRowsProps = {
                        index: index,
                        text: category.name,
                        width: category.value / maxCount,
                        color: category.color,
                        currentCategory: props.currentCategory,
                        setCurrentCategory: props.setCurrentCategory,
                        peridata: props.peridata
                    };
                    return <ChartRow key={index} {...chartRowsProps} />
                })
            }
        </div>
    )
}

function ChartRow(props){
    const barRef = useRef(null);

    useEffect(() => {
        d3.select(barRef.current)
            .style('background-color', function(){
                if(props.currentCategory === '') return props.color;
                else return props.currentCategory === props.text ? props.color : 'white'
            })
    }, [props.currentCategory])

    function selectCategory(option){
        props.setCurrentCategory((prev) => option === prev ? '' : option)
    }

    return (
        <div onClick={() => selectCategory(props.text)} key={props.index} className='flex-1 flex flex-row items-center gap-3'>
            <div className='chart-text flex-2 text-white'>{props.text}</div>
            <div className='flex-3'>
                <div ref={barRef} className={`chart-bar rounded-sm h-6 text-[#00000000]`} style={{width: `${props.width * 100}%`, backgroundColor: props.color}}>A</div>
            </div>
        </div>
    )
}