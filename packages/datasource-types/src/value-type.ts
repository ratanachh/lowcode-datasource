// Expression
export interface JSExpression {
  type: 'JSExpression';
  /**
   * Expression string
   */
  value: string;
  /**
   * Mock value
   */
  mock?: any;
  /** Source code */
  compiled?: string;
}

// Function
export interface JSFunction {
  type: 'JSFunction';
  /**
   * Expression string
   */
  value: string;
}

/**
 * Event function type
 * @see https://yuque.antfin-inc.com/mo/spec/spec-low-code-building-schema#feHTW
 */
export interface JSFunction {
  type: 'JSFunction';

  /**
   * Function definition, or a direct function expression
   */
  value: string;

  /** Source code */
  compiled?: string;
}

// Function
export interface JSFunction {
  type: 'JSFunction';
  /**
   * Function string
   */
  value: string;
  /**
   * Mock value
   */
  mock?: any;
  /**
   * Extra extension properties, e.g. extType, events
   */
  [key: string]: any;
}

// JSON primitive types
export type JSONValue =
  | boolean
  | string
  | number
  | null
  | undefined
  | JSONArray
  | JSONObject;
export type JSONArray = JSONValue[];
export interface JSONObject {
  [key: string]: JSONValue;
}

// Composite types
export type CompositeValue =
  | JSONValue
  | JSExpression
  | JSFunction
  // | JSSlot // Should extract a base types module later
  | CompositeArray
  | CompositeObject;
export type CompositeArray = CompositeValue[];
export interface CompositeObject {
  [key: string]: CompositeValue;
}
