// src/helpers/emojiTranslator.js

const emojiToTextMap = {
    '😊': 'happy',
    '😂': 'laugh',
    '❤️': 'love',
    '😢': 'sad',
    '👍': 'thumbs_up',
    '🔥': 'fire',
    '🙏': 'thank_you',
    '🎉': 'party',
    '🥳': 'celebrate',
    '😎': 'cool',
    '🤔': 'thinking',
    '😜': 'silly',
    '😏': 'smirk',
    '🤯': 'mind_blown',
    '💀': 'dead',
    '👀': 'watching',
    '💩': 'poop',
    '✨': 'sparkles',
    '😤': 'triumph',
    '😱': 'scream',
    '🤪': 'crazy',
    '👻': 'ghost',
    '😈': 'devil',
    '😇': 'angel',
    '💔': 'broken_heart',
    '😅': 'nervous_laugh',
    '🥺': 'pleading',
    '🥴': 'drunk',
    '🤑': 'money_mouth',
    '🤭': 'secrecy',

};

const textToEmojiMap = {
    'happy': '😊',
    'laugh': '😂',
    'love': '❤️',
    'sad': '😢',
    'thumbs_up': '👍',
    'fire': '🔥',
    'thank_you': '🙏',
    'party': '🎉',
    'celebrate': '🥳',
    'cool': '😎',
    'thinking': '🤔',
    'silly': '😜',
    'smirk': '😏',
    'mind_blown': '🤯',
    'dead': '💀',
    'watching': '👀',
    'poop': '💩',
    'sparkles': '✨',
    'triumph': '😤',
    'scream': '😱',
    'crazy': '🤪',
    'ghost': '👻',
    'devil': '😈',
    'angel': '😇',
    'broken_heart': '💔',
    'nervous_laugh': '😅',
    'pleading': '🥺',
    'drunk': '🥴',
    'money_mouth': '🤑',
    'secrecy': '🤭',

};


export const emojiToText = (text) => {
    if (!text) return '';
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]+)/g, (match) => {
        return emojiToTextMap[match] || match;
    });
};


export const textToEmoji = (text) => {
    if (!text) return '';
    return text.replace(/\b(happy|laugh|love|sad|thumbs_up|fire|thank_you|party|celebrate|cool|thinking|silly|smirk|mind_blown|dead|watching|poop|sparkles|triumph|scream|crazy|ghost|devil|angel|broken_heart|nervous_laugh|pleading|drunk|money_mouth|secrecy)\b/g, (match) => {
        return textToEmojiMap[match.toLowerCase()] || match;
    });
};
