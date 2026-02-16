import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";

export default function ColonySelectorPill(props){
    const containerRef = useRef(null);

    useEffect(() => {
        const container = d3.select(containerRef.current);
        container.selectAll('.pill-option')
            .on('click', e => {
                container.selectAll('.pill-option')
                    .classed('pill-option-selected', false);
                d3.select(e.currentTarget)
                    .classed('pill-option-selected', true);
            })
    }, []);

    return (
        <div ref={containerRef} className='flex flex-row mx-auto border-2 border-white rounded-lg'>
            <div className='pill-option px-4 py-1 rounded-l-lg'>Early</div>
            <span className='h-7 border-1'></span>
            <div className='pill-option px-4 py-1 rounded-r-lg'>Late</div>
        </div>
    )
}