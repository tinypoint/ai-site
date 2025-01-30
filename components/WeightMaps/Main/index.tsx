import useLowCodeStore from "@/hooks/useLowCodeStore";

export const Main = (
  {
    children,
    layout
  }: {
    children: React.ReactNode;
    layout: React.CSSProperties;
  }
) => {
  const routes = useLowCodeStore(state => state.expressionContext.routes);

  return <div
    className="block w-full h-full overflow-x-hidden overflow-y-auto"
    style={{
      flex: layout.flex,
    }}
  >
    main
  </div>
}