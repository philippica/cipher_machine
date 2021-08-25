import { words } from "../common/dict";

export class OneWord {
    constructor() {

    }

    editDistance(s1, s2) {
        var row2 = [];
        if (s1 === s2) {
            return 0;
        } else {
            var s1_len = s1.length, s2_len = s2.length;
            if (s1_len && s2_len) {
                var i1 = 0, i2 = 0, a, b, c, c2, row = row2;
                while (i1 < s1_len)
                    row[i1] = ++i1;
                while (i2 < s2_len) {
                    c2 = s2.charCodeAt(i2);
                    a = i2;
                    ++i2;
                    b = i2;
                    for (i1 = 0; i1 < s1_len; ++i1) {
                        c = a + (s1.charCodeAt(i1) === c2 ? 0 : 1);
                        a = row[i1];
                        b = b < a ? (b < c ? b + 1 : c) : (a < c ? a + 1 : c);
                        row[i1] = b;
                    }
                }
                return b;
            } else {
                return s1_len + s2_len;
            }
        }
    }


    findByRegularExpression(str) {
        const regularExpression = eval(`/${str}/`);
        const answer = [];
        for(let patten in words) {
            if(!patten)continue;
            for(let word of words[patten]) {
                if(regularExpression.test(word)) {
                    console.info(word);
                    answer.push(word);
                }
            }
        }
        return answer;
    }

    findByWildcard(wildcard) {
        const regx = wildcard.replaceAll("#", ".").replaceAll('*', '.*');
        return this.findByRegularExpression(`^${regx}$`);
    }

    contains(letterSet) {
        const answer = [];
        for(let patten in words) {
            if(!patten)continue;
            for(let word of words[patten]) {
                if(regularExpression.test(word)) {
                    console.info(word);
                    answer.push(word);
                }
            }
        }
        return answer;
    }



    findSimilarity(str) {
        const answer = [];
        for(let patten in words) {
            if(!patten)continue;
            for(let word of words[patten]) {
                if(this.editDistance(str, word) <= 1) {
                    console.info(word);
                    answer.push(word);
                }
            }
        }
        return answer;
    }
}