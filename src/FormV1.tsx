import Form from "./v1";
import { useForm } from "./v1/useForm";

export function FormV1() {
  // 将form传入到Form中
  // 为form.__INTERNAL__ 增添函数
  const form = useForm();
  return (
    <>
      formV1
      <Form form={form}>
        {/* 在内部使用 React.cloneElement 为input 绑定value 和 onChange */}
        {/* <Field name="foo">
          <input />
        </Field> */}
        <button
          onClick={() => {
            form.setFields([{ name: "foo", value: "foo" }]);
          }}
        >
          set Fields 数据下发
        </button>
        <button
          onClick={() => {
            console.log(form.getFields());
          }}
        >
          get Fields 获取数据
        </button>
      </Form>
    </>
  );
}
