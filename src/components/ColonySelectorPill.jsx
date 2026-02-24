import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";

export default function ColonySelectorPill(props){
    const containerRef = useRef(null);

    // useEffect(() => {
    //     const container = d3.select(containerRef.current);
    //     container.selectAll('.pill-option')
    //         .on('click', e => {
    //             container.selectAll('.pill-option')
    //                 .classed('pill-option-selected', false);
    //             d3.select(e.currentTarget)
    //                 .classed('pill-option-selected', true);
    //         })
    // }, []);

    function selectOption(e, option){
        const container = d3.select(containerRef.current);
        container.selectAll('.pill-option')
            .classed('pill-option-selected', false);
        if(props.currentOption !== option){
            d3.select(e.currentTarget)
                .classed('pill-option-selected', true);
            props.setCurrentOption(option);
        } else {
            props.setCurrentOption('');
        }
    }

    return (
        <div ref={containerRef} className='flex flex-row mx-auto border-2 border-white rounded-lg'>
            {props.options.map((option, index) => {
                if(index === 0){
                    return (
                        <Fragment key={index}>
                            <div onClick={(e) => selectOption(e, option)} className='pill-option px-4 py-1 rounded-l-lg'>{option}</div>
                            <span className='h-7 border-1'></span>
                        </Fragment>
                    )
                } else if (index === props.options.length - 1){
                    return <div key={index} onClick={(e) => selectOption(e, option)} className='pill-option px-4 py-1 rounded-r-lg'>{option}</div>
                } else {
                    return (
                        <Fragment key={index}>
                            <div onClick={(e) => selectOption(e, option)} className='pill-option px-4 py-1'>{option}</div>
                            <span className='h-7 border-1'></span>
                        </Fragment>
                    )
                }
            })}          
        </div>
    )
}