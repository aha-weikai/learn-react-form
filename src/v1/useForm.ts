import React, { useRef } from "react";
import { FieldMeta } from "./fromContext";

export interface FormAction {
  /**
   * ## 数据下发
   * 调用ref绑定的方法设置
   */
  setFields: (fields: FieldMeta[]) => void;
  /**
   * ## 获取数据
   * 调用ref绑定的方法获取
   */
  getFields: (names?: string[]) => any[];
}

/**
 * ## 获取一个ref，之后会为ref 增加方法
 */
export interface InternalFormAction extends FormAction {
  __INTERNAL__: React.MutableRefObject<FormAction | null>;
}

function throwError() {
  throw new Error(
    "Instance created by `useForm` is not connected to any Form element. Forget to pass `form` prop?"
  );
}

/**
 * ## 隔绝内部状态
 * 通过为ref增加方法的方式，转发调用，避免直接操作form内部数据
 */
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

// 隔离内部状态

// 表单容器内部的状态收集最好交由其容器内部自行控制，外界无法直接通过受控组件的方式控制表单容器。

// 这样做的好处是能确保数据流向单一，通过表单容器的自动收集值，可以更好地实现各种状态联动效果（比如修改值时同时要触发值的校验等）。

// 同时由于将容器与外界隔离，内部的任何操作都不会对外界其他组件造成影响，可以减少不必要的麻烦。

// 比如有时我们需要在点击提交按钮后再去拿表单值，否则用以前的，如果变成外部传入值，需要额外再维护一套状态。

// 那么，既然把表单容器做成了非受控组件，对于外界来说又该怎样获取与修改内部值呢？

// 我们只需将表单容器内获取和修改内部值的相关 API 外抛出即可。同时，配合之前定义的onFieldsChange方法，就可以精确地对表单项的改变做出对应反馈。
