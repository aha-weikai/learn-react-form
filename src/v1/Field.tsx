import React, { useCallback, useMemo, useRef } from "react";
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

/**
 * ## 将要展示的children替换为element(cloned children)，并为element添加数据处理的方法
 */
export const Field: React.FC<FieldProps> = ({ children, name }) => {
  const { setFields, fieldsStore } = useFormContext();
  // 实现value 和 onChange
  /** ## 通过context 和 key(也就是name) 取到value  */
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
  const elementOnChange = useCallback((e: any) => {
    return onChangeRef.current(e);
  }, []);

  const element = useMemo(() => {
    // 检测是否为 react 元素
    // 不是 react 元素则直接展示，不处理
    console.log(React.isValidElement(children));
    if (!React.isValidElement(children)) {
      return children;
    }

    // 是react 元素
    // 克隆 children , 传入 value 和 onChange
    return React.cloneElement(children as React.ReactElement, {
      onChange: elementOnChange,
      value,
      ...children.props,
    });
  }, [children, value, elementOnChange]);

  return <>{element}</>;
};
