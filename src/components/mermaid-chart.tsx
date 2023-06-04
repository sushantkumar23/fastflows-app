import React, { useEffect, useRef } from "react"
import mermaid from "mermaid"

interface MermaidChartProps {
  chart: string
}

const MermaidChart: React.FC<MermaidChartProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  console.log("chart: ", chart)
  useEffect(() => {
    renderChart()
  }, [chart])

  const renderChart = async () => {
    if (containerRef.current) {
      containerRef.current.innerHTML = ""
      mermaid.initialize({ startOnLoad: false })
      const { svg } = await mermaid.render("mermaid-svg", chart)
      console.log("svg: ", svg)
      containerRef.current.innerHTML = svg
    }
  }

  return <div className="w-full" ref={containerRef} />
}

export default MermaidChart
