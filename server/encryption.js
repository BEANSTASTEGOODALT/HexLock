const MULTIPLIER = 793256731341849283943958123n;
const SEPARATOR = "678909487689009876528749809257684981935279185736109781";

const charNum = "abcdefghijklmnopqrstuvwxyz1234567890~!@#$%^&*()_+=-`;:|\\[{]}'\".,<>?/".split("");

function encrypt(data) {
    let res = "";

    for (const char of data) {
        const index = charNum.indexOf(char);

        if (index !== -1) {
            res += BigInt(index) * MULTIPLIER;
        } else {
            res += char;
        }

        res += SEPARATOR;
    }

    return res;
}

function decrypt(data) {
    const arr = data.split(SEPARATOR);
    let res = "";

    for (const value of arr) {
        if (value === "") continue;

        try {
            const num = BigInt(value);

            if (num % MULTIPLIER === 0n) {
                const index = num / MULTIPLIER;

                if (index >= 0n && index < BigInt(charNum.length)) {
                    res += charNum[Number(index)];
                    continue;
                }
            }
        } catch {
            res += value;
        }

        res += value;
    }

    return res;
}

