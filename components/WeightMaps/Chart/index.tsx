import { LayoutItem } from "@/components/LayoutSystem"

export const WeightChart = ({
  layout,
}: {
  layout: React.CSSProperties
}) => {
  return (
    <LayoutItem
      weightType="chart"
      layout={layout}
      weightId="chart"
    >
      <div className="w-full h-full border rounded-md">
        chart
      </div>
    </LayoutItem>
  )
}