import { useEffect, useState } from "react";
import { useWatch } from "./useWatch";

export const Input: React.FC = () => {
  const foo = useWatch("foo");
  const [value, setValue] = useState(foo + "bar");
  useEffect(() => {
    setValue(foo + "bar");
  }, [foo]);
  return <input value={value} readOnly />;
};
