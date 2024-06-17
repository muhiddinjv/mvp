const fs = require('fs');
const path = require('path');

console.log('conversion started');
function convertJsonToCsv() {
    const inputDir = path.join(__dirname, 'input');
    const outputDir = path.join(__dirname, 'output');

    for (let i = 1; i <= 114; i++) {
        const inputFile = path.join(inputDir, `${i}.json`);
        const outputFile = path.join(outputDir, `${i}.csv`);

        try {
            const jsonData = JSON.parse(fs.readFileSync(inputFile));
            const verses = jsonData.verses;

            let csvData = '';
            verses.forEach(verse => {
                csvData += `${verse.id},"${verse.text}","${verse.translation}","${verse.transliteration}"\n`;
            });

            fs.writeFileSync(outputFile, csvData);
        } catch (error) {
            console.error(`Failed to process ${inputFile}:`, error);
        }
    }
}
convertJsonToCsv();
console.log('conversion complete');
/*
Read::001 Al-Fatihah 29w
​​​
Read::002 Al-Baqarah 6140w
​​​
Read::003 Ali 'Imran 3501w
​​​
Read::004 An-Nisa 3763w
​​​
Read::005 Al-Ma'idah 2837w
​​​
Read::006 Al-An'am 3056w
​​​
Read::007 Al-A'raf 3341w
​​​
Read::008 Al-Anfal 1242w
​​​
Read::009 At-Tawbah 2505w
​​​
Read::010 Yunus 1839w
​​​
Read::011 Hud 1946w
​​​
Read::012 Yusuf 1795w
​​​
Read::013 Ar-Ra'd 853w
​​​
Read::014 Ibrahim 830w
​​​
Read::015 Al-Hijr 657w
​​​
Read::016 An-Nahl 1844w
​​​
Read::017 Al-Isra 1558w
​​​
Read::018 Al-Kahf 1583w
​​​
Read::019 Maryam 971w
​​​
Read::020 Taha 1353w
​​​
Read::021 Al-Anbya 1174w
​​​
Read::022 Al-Hajj 1279w
​​​
Read::023 Al-Mu'minun 1052w
​​​
Read::024 An-Nur 1319w
​​​
Read::025 Al-Furqan 896w
​​​
Read::026 Ash-Shu'ara 1320w
​​​
Read::027 An-Naml 1159w
​​​
Read::028 Al-Qasas 1438w
​​​
Read::029 Al-'Ankabut 978w
​​​
Read::030 Ar-Rum 817w
​​​
Read::031 Luqman 550w
​​​
Read::032 As-Sajdah 372w
​​​
Read::033 Al-Ahzab 1303w
​​​
Read::034 Saba 884w
​​​
Read::035 Fatir 778w
​​​
Read::036 Ya-Sin 730w
​​​
Read::037 As-Saffat 865w
​​​
Read::038 Sad 735w
​​​
Read::039 Az-Zumar 1177w
​​​
Read::040 Ghafir 1226w
​​​
Read::041 Fussilat 794w
​​​
Read::042 Ash-Shuraa 860w
​​​
Read::043 Az-Zukhruf 836w
​​​
Read::044 Ad-Dukhan 346w
​​​
Read::045 Al-Jathiyah 488w
​​​
Read::046 Al-Ahqaf 645w
​​​
Read::047 Muhammad 542w
​​​
Read::048 Al-Fath 560w
​​​
Read::049 Al-Hujurat 353w
​​​
Read::050 Qaf 373w
​​​
Read::051 Adh-Dhariyat 360w
​​​
Read::052 At-Tur 312w
​​​
Read::053 An-Najm 360w
​​​
Read::054 Al-Qamar 342w
​​​
Read::055 Ar-Rahman 352w
​​​
Read::056 Al-Waqi'ah 379w
​​​
Read::057 Al-Hadid 575w
​​​
Read::058 Al-Mujadila 475w
​​​
Read::059 Al-Hashr 447w
​​​
Read::060 Al-Mumtahanah 352w
​​​
Read::061 As-Saf 226w
​​​
Read::062 Al-Jumu'ah 177w
​​​
Read::063 Al-Munafiqun 181w
​​​
Read::064 At-Taghabun 242w
​​​
Read::065 At-Talaq 289w
​​​
Read::066 At-Tahrim 254w
​​​
Read::067 Al-Mulk 333w
​​​
Read::068 Al-Qalam 301w
​​​
Read::069 Al-Haqqah 260w
​​​
Read::070 Al-Ma'arij 217w
​​​
Read::071 Nuh 227w
​​​
Read::072 Al-Jinn 286w
​​​
Read::073 Al-Muzzammil 200w
​​​
Read::074 Al-Muddaththir 256w
​​​
Read::075 Al-Qiyamah 164w
​​​
Read::076 Al-Insan 243w
​​​
Read::077 Al-Mursalat 181w
​​​
Read::078 An-Naba 174w
​​​
Read::079 An-Nazi'at 179w
​​​
Read::080 'Abasa 133w
​​​
Read::081 At-Takwir 104w
​​​
Read::082 Al-Infitar 81w
​​​
Read::083 Al-Mutaffifin 169w
​​​
Read::084 Al-Inshiqaq 108w
​​​
Read::085 Al-Buruj 109w
​​​
Read::086 At-Tariq 61w
​​​
Read::087 Al-A'la 72w
​​​
Read::088 Al-Ghashiyah 92w
​​​
Read::089 Al-Fajr 139w
​​​
Read::090 Al-Balad 82w
​​​
Read::091 Ash-Shams 54w
​​​
Read::092 Al-Layl 71w
​​​
Read::093 Ad-Duhaa 40w
​​​
Read::094 Ash-Sharh 27w
​​​
Read::095 At-Tin 34w
​​​
Read::096 Al-'Alaq 72w
​​​
Read::097 Al-Qadr 30w
​​​
Read::098 Al-Bayyinah 94w
​​​
Read::099 Az-Zalzalah 36w
​​​
Read::100 Al-'Adiyat 40w

Read::101 Al-Qari'ah 36w
​​​
Read::102 At-Takathur 28w
​​​
Read::103 Al-'Asr 14w
​​​
Read::104 Al-Humazah 33w
​​​
Read::105 Al-Fil 23w
​​​
Read::106 Quraysh 17w
​​​
Read::107 Al-Ma'un 25w
​​​
Read::108 Al-Kawthar 10w
​​​
Read::109 Al-Kafirun 27w
​​​
Read::110 An-Nasr 19w
​​​
Read::111 Al-Masad 23w
​​​
Read::112 Al-Ikhlas 15w
​​​
Read::113 Al-Falaq 23w
​​​
Read::114 An-Nas 20w
*/