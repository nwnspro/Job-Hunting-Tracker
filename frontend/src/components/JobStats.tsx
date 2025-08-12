import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";
import { ShareMenu } from "./ShareMenu";
import { getStatsExportOptions } from "../utils/exportUtils";

interface JobStatsProps {
  stats: any;
  jobs?: any[]; // Add jobs data to analyze status history
}

interface SankeyNode {
  name: string;
  id: number;
  value?: number;
  x0?: number;
  x1?: number;
  y0?: number;
  y1?: number;
}

interface SankeyLink {
  source: number;
  target: number;
  value: number;
  width?: number;
}

export function JobStatsComponent({ stats, jobs = [] }: JobStatsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgElement, setSvgElement] = useState<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // 设置SVG元素引用
    setSvgElement(svgRef.current);

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Calculate container dimensions for Sankey
    const width = 1100;
    const height = 280;

    // Analyze job flows from status history
    const analyzeJobFlows = () => {
      let appliedCount = jobs.length;
      let interviewedCount = 0;
      let rejectedAfterInterview = 0;
      let rejectedAfterApply = 0;
      let offersCount = 0;
      let noReplyAfterApply = 0;
      let noReplyAfterInterview = 0;

      jobs.forEach((job) => {
        const history = job.statusHistory || [];
        const hasInterviewed = history.some(
          (entry: any) => entry.status === "Interviewing"
        );

        if (job.status === "Rejected") {
          if (hasInterviewed) {
            rejectedAfterInterview++;
          } else {
            rejectedAfterApply++;
          }
        } else if (job.status === "Offer") {
          offersCount++;
        } else if (job.status === "Interviewing") {
          interviewedCount++;
          // Current interviewing jobs are "No Reply" in Sankey terms
          noReplyAfterInterview++;
        } else if (job.status === "Applied") {
          // Applied jobs that haven't moved forward are "No Reply"
          noReplyAfterApply++;
        }
      });

      return {
        appliedCount,
        interviewedCount:
          interviewedCount + rejectedAfterInterview + offersCount,
        rejectedAfterInterview,
        rejectedAfterApply,
        offersCount,
        noReplyAfterApply,
        noReplyAfterInterview,
      };
    };

    const flows = analyzeJobFlows();

    // Only create nodes that have data
    const allNodes = [
      { name: "Applied", id: 0, value: flows.appliedCount },
      { name: "Interviewed", id: 1, value: flows.interviewedCount },
      { name: "Offers", id: 2, value: flows.offersCount },
      {
        name: "Rejected",
        id: 3,
        value: flows.rejectedAfterInterview + flows.rejectedAfterApply,
      },
      {
        name: "No Reply",
        id: 4,
        value: flows.noReplyAfterApply + flows.noReplyAfterInterview,
      },
    ];

    // Filter out nodes with 0 value
    const nodes: SankeyNode[] = allNodes.filter((node) => node.value > 0);

    // Create a mapping from old IDs to new IDs
    const idMapping: { [key: number]: number } = {};
    nodes.forEach((node, index) => {
      idMapping[node.id] = index;
      node.id = index;
    });

    // Create links based on actual job flows, only if both source and target nodes exist
    const allLinks = [
      // From Applied to Interviewed
      { source: 0, target: 1, value: flows.interviewedCount },
      // From Applied to No Reply (direct)
      { source: 0, target: 4, value: flows.noReplyAfterApply },
      // From Applied to Rejected (direct)
      { source: 0, target: 3, value: flows.rejectedAfterApply },
      // From Interviewed to Offers
      { source: 1, target: 2, value: flows.offersCount },
      // From Interviewed to Rejected
      { source: 1, target: 3, value: flows.rejectedAfterInterview },
      // From Interviewed to No Reply
      { source: 1, target: 4, value: flows.noReplyAfterInterview },
    ];

    // Filter links: only include if value > 0 and both source and target nodes exist
    const links: SankeyLink[] = allLinks
      .filter(
        (link) =>
          link.value > 0 &&
          nodes.some((n) => n.id === idMapping[link.source]) &&
          nodes.some((n) => n.id === idMapping[link.target])
      )
      .map((link) => ({
        source: idMapping[link.source],
        target: idMapping[link.target],
        value: link.value,
      }));

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

    // Color scheme - map by node name instead of index
    const colorScale = d3
      .scaleOrdinal()
      .domain(["Applied", "Interviewed", "Offers", "Rejected", "No Reply"])
      .range([
        "#2196f3", // Applied - blue
        "#ff9800", // Interviewed - orange
        "#4caf50", // Offers - green
        "#f44336", // Rejected - red
        "#ffc107", // No Reply - yellow
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
  }, [stats, jobs]);

  return (
    <div className="h-full p-6 flex flex-col">
      {/* Top Statistics Cards with spacing - Smaller */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 p-3 rounded-lg border">
          <div className="text-xl font-bold text-blue-600">
            {stats.total || 0}
          </div>
          <div className="text-xs text-blue-600">Applied</div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg border">
          <div className="text-xl font-bold text-yellow-600">
            {stats.inProgress || 0}
          </div>
          <div className="text-xs text-yellow-600">In Progress</div>
        </div>

        <div className="bg-red-50 p-3 rounded-lg border">
          <div className="text-xl font-bold text-red-600">
            {stats.rejected || 0}
          </div>
          <div className="text-xs text-red-600">Rejected</div>
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
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-medium">
            Application Status Distribution
          </h4>
          <ShareMenu exportOptions={getStatsExportOptions(svgElement)} />
        </div>
        <div className="h-80">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </div>
    </div>
  );
}
