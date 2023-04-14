export function setSessionStorageItem(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
}

export function getSessionStorageItem(key: string) {
    const user:any = sessionStorage.getItem(key);
    return user ? JSON.parse(user) : null;
}