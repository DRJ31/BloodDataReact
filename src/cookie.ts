namespace Cookie {
    export function getValue(key: string): string | null {
        const cookieArr: string[] = document.cookie.split(";")
        for (let cookieStr of cookieArr) {
            const arr: string[] = cookieStr.trim().split("=")
            if (arr[0].length > 0 && arr[0] === key) {
                return arr[1]
            }
        }
        return null
    }

    export function setValue(key: string, val: string) {
        const cookieArr: string[] = document.cookie.split(";")
        for (let i = 0; i < cookieArr.length; i++) {
            const arr: string[] = cookieArr[i].trim().split("=")
            if (arr[0].length > 0 && arr[0] === key) {
                arr[1] = val
                cookieArr[i] = arr[0] + "=" + arr[1]
            }
        }
        cookieArr.join("; ")
    }

    export function expire(seconds: number) {
        const d = new Date()
        d.setTime(d.getTime() + seconds * 1000)
        setValue("expires", d.toString())
    }

    export const clearCookie = () => setValue("expires", new Date("2000-01-01").toString())
}

export default Cookie