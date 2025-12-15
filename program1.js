const fs = require('fs');

function decodeValue(value, base) {
    let result = 0n;
    let baseBig = BigInt(base);
    for (const char of value) {
        const digit = parseInt(char, base);
        result = result * baseBig + BigInt(digit);
    }
    return result;
}

function lagrangeInterpolation(points, k) {
    const xValues = Object.keys(points).map(Number).sort((a, b) => a - b).slice(0, k);
    let nums = [];
    let dens = [];
    
    for (let i = 0; i < k; i++) {
        let xi = BigInt(xValues[i]);
        let num = 1n;
        let den = 1n;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = BigInt(xValues[j]);
                num *= (0n - xj);
                den *= (xi - xj);
            }
        }
        nums.push(num);
        dens.push(den);
    }
    
    let commonDen = 1n;
    for (const d of dens) {
        commonDen *= d;
    }
    
    let numeratorSum = 0n;
    for (let i = 0; i < k; i++) {
        const yi = points[xValues[i]];
        const term = yi * nums[i] * (commonDen / dens[i]);
        numeratorSum += term;
    }
    
    return numeratorSum / commonDen;
}

function processTestCase(filePath) {
    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    const { n, k } = data.keys;
    
    const points = {};
    for (const key in data) {
        if (key !== 'keys') {
            const x = parseInt(key);
            const base = parseInt(data[key].base);
            const value = data[key].value;
            points[x] = decodeValue(value, base);
        }
    }
    
    const secret = lagrangeInterpolation(points, k);
    console.log(secret.toString());
}

processTestCase('input.json');