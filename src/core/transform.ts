import { AxiosTransformer } from "../type";

export default function transform(data: any, headers:any, fns?: AxiosTransformer | AxiosTransformer[]) {
    if (!fns) return data
    if (!Array.isArray(fns)) fns = [fns]

    // 管道式调用
    fns.forEach(fn => {
        data = fn(data, headers)
    })

    return data
}
