import { useState, useEffect, useRef, Fragment } from 'react';
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';
import filterdata from '../data/filterData.json'

export default function ColonySilhouette(props){
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    // Adjust circles on resize
    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    // Create array for drawing
    let data = [];
    for (const category of props.peridata){
        for (const symptom of category.children){
            data.push({...symptom, category: category.name, color: category.color});
        }
    }

    // Define filter functions
    function categoryFilter(d){
        if(props.currentCategory !== ''){
            return props.currentCategory === d.category;
        } else {
            return true
        }
    }

    function viewFilter(d){
        if(filterdata[props.currentView]) return filterdata[props.currentView].includes(d.name);
        return true;
    }
    
    function stageFilter(d){
        if(filterdata[props.currentStage]) return filterdata[props.currentStage].includes(d.name);
        return true;
    }

    const filters = [categoryFilter, viewFilter, stageFilter];

    useEffect(() => {
        if(data.length === 0) return;
        if(size.width === 0 || size.height === 0) return;
        plotPoints(svgRef.current, tooltipRef.current, data, filters, size);
    }, [size, props.currentCategory, props.currentView, props.currentStage]);

    return (
        <div className='silhouette relative h-full aspect-[1241/1754] mx-auto'>
            <div ref={tooltipRef} id='colony-tooltip' className='fixed w-100 text-sm p-2 rounded-md'></div>
            <svg ref={svgRef} width='100%' height='100%'></svg>
        </div>
    )
}

function plotPoints(svgElement, tooltipElement, data, filters, size){
    const svg = d3.select(svgElement)
    svg.selectAll('circle')
        // d => d.name is the identifier for enter/update/exit
        .data(data.filter(d => filterSymptoms(d, filters)), d => d.name)
        .join(
            function(enter){
                const circles = enter.append('circle')
                    .attr('cx', d => d.x * size.width)
                    .attr('cy', d => d.y * size.height)
                    .attr('r', 0)
                    .attr('fill', d => d.color)
                    .style('cursor', 'pointer')
                    .on('mouseover', function(e, d) {
                        d3.select(tooltipElement)
                            .html(getTooltipHtml(d))
                            .style('left', `${e.clientX - 200}px`)
                            .style('top', `${e.clientY + 20}px`)
                            .transition()
                            .duration(150)
                            .style('opacity', 1)
                        d3.select(this)
                            .transition()
                            .duration(150)
                            .attr('stroke', 'black')
                            .attr('stroke-width', 2)
                    })
                    .on('mousemove', function(e) {
                        d3.select(tooltipElement)
                            .style('left', `${e.clientX - 200}px`)
                            .style('top', `${e.clientY + 20}px`)
                    })
                    .on('mouseout', function(e) {
                        d3.select(tooltipElement)
                            .transition()
                            .duration(150)
                            .style('opacity', 0)
                        d3.select(this)
                            .transition()
                            .duration(150)
                            .attr('stroke-width', 0)
                    })
                
                circles.transition()
                    .duration(200)
                    .attr('r', 6)
            },
            function(update){
                update
                    .transition()
                    .duration(200)
                    .attr('cx', d => d.x * size.width)
                    .attr('cy', d => d.y * size.height)
            },
            function(exit){
                exit
                    .transition()
                    .duration(200)
                    .attr('r', 0)
                    .remove()
            }
        );
}

function filterSymptoms(d, filters){
    let result = true;
    for(const f of filters){
        result &= f(d);
    }
    return result;
}

function getTooltipHtml(d){
    if(d.hovertext !== ""){
        return (
                `<h5 class='text-lg font-semibold'>${d.name}</h5>
                <br />
                <p>${d.hovertext}</p>`
        )
    } else {
        return `<h5 class='text-lg font-semibold'>${d.name}</h5>`
    }
}