import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";

export default function ColonySelectorDivided(props){
    const containerRef = useRef(null);

    useEffect(() => {
        const container = d3.select(containerRef.current);
        container.selectAll('.divided-option')
            .on('click', (e) => {
                container.selectAll('.divided-option')
                    .classed('divided-option-selected', false);
                d3.select(e.currentTarget)
                    .classed('divided-option-selected', true)
            })
    }, []);

    return (
        <div ref={containerRef} className='flex flex-row h-8 items-center justify-center text-center'>
            {props.options.map((option, index) => {
                if(index === props.options.length - 1){
                    return (
                        <div key={index} className='divided-option mx-1 px-2 py-1'>{option}</div>
                    )
                } else {
                    return (
                        <Fragment key={index}>
                            <div className='divided-option mx-1 px-2 py-1'>{option}</div>
                            <span className='border-gray-400 border-1 h-8'></span>
                        </Fragment>
                    )
                }               
            })}
        </div>
    )
}
