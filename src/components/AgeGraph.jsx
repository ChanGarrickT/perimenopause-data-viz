import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const ageData = [
  { age: "26–29", value: 100 },
  { age: "30–34", value: 400 },
  { age: "35–40", value: 1000 },
  { age: "41–45", value: 2000 },
  { age: "46–50", value: 200 },
];

function AgeGraph() {
  const svgRef = useRef();

  useEffect(() => {
    const width = 260;
    const height = 140;
    const margin = { top: 30, right: 20, bottom: 30, left: 20 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // ---------------- scales ----------------
    const x = d3
      .scalePoint()
      .domain(ageData.map(d => d.age))
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(ageData, d => d.value)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // ---------------- baseline ----------------
    svg.append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", height - margin.bottom)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#fbf9f9");

    // ---------------- curve ----------------
    const line = d3.line()
      .x(d => x(d.age))
      .y(d => y(d.value))
      .curve(d3.curveCatmullRom.alpha(0.6));

    svg.append("path")
      .datum(ageData)
      .attr("fill", "none")
      .attr("stroke", "#fcf9f9")
      .attr("stroke-width", 4)
      .attr("d", line);

    // ---------------- hover line ----------------
    const hoverLine = svg.append("line")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("stroke", "#f6f4f4")
      .attr("stroke-dasharray", "4 4")
      .attr("stroke-width",3)
      .style("opacity", 0);

    // ---------------- hover label ----------------
    const hoverLabel = svg.append("text")
      .attr("y", margin.top - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#f6f5f5")
      .style("opacity", 0);

    // ---------------- interaction overlay ----------------
    svg.append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);

        // find closest age bucket
        const closest = ageData.reduce((a, b) =>
          Math.abs(x(a.age) - mouseX) <
          Math.abs(x(b.age) - mouseX)
            ? a
            : b
        );

        const cx = x(closest.age);

        hoverLine
          .attr("x1", cx)
          .attr("x2", cx)
          .style("opacity", 1);

        hoverLabel
          .attr("x", cx)
          .text(closest.age)
          .style("opacity", 1);
      })
      .on("mouseleave", () => {
        hoverLine.style("opacity", 0);
        hoverLabel.style("opacity", 0);
      });

  }, []);

  return (
    <div className="age-panel mx-auto">
      <svg ref={svgRef} width={260} height={140} />
    </div>
  );
}

export default AgeGraph;