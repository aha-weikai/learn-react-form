import React, { useCallback, useRef } from "react";
import { useFormContext } from "./fromContext";

export interface FieldProps {
  children: React.ReactNode;
  name: string;
}

export function getTargetValue(e: any) {
  if (typeof e === "object" && e !== null && "target" in e) {
    return e.target.value;
  }
  return e;
}

export const Field: React.FC<FieldProps> = ({ children, name }) => {
  const { setFields, fieldsStore } = useFormContext();
  // 实现value 和 onChange
  const value = fieldsStore[name];

  const onChange = useCallback(
    (e: any) => {
      setFields([{ name, value: getTargetValue(e) }]);
    },
    [name, setFields]
  );
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  // 为了确保 onChange 不会改变地址指向
  // const

  //
};
