const randomNumber = (): number => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0];
};

export default randomNumber;
