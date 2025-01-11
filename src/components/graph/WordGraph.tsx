import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface WordNode {
  id: string;
  word: string;
  category: string;
  value: number;
  children?: WordNode[];
}

interface WordGraphProps {
  data: WordNode;
}

type HierarchyNode = d3.HierarchyNode<WordNode>;
type HierarchyCircularNode = d3.HierarchyCircularNode<WordNode>;

export default function WordGraph({ data }: WordGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<SVGGElement | null>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current || !data) return;

    // 清除之前的内容
    d3.select(svgRef.current).selectAll("*").remove();

    // 设置画布尺寸
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    // 创建层级数据
    const root = d3.hierarchy(data)
      .sum((d: WordNode) => d.value)
      .sort((a: HierarchyNode, b: HierarchyNode) => (b.value || 0) - (a.value || 0));

    // 创建打包布局
    const pack = d3.pack<WordNode>()
      .size([width - 100, height - 100]) // 留出边距
      .padding(3);

    // 应用布局
    const nodes = pack(root);

    // 创建SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("font", "10px sans-serif")
      .style("user-select", "none");

    // 创建可缩放的容器组
    const container = svg.append("g")
      .attr("transform", `translate(${50},${50})`); // 初始位置留出边距
    
    containerRef.current = container.node();

    // 创建节点组
    const node = container.selectAll("g")
      .data(nodes.descendants())
      .join("g")
      .attr("transform", (d: HierarchyCircularNode) => `translate(${d.x},${d.y})`);

    // 添加圆形
    node.append("circle")
      .attr("r", (d: HierarchyCircularNode) => d.r)
      .attr("fill", (d: HierarchyCircularNode) => d.children ? "#E3F2FD" : "#90CAF9")
      .attr("fill-opacity", (d: HierarchyCircularNode) => d.children ? 0.6 : 0.8)
      .attr("stroke", "#64B5F6")
      .attr("stroke-width", 1.5);

    // 添加文本
    node.filter((d: HierarchyCircularNode) => d.r > 20)
      .append("text")
      .attr("clip-path", (d: HierarchyCircularNode) => `circle(${d.r}px)`)
      .selectAll("tspan")
      .data((d: HierarchyCircularNode) => [d.data.word])
      .join("tspan")
      .attr("x", 0)
      .attr("y", "0.3em")
      .attr("text-anchor", "middle")
      .attr("fill", "#1976D2")
      .text(d => d);

    // 创建缩放行为
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3]) // 限制缩放范围
      .on("zoom", (event) => {
        if (containerRef.current) {
          d3.select(containerRef.current).attr("transform", event.transform);
        }
      });

    // 保存zoom引用
    zoomRef.current = zoom;

    // 应用缩放行为
    svg.call(zoom);

  }, [data]);

  // 缩放控制函数
  const handleZoom = (delta: number) => {
    if (!svgRef.current || !zoomRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;
    
    // 获取当前变换
    const transform = d3.zoomTransform(svgRef.current);
    const newScale = Math.max(0.5, Math.min(3, transform.k + delta));
    
    // 应用新的变换
    svg.transition()
      .duration(300)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(transform.x, transform.y)
          .scale(newScale)
      );
  };

  // 重置视图
  const handleReset = () => {
    if (!svgRef.current || !zoomRef.current) return;
    
    const svg = d3.select(svgRef.current);
    const zoom = zoomRef.current;
    
    svg.transition()
      .duration(300)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(50, 50)
          .scale(1)
      );
  };

  return (
    <div className="relative w-full h-full min-h-[600px] bg-white rounded-lg p-4">
      {/* 控制按钮 */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => handleZoom(0.2)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(-0.2)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
        >
          -
        </button>
        <button
          onClick={handleReset}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors"
        >
          ⟲
        </button>
      </div>
      
      {/* 图谱 SVG */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ minHeight: "600px" }}
      />
    </div>
  );
} 