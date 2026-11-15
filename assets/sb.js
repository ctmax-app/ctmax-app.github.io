// Сайт без входа и оплаты: к серверу он не обращается.
export const configured = false;
export const config = window.CTMAX || {};
export function onAuthChange() { return () => {}; }
export function currentUser() { return null; }
export async function selectPublic() { throw new Error('offline'); }
