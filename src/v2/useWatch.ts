import { useEffect, useState } from "react";
import { useFormContext } from "./fromContext";

// 当传入 name 时返回具体的字段值，不传则返回整个 fieldsStore
export function useWatch(name?: string) {
  const { formStore } = useFormContext();
  // 内部维护一个状态值，当监听到指定字段值修改时，会更新当前调用useWatch 的组件
  const [value, setValue] = useState(() =>
    name ? formStore.getFields([name])[0] : formStore.getFields()[0]
  );

  useEffect(() => {
    const unsubscribe = formStore.subscribe((changedFields) => {
      if (name) {
        const targetField = changedFields.find(
          (changedField) => changedField.name === name
        );
        if (targetField) {
          setValue(targetField.value);
        }
      } else {
        setValue(formStore.getFields()[0]);
      }
    });
    return unsubscribe;
  }, [formStore, name]);

  return value;
}
