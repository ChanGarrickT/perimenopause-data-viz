import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import peridata from '../data/peridata.json';
import colorMap from '../data/colorMap.json';

export default function ClusterSymptoms(props){
    const scrollRef = useRef(null);

    const handleWheel = (e) => {
        // For whatever reason, the div won't scroll without this
        scrollRef.current.scrollTop += e.deltaY;
    };

    return (
        <div ref={scrollRef} onWheel={handleWheel} className='w-full h-full overflow-y-auto z-70' tabIndex={0}>
            {peridata.symptoms.children.map((category, i1) => {
                return (
                    <Accordion key={i1} sx={{color: 'white', backgroundColor: '#0008'}}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{color: 'white'}}/>}>
                            <span style={{color: colorMap[category.name], marginRight: 12}}>⬤</span>{category.name}
                        </AccordionSummary>
                        {category.children.map((symptom, i2) => {
                            return <AccordionDetails key={i2}>{symptom.name}</AccordionDetails>
                        })}
                    </Accordion>
                )
            })}            
        </div>
    )
}
