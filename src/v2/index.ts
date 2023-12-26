import { FieldMeta, Store } from "./fromContext";

export type SubscribeCallback = (changedFields: FieldMeta[]) => void;

export class FormStore {
  /** ## 保存所有表单项的值 */
  private store: Store = {};

  /** ## 监听器数组 */
  private observers: SubscribeCallback[] = [];

  constructor(initialValues?: Store) {
    if (initialValues) {
      this.store = initialValues;
    }
  }

  private updateStore(nextStore: Store) {
    this.store = nextStore;
  }

  /** ## 通知，当有值发生改变时，给所有的监听器发布通知 */
  private notifyAll(changedFields: FieldMeta[] = []) {
    this.observers.forEach((observer) => observer(changedFields));
  }

  /** ## 注册监听器 */
  subscribe(observer: SubscribeCallback) {
    this.observers.push(observer);
    return () => {
      this.observers = this.observers.filter((item) => item !== observer);
    };
  }

  /** ## 获取表单项的值 */
  getFields(names?: string[]) {
    if (!names) {
      return [this.store];
    }

    return names.map((name) => this.store[name]);
  }

  /** ## 设置表单项的值 */
  setFields(fields: FieldMeta[]) {
    const newStore = {
      ...this.store,
      ...fields.reduce((acc, next) => {
        acc[next.name] = next.value;
        return acc;
      }, {} as Store),
    };
    this.updateStore(newStore);
    this.notifyAll();
  }
}
