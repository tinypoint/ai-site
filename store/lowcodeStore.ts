import { create } from 'zustand';


interface LowCodeState {
  weightMaps: Record<string, { methods: Record<string, (...args: any[]) => void> }>;
  expressionContext: Record<string, any>;
  registerWeight: (name: string, weight: any) => void;
  unregisterWeight: (name: string) => void;
  callWeightMethod: (method: string, ...args: any[]) => void;
  updateExpressionContext: (name: string, state: any) => void;
  getExpressionContext: (name: string) => any;
}

const useLowCodeStore = create<LowCodeState>((set, get) => ({
  weightMaps: {},
  expressionContext: {},
  registerWeight: (name: string, weight: any) => {
    return set((state) => ({ weightMaps: { ...state.weightMaps, [name]: weight } }))
  },
  unregisterWeight: (name: string) => {
    return set((state) => {
      const weightMaps = { ...state.weightMaps };
      delete weightMaps[name];
      return { weightMaps }
    })
  },
  callWeightMethod: (name, method: string, ...args: any[]) => {
    const weight = get().weightMaps[name];
    weight?.methods?.[method](...args);
  },
  updateExpressionContext: (name: string, expressionContext: any) => {
    return set((state) => ({ expressionContext: { ...state.expressionContext, [name]: expressionContext } }))
  },
  getExpressionContext: (name: string) => {
    return get().expressionContext[name];
  }
}));

export default useLowCodeStore;