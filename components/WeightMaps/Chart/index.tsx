import { AISiteLayoutSystemItem } from "@/components/LayoutSystem"
import { IWeightLayoutForRender, IWeightStyle } from "@/types"

export const WeightChart = ({
  layout,
  style
}: {
  layout: IWeightLayoutForRender
  style: IWeightStyle
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