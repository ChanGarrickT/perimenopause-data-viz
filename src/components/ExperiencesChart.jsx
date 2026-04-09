import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import './Experiences.css';

export default function ExperiencesChart(props){
    const containerRef = useRef(null);
    const storiesBBox = useRef(null);
    const movingGrp = useRef(null);
    const focusRef = useRef(null);
    const currentStoryRef = useRef(-1);
    const translateZRef = useRef(0);
    const touchYRef = useRef(0);

    useEffect(() => {
        const container = d3.select(movingGrp.current)
        // container.selectAll('*').remove();

        container.selectChildren('div')
            .data(props.stories, s => s.id)
            .join(
                function(enter){
                    const storyContainer = enter.append('div')
                        .classed('story-container', true)
                        .style('transform-style', 'preserve-3d');

                    storyContainer.append('p')
                        .text(s => s.text);

                    storyContainer
                        .style('left', s => `${s.x}%`)
                        .style('top', s => `${s.y}%`)
                        .style('z-index', s => 1000 - s.z)
                        .style('transform', s => `translate3d(-50%, -50%, ${-100 * s.z}px)`)
                        .attr('opacity', 0)
                        .on('click', function(e, s){
                            // Enable X button
                            d3.select('.focus-x')
                                .style('pointer-events', 'auto')
                            // Blur the background and disable pointer events
                            d3.selectAll('.story-container')
                                .style('filter', 'blur(10px)')
                                .style('pointer-events', 'none')
                            const focusBox = d3.select(focusRef.current);
                            focusBox.selectChild('p')
                                .text(s.text);
                            focusBox.style('opacity', 1);
                            props.setCurrentStory(s.id);
                        })
                    
                    storyContainer
                        .transition()
                        .duration(2000)
                        .delay(() => 500 * Math.random())
                        .attr('opacity', s => s.z + translateZRef.current > 200 || s.z + translateZRef.current < -600 ? 0 : 1)
                },
                update => update,
                exit => exit
            )
    }, [props.stories]);

    useEffect(() => {
        currentStoryRef.current = props.currentStory;
    }, [props.currentStory])

    function trackTouch(e){
        touchYRef.current = e.touches[0].clientY;
    }

    function handleScroll(e){
        // Disable clicking when a story is focused
        if(currentStoryRef.current !== -1) return;
        let zChange = 0;
        if(e.type === 'wheel'){
            if(e.deltaY != 0){
                zChange = Math.max(-500, translateZRef.current - e.deltaY * 0.2);
            } else {
                return;
            }
        } else if(e.type === 'touchmove'){
            const delta = e.touches[0].clientY - touchYRef.current;
            zChange = Math.max(0, translateZRef.current + delta * 0.2)
        }
        translateZRef.current = zChange;
        d3.select(movingGrp.current)
            .style('transform', `translateZ(${zChange}px)`)
        d3.select(movingGrp.current).selectChildren('div')
            .classed('story-hidden', function(){return showHideStory(this, zChange)})
    }

    function closeFocus(){
        d3.select('.focus-x')
            .style('pointer-events', 'none')
        d3.select(focusRef.current)
            .style('opacity', 0);
        // Reenable clicking
        d3.selectAll('.story-container')
            .style('filter', 'none')
            .style('pointer-events', 'auto')
        props.setCurrentStory(-1);
    }

    return (
        <div ref={containerRef} onWheel={(e) => handleScroll(e)} onTouchStart={(e) => trackTouch(e)} onTouchMove={(e) => handleScroll(e)} className='absolute w-full h-full overflow-hidden'>
            <div ref={storiesBBox} className='w-full h-full perspective-normal perspective-origin-center pointer-events-none'>
                <div ref={movingGrp} className='w-full h-full transform-3d pointer-events-none'></div>
            </div>
            <div ref={focusRef} className='focus-story pointer-events-none'>
                <p>H</p>
                <div className='focus-x pointer-events-auto cursor-pointer' onClick={closeFocus}>×</div>
            </div>
        </div>
    )
}

function showHideStory(element, zChange){
    // Get the computed style of the current element
    const style = window.getComputedStyle(element);
    const transform = style.transform;

    // If no transform is applied, it returns 'none'
    if (!transform || transform === 'none') return false;

    // 3D transforms appear as 'matrix3d(...)'
    if (transform.startsWith('matrix3d')) {
        const values = transform.split('(')[1].split(')')[0].split(',');
        // The 15th value (index 14) in a 4x4 matrix3d is translateZ
        const zValue = parseFloat(values[14]);
        return zValue + zChange > 200 || zValue + zChange < -600;
    }

    // If it's a 2D matrix, translateZ is effectively 0
    return false;   
}
