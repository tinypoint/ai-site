import { mergeObjects } from ".";

import { ISchemaEvents, IFinalSchema, ISchemaExpressions, ISchemaLayout, IQuerys, IQueryMockResponse } from "@/types";


export const schemaMerge = (options: {
  schemaExpressionsJSON: ISchemaExpressions,
  schemaLayoutsJSON: ISchemaLayout,
  schemaEventsJSON: ISchemaEvents,
  querysJSON: IQuerys,
  queryMockResponseJSON: IQueryMockResponse
}) => {
  const {
    schemaExpressionsJSON = { querys: {}, weights: {} },
    schemaLayoutsJSON = {},
    schemaEventsJSON = {},
    querysJSON = {},
    queryMockResponseJSON = {}
  } = options;
  const finalSchemaJSON: IFinalSchema = {};
  const { querys = {}, weights = {} } = schemaExpressionsJSON;
  for (const key in schemaLayoutsJSON) {
    const weightExpressions = weights[key];
    finalSchemaJSON[key] = {
      type: schemaLayoutsJSON[key].type,
      parentId: schemaLayoutsJSON[key].parentId,
      layout: schemaLayoutsJSON[key]?.layout,
      props: schemaLayoutsJSON[key]?.props,
      events: schemaEventsJSON[key],
    };

    if (weightExpressions) {
      finalSchemaJSON[key].props = mergeObjects({ ...(finalSchemaJSON[key].props || {}) }, weightExpressions);
    }
  }

  const finalQuerysJSON: IQuerys = {};
  for (const key in querysJSON) {
    const querysExpressions = querys[key];
    finalQuerysJSON[key] = {
      ...querysJSON[key],
      ...queryMockResponseJSON[key],
    };
    if (querysExpressions) {
      finalQuerysJSON[key] = mergeObjects({ ...(finalQuerysJSON[key] || {}) }, querysExpressions);
    }
  }

  return {
    weights: finalSchemaJSON,
    querys: finalQuerysJSON,
  }
}