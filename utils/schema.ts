import { mergeObjects } from ".";

import { ISchemaEvents, ISchemaProps, IFinalSchema, ISchemaExpressions, ISchemaLayout, IQuerys, IQueryMockResponse } from "@/types";


export const schemaMerge = (options: {
  schemaExpressionsJSON: ISchemaExpressions,
  schemaLayoutsJSON: ISchemaLayout,
  schemaPropsJSON: ISchemaProps,
  schemaEventsJSON: ISchemaEvents,
  querysJSON: IQuerys,
  queryMockResponseJSON: IQueryMockResponse

}) => {
  const {
    schemaExpressionsJSON = { querys: {}, weights: {} },
    schemaLayoutsJSON = {},
    schemaPropsJSON = {},
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
      parent: schemaLayoutsJSON[key].parent,
      layout: schemaLayoutsJSON[key]?.layout,
      style: schemaLayoutsJSON[key]?.style,
      props: schemaPropsJSON[key]?.props,
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