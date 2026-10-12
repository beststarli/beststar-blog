/**
 * 监听对象属性的「添加」和「修改」（可选删除）
 * @param {object} target
 * @param {(change: {type:'add'|'set'|'delete', key:string|symbol, value:any, oldValue:any}) => void} onChange
 * @param {{ onDelete?: boolean, deep?: boolean }} [options]
 * @returns {Proxy} 代理对象
 */
function watch(target, onChange, options = {}) {
    const { onDelete = false, deep = false } = options;
    const cache = new WeakMap();               // 同一对象只代理一次

    function createProxy(obj) {
        if (obj === null || typeof obj !== 'object') return obj;   // 原始值直接返回
        if (cache.has(obj)) return cache.get(obj);

        const proxy = new Proxy(obj, {
            get(t, key, receiver) {
                const value = Reflect.get(t, key, receiver);
                // 深层监听：读取时就地包装（懒代理，不递归遍历）
                return deep ? createProxy(value) : value;
            },

            set(t, key, value, receiver) {
                // 必须在写入【之前】判断，才能区分新增与修改
                const isAdd = !Reflect.has(t, key);
                const oldValue = isAdd ? undefined : Reflect.get(t, key, receiver);

                const ok = Reflect.set(t, key, value, receiver);   // Reflect 负责真正写入

                if (ok && !Object.is(oldValue, value)) {
                    onChange({ type: isAdd ? 'add' : 'set', key, value, oldValue });
                }
                return ok;                                          // trap 必须返回布尔
            },

            deleteProperty(t, key) {
                const had = Reflect.has(t, key);
                const oldValue = had ? Reflect.get(t, key) : undefined;
                const ok = Reflect.deleteProperty(t, key);
                if (ok && had && onDelete) {
                    onChange({ type: 'delete', key, value: undefined, oldValue });
                }
                return ok;
            },
        });

        cache.set(obj, proxy);
        return proxy;
    }

    return createProxy(target);
}
