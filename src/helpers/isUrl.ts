export const isUrl = (str: string): boolean => {
    var pattern = new RegExp(
        `^(https?:\/\/)?
((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|
((\d{1,3}\.){3}\d{1,3}))
(\:\d+)?(\/[-a-z\d%_.~+]*)*
(\?[;&a-z\d%_.~+=-]*)?
(\#[-a-z\d_]*)?$`,
        'i'
    )

    if (!pattern.test(str)) {
        return false
    } else {
        return true
    }
}
