import Form from "./v1";
import { useForm } from "./v1/useForm";

export function FormV1() {
  const form = useForm();
  return (
    <>
      formV1
      <Form form={form}>
        <button
          onClick={() => {
            form.setFields([{ name: "foo", value: "foo" }]);
          }}
        >
          set Fields
        </button>
        <button
          onClick={() => {
            console.log(form.getFields());
          }}
        >
          get Fields
        </button>
      </Form>
    </>
  );
}
