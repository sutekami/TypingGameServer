const randomString = [
    {
        yomi: 'この緑茶は美味しい',
        romaji: 'konoryokutyahaoisii',
    },
    {
        yomi: '天真爛漫な子だ',
        romaji: 'tennsinnrannmannnakoda'
    },
    {
        yomi: 'わたしを離さないで',
        romaji: 'watasiwohanasanaide'
    },
    {
        yomi: '基本情報技術者',
        romaji: 'kihonnjouhougijutusya'
    },
    {
        yomi: '今夜は少し寒くなるようだ',
        romaji: 'konnyahasukosisamukunaruyouda'
    }
]

exports.randamStr = function() {
    let randomStringArray = [];
    for (let i = 0; i < 3; i++){
        const randomStringLength = Math.trunc(Math.random() * randomString.length);
        randomStringArray.push(randomString[randomStringLength]);
    }

    return randomStringArray;
};