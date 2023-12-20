import React, { useRef } from "react";
import { FieldMeta } from "./fromContext";

export interface FormAction {
  setFields: (fields: FieldMeta[]) => void;
  getFields: (names?: string[]) => any[];
}

export interface InternalFormAction extends FormAction {
  __INTERNAL__: React.MutableRefObject<FormAction | null>;
}

function throwError() {
  throw new Error(
    "Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?"
  );
}

export function useForm(): InternalFormAction {
  const __INTERNAL__ = useRef<FormAction | null>(null);
  return {
    __INTERNAL__,
    setFields: (fields: FieldMeta[]) => {
      const action = __INTERNAL__.current;
      if (!action) {
        throwError();
      }
      action!.setFields(fields);
    },
    getFields: (names?: string[]) => {
      const action = __INTERNAL__.current;
      if (!action) {
        throwError();
      }
      return action!.getFields(names);
    },
  };
}
