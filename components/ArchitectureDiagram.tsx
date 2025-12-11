'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { ArchitectureData } from '@/app/api/architecture/route'

interface ArchitectureDiagramProps {
  data: ArchitectureData
}

const nodeColors: Record<string, string> = {
  frontend: '#3b82f6',
  auth: '#10b981',
  backend: '#f59e0b',
  database: '#ef4444',
}

const nodeIcons: Record<string, string> = {
  frontend: '⚛️',
  auth: '🔐',
  backend: '⚙️',
  database: '💾',
}

export default function ArchitectureDiagram({ data }: ArchitectureDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const simulationRef = useRef<d3.Simulation<any, any> | null>(null)

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length || !containerRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const container = containerRef.current
    const width = container.clientWidth || 800
    const height = Math.max(600, container.clientHeight || 600)
    
    // Update SVG dimensions
    svg.attr('width', width).attr('height', height)

    // Create force simulation
    const simulation = d3
      .forceSimulation(data.nodes as any)
      .force(
        'link',
        d3
          .forceLink(data.links)
          .id((d: any) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60))
    
    simulationRef.current = simulation

    // Create links
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(data.links)
      .enter()
      .append('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)

    // Create nodes
    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(data.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(
        d3
          .drag<any, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended)
      )

    // Add circles for nodes
    node
      .append('circle')
      .attr('r', 40)
      .attr('fill', (d) => nodeColors[d.type] || '#6b7280')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')

    // Add icons
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .attr('font-size', '24px')
      .text((d) => nodeIcons[d.type] || '●')

    // Add labels
    const labels = node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 60)
      .attr('font-size', '14px')
      .attr('font-weight', 'bold')
      .attr('fill', '#1f2937')
      .text((d) => d.name)

    // Add hover tooltips
    node
      .append('title')
      .text((d) => `${d.name} (${d.type})`)

    // Hover effects
    node
      .on('mouseover', function (event, d) {
        d3.select(this).select('circle').attr('r', 45)
        d3.select(this).select('text').attr('font-size', '28px')
        labels
          .filter((labelData) => labelData.id === d.id)
          .attr('font-size', '16px')
          .attr('fill', nodeColors[d.type])
      })
      .on('mouseout', function (event, d) {
        d3.select(this).select('circle').attr('r', 40)
        d3.select(this).select('text').attr('font-size', '24px')
        labels
          .filter((labelData) => labelData.id === d.id)
          .attr('font-size', '14px')
          .attr('fill', '#1f2937')
      })

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
      }
    }
  }, [data])

  // Separate effect for handling window resize
  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !simulationRef.current) return

    const handleResize = () => {
      const container = containerRef.current
      const svg = d3.select(svgRef.current!)
      if (!container || !svgRef.current) return

      const width = container.clientWidth || 800
      const height = Math.max(600, container.clientHeight || 600)
      
      svg.attr('width', width).attr('height', height)
      
      // Update simulation center
      if (simulationRef.current) {
        simulationRef.current
          .force('center', d3.forceCenter(width / 2, height / 2))
          .alpha(0.3)
          .restart()
      }
    }

    // Initial resize
    handleResize()
    
    window.addEventListener('resize', handleResize)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (!data.nodes.length) {
    return (
      <div className="w-full h-full min-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No architecture data available
        </p>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4"
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="w-full h-full"
      />
    </div>
  )
}

