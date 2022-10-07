export default { setCookie, getCookie, deleteCookie };

function setCookie(cname: string, cvalue: string): void {
    const d = new Date();
    d.setTime(d.getTime() + (90 * 24 * 60 * 60 * 1000));
    const expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname: string): string {
    const name = cname + "=";
    const ca = document.cookie.replace(/\s+/g,"").split(';');
    for(let i = 0; i < ca.length; i++) {
        const c = ca[i];
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookie(cname: string): void {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}