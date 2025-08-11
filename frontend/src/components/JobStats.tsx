import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import { JobStats } from "../types/job";

interface JobStatsProps {
  stats: JobStats;
}

interface SankeyNode {
  name: string;
  id: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
}

export function JobStatsComponent({ stats }: JobStatsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate container dimensions for Sankey
    const width = 1100; // Container width minus padding
    const height = 280; // Height for sankey section (larger)

    // Create nodes representing job application stages
    const nodes: SankeyNode[] = [
      { name: "Applications", id: 0 },
      { name: "Applied", id: 1 },
      { name: "Interview Scheduled", id: 2 },
      { name: "Interview Completed", id: 3 },
      { name: "Offer Received", id: 4 },
      { name: "Rejected", id: 5 },
      { name: "Withdrawn", id: 6 },
      { name: "No Response", id: 7 },
    ];

    // Create links representing the flow between stages
    const totalApps = stats.total || 5;
    const applied = stats.applied || 2;
    const interviewing = stats.interviewing || 1;
    const offered = stats.offered || 1;
    const rejected = stats.rejected || 1;

    const links: SankeyLink[] = [
      { source: 0, target: 1, value: applied },
      { source: 1, target: 2, value: interviewing },
      { source: 2, target: 3, value: Math.max(interviewing, 1) },
      { source: 3, target: 4, value: offered },
      { source: 1, target: 5, value: Math.max(rejected, 1) },
      { source: 2, target: 5, value: Math.max(1, Math.floor(rejected * 0.3)) },
      { source: 1, target: 6, value: Math.max(1, Math.floor(applied * 0.1)) },
      {
        source: 1,
        target: 7,
        value: Math.max(
          1,
          totalApps - applied - interviewing - offered - rejected
        ),
      },
    ].filter((link) => link.value > 0);

    // Create sankey generator
    const margin = { top: 20, right: 30, bottom: 30, left: 30 };
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeWidth(15)
      .nodePadding(25)
      .extent([
        [margin.left, margin.top],
        [width - margin.right, height - margin.bottom],
      ]);

    // Generate the sankey layout
    const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator({
      nodes: nodes.map((d) => ({ ...d })),
      links: links.map((d) => ({ ...d })),
    });

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .style("max-width", "100%")
      .style("height", "auto");

    // Color scheme
    const colorScale = d3
      .scaleOrdinal()
      .domain(nodes.map((d) => d.name))
      .range([
        "#e3f2fd", // Applications - light blue
        "#2196f3", // Applied - blue
        "#ff9800", // Interview Scheduled - orange
        "#9c27b0", // Interview Completed - purple
        "#4caf50", // Offer Received - green
        "#f44336", // Rejected - red
        "#757575", // Withdrawn - gray
        "#ffc107", // No Response - yellow
      ]);

    // Add links
    svg
      .append("g")
      .selectAll("path")
      .data(sankeyLinks)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d) => colorScale((d.source as any).name) as string)
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", (d) => Math.max(1, (d as any).width || 0))
      .attr("fill", "none")
      .style("mix-blend-mode", "multiply");

    // Add nodes
    const nodeGroup = svg
      .append("g")
      .selectAll("g")
      .data(sankeyNodes)
      .join("g");

    nodeGroup
      .append("rect")
      .attr("x", (d) => d.x0 || 0)
      .attr("y", (d) => d.y0 || 0)
      .attr("height", (d) => Math.max(1, (d.y1 || 0) - (d.y0 || 0)))
      .attr("width", (d) => Math.max(1, (d.x1 || 0) - (d.x0 || 0)))
      .attr("fill", (d) => colorScale(d.name) as string)
      .attr("stroke", "none");

    // Add node labels
    nodeGroup
      .append("text")
      .attr("x", (d) =>
        (d.x0 || 0) < width / 2 ? (d.x1 || 0) + 6 : (d.x0 || 0) - 6
      )
      .attr("y", (d) => ((d.y1 || 0) + (d.y0 || 0)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", (d) => ((d.x0 || 0) < width / 2 ? "start" : "end"))
      .style("font", "11px 'Onest', sans-serif")
      .style("fill", "#333")
      .text((d) => `${d.name} (${d.value || 0})`);
  }, [stats]);

  return (
    <div className="h-full p-6 flex flex-col">
      {/* Top Statistics Cards with spacing - Smaller */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg border">
          <div className="text-xl font-bold text-blue-600">
            {stats.total || 0}
          </div>
          <div className="text-xs text-blue-600">Total Applications</div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg border">
          <div className="text-xl font-bold text-yellow-600">
            {stats.applied || 0}
          </div>
          <div className="text-xs text-yellow-600">Applied</div>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg border">
          <div className="text-xl font-bold text-purple-600">
            {stats.interviewing || 0}
          </div>
          <div className="text-xs text-purple-600">Interviewing</div>
        </div>

        <div className="bg-green-50 p-3 rounded-lg border">
          <div className="text-xl font-bold text-green-600">
            {stats.offered || 0}
          </div>
          <div className="text-xs text-green-600">Offers</div>
        </div>
      </div>

      {/* Sankey Diagram Section - Larger */}
      <div className="bg-white p-6 rounded-lg flex-1">
        <h4 className="text-md font-medium mb-4 text-center">
          Application Status Distribution
        </h4>
        <div className="h-80">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </div>
    </div>
  );
}
