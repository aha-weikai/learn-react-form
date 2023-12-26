import React from "react";
import { FormStore } from ".";

export type Store = Record<string, any>;

export interface FieldMeta {
  name: string;
  value: any;
}

export interface FormContextValue {
  /** ## context 内保存的每一个表单项值的方法 */
  formStore: FormStore;
  /** ## context 内下发如何修改表单项值的方法 */
  // setFields: (fields: FieldMeta[]) => void;
}

export const FormContext = React.createContext<FormContextValue | null>(null);

export function useFormContext() {
  const context = React.useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormContextProvider");
  }
  return context;
}
