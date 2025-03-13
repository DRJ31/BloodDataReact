import MD5 from 'crypto-js/md5';

const SALT: string = "genshin";

const encrypt = (token: string): string => MD5(SALT + token).toString();

export default encrypt;