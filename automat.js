function hash2(str){
    let hash = 0;
    for (i=0; i<=str.length-1; ++i){
        hash+=(str[i].charCodeAt(0))**2;
    }
    return hash;
}

let args = process.argv;
let r = 2;
let time;
let numberOfOccurrences;
let table;
const idFirstFile = args.length-2;
while (r!==idFirstFile){
    if (args[r]=='-t')
        time=true;
    else if (args[r]=='-n'){
        numberOfOccurrences = Number(args[r+1]);
        r++;
    }
    else if (args[r]=='-a')
        table=true;
    else{
        console.error('You have an error in the input data');
        process.exit(-1);
    }
    r++;
}
fs = require('fs');
if (!fs.existsSync(args[idFirstFile]) || !fs.existsSync(args[idFirstFile+1])) {
    console.error('You have an error with your file');
    process.exit(-1);
}
const S = fs.readFileSync(args[r], 'utf8');
const T = fs.readFileSync(args[r+1], 'utf8');
const t0 = performance.now();
let alphabet = [];
for (i=0; i<T.length; i++){
    if (alphabet.length == 0)
        alphabet.push(T[i]);
    else{
        for (j=0; j<alphabet.length; j++){
            if (alphabet[j]==T[i])
                break;
            if (j==alphabet.length-1 && alphabet[j]!=T[i])
                alphabet.push(T[i]);
        }
    }
}
q = [];
let S0 = '';
let S1 = '';
let hashS0 = 0;
let hashS1 = 0;
for (i=0; i<=T.length; i++){
    if (i!=T.length){
        S0+=T[i];
        hashS0+=(T[i].charCodeAt(0))**2;
    }
    for (j=0; j<alphabet.length; j++){
        S1 = T.slice(0,i) + alphabet[j];
        hashS1 = hash2(T.slice(0,i)) + (alphabet[j].charCodeAt(0))**2;
        if (T[i]==alphabet[j]){
            q.push(i+1);
        }
        else if(i>0){
            copyOfS0 = S0;
            copyOfHashS0 = hashS0;
            for (k=0; k<=i-1; k++){
                copyOfS0 = T.slice(0, i-k);
                S1 = T.slice(k+1, i) + alphabet[j];
                hashS1-=(T[k].charCodeAt(0))**2;
                if (i!=T.length || k!=0 )
                    copyOfHashS0-=(T[i-k].charCodeAt(0))**2;
                if (copyOfHashS0==hashS1){
                    p = 1;
                    for (d=0; d<i-k; d++){
                        if (copyOfS0[d]!=S1[d]){
                            p = 0;
                            break;
                        }
                    }
                    if (p==1){
                        q.push(i-k);
                        break;
                    }
                }
                if (k==i-1 && copyOfHashS0!=hashS1){
                    q.push(0);
                }
            }
        }
        else{
            q.push(0);
        }
    }
}
let condition = 0;
for (i=0; i<S.length; i++){
    if (numberOfOccurrences==0)
        break;
    for (j=0; j<alphabet.length; j++){
        if (S[i]==alphabet[j]){
            condition = q[condition*alphabet.length+j];
            if (condition==T.length){
                console.log(i-condition+1);
                numberOfOccurrences--;
            }
            break;
        }
        if (j==alphabet.length-1 && S[i]!=alphabet[j])
            condition=0;
    }
}
const t1 = performance.now();
if (time==true)
    console.log(t1-t0, 'ms');
if (table==true){
    let whitespace = '';
    let stringAlphabet = '';
    for (i=0; i<alphabet.length; i++){
        whitespace+= ' ';
        if (i!=alphabet.length-1)
            stringAlphabet+=String(alphabet[i])+ ' ';
        else
            stringAlphabet+=String(alphabet[i]);
    }
    console.log(whitespace, stringAlphabet, 0);
    for (w=0; w<=T.length; w++){
        let stringCondition = '';
        for (m=0; m<alphabet.length; m++){
            stringCondition+=String(q[w*alphabet.length+m])+' ';
        }
        console.log(T.slice(0,w), stringCondition, 0);
    }
}
