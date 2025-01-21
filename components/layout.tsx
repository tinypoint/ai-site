// ==================== 类型定义 ====================
type GridPosition = {
	gridRow: number;
	rowStartToParentContainer: number;
	rowSpanToParentContainer: number;
	colStartToParentContainer: number;
	colSpanToParentContainer: number;
	autoHeight?: boolean;
};

type LayoutMetrics = {
	marginTop: number;
	height: number | 'auto';
	autoHeight: boolean;
};

// ==================== 布局上下文 ====================

type LayoutElement = any;

const isContainer = (element: LayoutElement) => element.type === 'Page' || element.type === 'Container' || element.type === 'Form';

class LayoutContext {
	private rowCounter = 1;
	private readonly ROW_HEIGHT = 8; // 基准行高单位

	// 计算元素布局信息
	calculate(element: LayoutElement, prevElements: LayoutElement[]): [GridPosition, LayoutMetrics] {
		// 行号计算
		const gridRow = this.rowCounter++;

		// 水平定位
		const colStartToParentContainer = element.grid.left;
		const colSpanToParentContainer = element.grid.width;

		// 垂直定位
		let marginTop = element.vertical.top * this.ROW_HEIGHT;
		if (prevElements.length > 0) {
			const lastElement = prevElements[prevElements.length - 1];
			marginTop = Math.max(
				marginTop,
				lastElement.vertical.top * this.ROW_HEIGHT + lastElement.vertical.height * this.ROW_HEIGHT
			);
		}

		// 高度处理
		const autoHeight = element.vertical.mode === 'auto';
		const height = autoHeight ? 'auto' : element.vertical.height * this.ROW_HEIGHT;

		return [
			{
				gridRow,
				rowStartToParentContainer: gridRow,
				rowSpanToParentContainer: 1,
				colStartToParentContainer,
				colSpanToParentContainer,
				autoHeight
			},
			{
				marginTop,
				height,
				autoHeight
			}
		];
	}
}

// ==================== React组件实现 ====================
interface LayoutItemProps {
	gridPosition: GridPosition;
	layoutMetrics: LayoutMetrics;
	children: React.ReactNode;
}

const LayoutItem: React.FC<LayoutItemProps> = ({
	gridPosition,
	layoutMetrics,
	children
}) => (
	<div
		data-ai-site-grid-item={JSON.stringify({
			rowStartToParentContainerWithDiff: layoutMetrics.marginTop,
			gridRow: gridPosition.gridRow,
			rowStartToParentContainer: gridPosition.rowStartToParentContainer,
			rowSpanToParentContainer: gridPosition.rowSpanToParentContainer,
			colStartToParentContainer: gridPosition.colStartToParentContainer,
			colSpanToParentContainer: gridPosition.colSpanToParentContainer,
			autoHeight: gridPosition.autoHeight
		})}
		className="relative top-0 left-0 px-2 py-1 flex"
		style={{
			marginLeft: `${(gridPosition.colStartToParentContainer / 24 * 100).toFixed(4)}%`,
			marginTop: layoutMetrics.marginTop,
			width: `${(gridPosition.colSpanToParentContainer / 24 * 100).toFixed(4)}%`,
			height: layoutMetrics.height,
			gridRow: gridPosition.gridRow,
			gridColumn: '1 / 2'
		}}
	>
		{children}
	</div>
);

// ==================== 容器组件 ====================
interface LayoutContainerProps {
	elements: LayoutElement[];
}

export const LayoutContainer: React.FC<LayoutContainerProps> = ({
	elements,
}) => {
	const ctx = new LayoutContext();
	const layoutItems: any[] = [];
	let prevElements: LayoutElement[] = [];

	elements.forEach((element, index) => {
		const [gridPos, metrics] = ctx.calculate(element, prevElements);

		layoutItems.push(
			<LayoutItem
				key={element.id}
				gridPosition={gridPos}
				layoutMetrics={metrics}
			>
				{isContainer(element) ? (
					<LayoutContainer
						elements={element.children}
					/>
				) : (
					element.content
				)}
			</LayoutItem>
		);

		prevElements = elements.slice(0, index + 1);
	});

	return (
		<div
			className="grid auto-rows-min"
			style={{
				gridTemplateColumns: 'repeat(24, 1fr)',
			}}
		>
			{layoutItems}
		</div>
	);
};