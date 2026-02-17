import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import { useResizeObserver, useDebounceCallback } from 'usehooks-ts';

export default function ColonySilhouette(props){
    const svgRef = useRef(null);
    const tooltipRef = useRef(null);

    const [size, setSize] = useState({ width: 0, height: 0 });
    const onResize = useDebounceCallback((size) => setSize(size), 200);
    useResizeObserver({ ref: svgRef, onResize });

    let data = [];
    for (const category of props.peridata){
        for (const symptom of category.children){
            data.push({...symptom, category: category, color: category.color});
        }
    }

    useEffect(() => {
        if(data.length === 0) return;
        if(size.width === 0 || size.height === 0) return;
        plotPoints(svgRef.current, tooltipRef.current, data, size);
    }, [size]);

    return (
        <div className='silhouette relative h-full aspect-[1241/1754] mx-auto'>
            <div ref={tooltipRef} className='absolute -left-20 w-1/3'>hi</div>
            <svg ref={svgRef} width='100%' height='100%'></svg>
        </div>
    )
}

function plotPoints(svgElement, tooltipElement, data, size){
    const svg = d3.select(svgElement)
    svg.selectAll('circle')
        .data(data.filter(d => filterSymptoms(d, null)), d => d.name)
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
                            .text(d.hovertext !== "" ? d.hovertext : d.name)
                    })
                
                circles.transition()
                    .duration(200)
                    .attr('r', 5)
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
            }
        );
}

function filterSymptoms(d, filters){
    return true;
}