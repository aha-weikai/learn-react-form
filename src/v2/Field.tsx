import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const { formStore } = useFormContext();

  // 维护自己内部状态
  const [value, setValue] = useState(() => formStore.getFields([name])[0]);

  const onChange = useCallback(
    (e: any) => {
      formStore.setFields([{ name, value: getTargetValue(e) }]);
    },
    [name, formStore]
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

  // 订阅一个监听，当changeFields 中包含当前字段时，更新value值
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changeFields) => {
      const targetField = changeFields.find((field) => field.name === name);
      if (targetField) {
        setValue(targetField.value);
      }
    });
    return unsubscribe;
  }, [formStore, name]);

  return <>{element}</>;
};
