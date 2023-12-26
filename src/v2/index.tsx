import React, { useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { FormStore } from ".";
import { FieldMeta, FormContext, FormContextValue, Store } from "./fromContext";
import { FormAction, InternalFormAction, useForm } from "./useForm";

export interface FormProps {
  /** ## 表单的初始值 */
  initialValues?: Store;

  onFieldsChange?: (options: {
    changeFields: FieldMeta[];
    fieldsStore: Store;
  }) => void;
  children?: React.ReactNode;

  form: FormAction;
}

const Form: React.FC<FormProps> = ({
  initialValues,
  onFieldsChange,
  children,
  form: formProp,
}) => {
  // // 初始化 fieldsStore, Form的值
  // const [fieldsStore, setFieldsStore] = useState<Store>(
  //   () => initialValues || {}
  // );

  // useRef 帮助引用一个不需要渲染的值
  const onFieldsChangeRef = useRef(onFieldsChange);
  onFieldsChangeRef.current = onFieldsChange;

  const defaultForm = useForm();
  const form = (formProp || defaultForm) as InternalFormAction;
  const formStore = useMemo(() => new FormStore(initialValues), []);

  // useMemo 在每次重新渲染的时候能够缓存计算的结果
  // 作用类似于vue中的 computed
  // 写法类似于 watch
  /**
   * ## form 的数据整合
   */
  const ctx: FormContextValue = useMemo(() => {
    return {
      formStore,
    };
  }, [formStore]);

  // useImperativeHandle 自定义由ref暴露出来的句柄
  // 类似于 vue 中的defineExpose, 但是需要增加ref
  // 给 form 中的ref 绑定 getFields 和 setFields 的方法
  useImperativeHandle(
    form.__INTERNAL__,
    () => ({
      getFields(names) {
        return formStore.getFields(names);
      },
      setFields(fields) {
        formStore.setFields(fields);
      },
    }),
    [formStore]
  );

  // 类似于 watch
  // 这里要在 useEffect 也就是刷新 state 后再调用，否则如果在 onFieldsChangeRef 修改值会覆盖掉上次修改
  useEffect(() => {
    const unsubscribe = formStore.subscribe((changeFields) => {
      onFieldsChangeRef.current?.({
        changeFields,
        fieldsStore: formStore.getFields(),
      });
    });
    return unsubscribe;
  }, [formStore]);

  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>;
};

export default Form;
