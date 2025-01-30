import { AISiteLayoutSystemItem } from "@/components/LayoutSystem"
import { IWeightLayoutForRender } from "@/types"

export const WeightChart = ({
  layout,
  style
}: {
  layout: IWeightLayoutForRender
}) => {
  return (
    <AISiteLayoutSystemItem
      weightType="chart"
      layout={layout}
    >
      <div className="w-full h-full border rounded-md">
        chart
      </div>
    </AISiteLayoutSystemItem>
  )
}