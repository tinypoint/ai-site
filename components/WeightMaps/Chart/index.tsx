import { AISiteLayoutSystemItem } from "@/components/LayoutSystem"
import { IWeightLayout } from "@/types"

export const WeightChart = ({
  layout,
  style
}: {
  layout: IWeightLayout
  style: React.CSSProperties
}) => {
  return (
    <AISiteLayoutSystemItem
      weightType="chart"
      layout={layout}
    >
      <div className="w-full h-full border rounded-md" style={style}>
        chart
      </div>
    </AISiteLayoutSystemItem>
  )
}