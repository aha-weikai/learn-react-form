import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { FieldMeta, FormContext, FormContextValue, Store } from "./fromContext";
import { FormAction, InternalFormAction, useForm } from "./useForm";

export interface FormProps {
  /**
   * ## 表单的初始值
   */
  initialValues?: Store;

  onFieldsChange?: (options: {
    changeFields: FieldMeta[];
    fieldsStore: Store;
  }) => void;
  children?: React.ReactNode;

  form: FormAction;
}

// export function Form:React.FC<FormProps>()  {
//   return props => {
//     return <div>{props.children}</div>;
//   };
// }

const Form: React.FC<FormProps> = ({
  initialValues,
  onFieldsChange,
  children,
  form: formProp,
}) => {
  // 初始化 fieldsStore, Form的值
  const [fieldsStore, setFieldsStore] = useState<Store>(
    () => initialValues || {}
  );
  // 改变fields
  const [changeFields, setChangeFields] = useState<FieldMeta[]>([]);

  // useRef 帮助引用一个不需要渲染的值
  const onFieldsChangeRef = useRef(onFieldsChange);
  onFieldsChangeRef.current = onFieldsChange;

  // useMemo 在每次重新渲染的时候能够缓存计算的结果
  // 作用类似于vue中的 computed
  // 写法类似于 watch
  /**
   * ## form 的数据整合
   */
  const ctx: FormContextValue = useMemo(() => {
    return {
      fieldsStore,
      /**
       * ## 修改表单项
       * @param fields
       */
      setFields(fields) {
        const newStore = {
          ...fieldsStore,
          ...fields.reduce((acc, cur) => {
            acc[cur.name] = cur.value;
            return acc;
          }, {} as Store),
        };
        setFieldsStore(newStore);
        setChangeFields(fields);
      },
    };
  }, [fieldsStore]);

  const defaultForm = useForm();
  const form = (formProp || defaultForm) as InternalFormAction;

  useImperativeHandle(
    form.__INTERNAL__,
    () => ({
      getFields(names) {
        if (!names) {
          return [ctx.fieldsStore];
        }
        return names.map((name) => ctx.fieldsStore[name]);
      },
      setFields: ctx.setFields,
    }),
    [ctx.fieldsStore, ctx.setFields]
  );

  // 类似于 watch
  // 这里要在 useEffect 也就是刷新 state 后再调用，否则如果在 onFieldsChangeRef 修改值会覆盖掉上次修改
  useEffect(() => {
    onFieldsChangeRef.current?.({ changeFields, fieldsStore });
  }, [fieldsStore, changeFields]);

  return <FormContext.Provider value={ctx}>{children}</FormContext.Provider>;
};

export default Form;
