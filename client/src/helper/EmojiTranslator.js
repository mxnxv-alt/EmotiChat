const emojiToTextMap = {
    '😊': ['happy', 'joy', 'content', 'delighted'],
    '😂': ['laugh', 'lol', 'hilarious', 'funny'],
    '❤️': ['love', 'heart', 'affection', 'fond'],
    '😢': ['sad', 'tearful', 'upset', 'crying'],
    '👍': ['thumbs up', 'approval', 'well done', 'good job'],
    '🔥': ['fire', 'lit', 'hot', 'awesome'],
    '🙏': ['thank you', 'thanks', 'appreciation', 'gratitude'],
    '🎉': ['party', 'celebration', 'festivity', 'cheer'],
    '🥳': ['celebrate', 'party', 'joyful', 'festive'],
    '😎': ['cool', 'awesome', 'chill', 'smooth'],
    '🤔': ['thinking', 'pondering', 'wondering', 'curious'],
    '😜': ['silly', 'playful', 'mischievous', 'wacky'],
    '😏': ['smirk', 'sly', 'sneaky', 'mischievous'],
    '🤯': ['mind blown', 'shocked', 'amazed', 'astonished'],
    '💀': ['dead', 'skull', 'death', 'end'],
    '👀': ['side eye', 'looking', 'observing', 'staring'],
    '💩': ['poop', 'crap', 'waste', 'dung'],
    '✨': ['sparkles', 'shiny', 'glimmer', 'bright'],
    '😤': ['triumph', 'proud', 'victory', 'success'],
    '😱': ['scream', 'scared', 'terrified', 'shocked'],
    '🤪': ['crazy', 'wild', 'wacky', 'mad'],
    '👻': ['ghost', 'spooky', 'spirit', 'phantom'],
    '😈': ['devil', 'evil', 'sly', 'wicked'],
    '😇': ['angel', 'innocent', 'pure', 'holy'],
    '💔': ['broken heart', 'heartbreak', 'sadness', 'loss'],
    '😅': ['nervous laugh', 'awkward', 'embarrassed', 'sheepish'],
    '🥺': ['pleading', 'begging', 'imploring', 'asking'],
    '🥴': ['drunk', 'dizzy', 'woozy', 'intoxicated'],
    '🤑': ['money mouth', 'rich', 'greedy', 'cash'],
    '🤭': ['secrecy', 'shhh', 'quiet', 'hush'],
    '💪': ['strong', 'powerful', 'muscular', 'fit'],
    '🤝': ['handshake', 'agreement', 'deal', 'partnership'],
    '💫': ['dizzy', 'spinning', 'disoriented', 'confused'],
    '🌟': ['star', 'bright', 'shiny', 'famous'],
    '🎶': ['music', 'melody', 'tune', 'song'],
    '🍕': ['pizza', 'food', 'slice', 'meal'],
    '⚽': ['soccer', 'football', 'game', 'sports'],
    '🚀': ['rocket', 'launch', 'space', 'blast off'],
    '🌈': ['rainbow', 'colors', 'pride', 'spectrum'],
    '🎂': ['birthday', 'cake', 'celebration', 'anniversary'],
    '🌍': ['earth', 'world', 'planet', 'globe'],
    '🏆': ['trophy', 'winner', 'award', 'champion'],
    '👑': ['king', 'queen', 'royalty', 'crown'],
    '💡': ['idea', 'thought', 'innovation', 'inspiration'],
    '🌞': ['sun', 'bright', 'warm', 'sunny'],
    '🌧️': ['rain', 'drizzle', 'storm', 'weather'],
    '⛄': ['snowman', 'winter', 'cold', 'snow'],
    '🍔': ['burger', 'food', 'meal', 'fast food'],
    '☕': ['coffee', 'drink', 'caffeine', 'beverage'],
    '🍫': ['chocolate', 'candy', 'sweet', 'dessert'],
    '🌸': ['flower', 'blossom', 'bloom', 'nature'],
    '📚': ['books', 'reading', 'study', 'learn'],
    '✈️': ['plane', 'travel', 'flight', 'trip'],
    '🏠': ['house', 'home', 'building', 'residence'],
    '🔑': ['key', 'unlock', 'access', 'open'],
    '📅': ['calendar', 'schedule', 'date', 'event'],
    '🧁': ['cupcake', 'dessert', 'sweet', 'treat'],
};

const textToEmojiMap = {
    'happy': '😊', 'joy': '😊', 'content': '😊', 'delighted': '😊',
    'laugh': '😂', 'lol': '😂', 'hilarious': '😂', 'funny': '😂',
    'love': '❤️', 'heart': '❤️', 'affection': '❤️', 'fond': '❤️',
    'sad': '😢', 'tearful': '😢', 'upset': '😢', 'crying': '😢',
    'thumbs up': '👍', 'approval': '👍', 'well done': '👍', 'good job': '👍',
    'fire': '🔥', 'lit': '🔥', 'hot': '🔥', 'awesome': '🔥',
    'thank you': '🙏', 'thanks': '🙏', 'appreciation': '🙏', 'gratitude': '🙏',
    'party': '🎉', 'celebration': '🎉', 'festivity': '🎉', 'cheer': '🎉',
    'celebrate': '🥳', 'joyful': '🥳', 'festive': '🥳', 'party': '🥳',
    'cool': '😎', 'awesome': '😎', 'chill': '😎', 'smooth': '😎',
    'thinking': '🤔', 'pondering': '🤔', 'wondering': '🤔', 'curious': '🤔',
    'silly': '😜', 'playful': '😜', 'mischievous': '😜', 'wacky': '😜',
    'smirk': '😏', 'sly': '😏', 'sneaky': '😏', 'mischievous': '😏',
    'mind blown': '🤯', 'shocked': '🤯', 'amazed': '🤯', 'astonished': '🤯',
    'dead': '💀', 'skull': '💀', 'death': '💀', 'end': '💀',
    'side eye': '👀', 'looking': '👀', 'observing': '👀', 'staring': '👀',
    'poop': '💩', 'crap': '💩', 'waste': '💩', 'dung': '💩',
    'sparkles': '✨', 'shiny': '✨', 'glimmer': '✨', 'bright': '✨',
    'triumph': '😤', 'proud': '😤', 'victory': '😤', 'success': '😤',
    'scream': '😱', 'scared': '😱', 'terrified': '😱', 'shocked': '😱',
    'crazy': '🤪', 'wild': '🤪', 'wacky': '🤪', 'mad': '🤪',
    'ghost': '👻', 'spooky': '👻', 'spirit': '👻', 'phantom': '👻',
    'devil': '😈', 'evil': '😈', 'sly': '😈', 'wicked': '😈',
    'angel': '😇', 'innocent': '😇', 'pure': '😇', 'holy': '😇',
    'broken heart': '💔', 'heartbreak': '💔', 'sadness': '💔', 'loss': '💔',
    'nervous laugh': '😅', 'awkward': '😅', 'embarrassed': '😅', 'sheepish': '😅',
    'pleading': '🥺', 'begging': '🥺', 'imploring': '🥺', 'asking': '🥺',
    'drunk': '🥴', 'dizzy': '🥴', 'woozy': '🥴', 'intoxicated': '🥴',
    'money mouth': '🤑', 'rich': '🤑', 'greedy': '🤑', 'cash': '🤑',
    'secrecy': '🤭', 'shhh': '🤭', 'quiet': '🤭', 'hush': '🤭',
    'strong': '💪', 'powerful': '💪', 'muscular': '💪', 'fit': '💪',
    'handshake': '🤝', 'agreement': '🤝', 'deal': '🤝', 'partnership': '🤝',
    'dizzy': '💫', 'spinning': '💫', 'disoriented': '💫', 'confused': '💫',
    'star': '🌟', 'bright': '🌟', 'shiny': '🌟', 'famous': '🌟',
    'music': '🎶', 'melody': '🎶', 'tune': '🎶', 'song': '🎶',
    'pizza': '🍕', 'food': '🍕', 'slice': '🍕', 'meal': '🍕',
    'soccer': '⚽', 'football': '⚽', 'game': '⚽', 'sports': '⚽',
    'rocket': '🚀', 'launch': '🚀', 'space': '🚀', 'blast off': '🚀',
    'rainbow': '🌈', 'colors': '🌈', 'pride': '🌈', 'spectrum': '🌈',
    'birthday': '🎂', 'cake': '🎂', 'celebration': '🎂', 'anniversary': '🎂',
    'earth': '🌍', 'world': '🌍', 'planet': '🌍', 'globe': '🌍',
    'trophy': '🏆', 'winner': '🏆', 'award': '🏆', 'champion': '🏆',
    'king': '👑', 'queen': '👑', 'royalty': '👑', 'crown': '👑',
    'idea': '💡', 'thought': '💡', 'innovation': '💡', 'inspiration': '💡',
    'sun': '🌞', 'bright': '🌞', 'warm': '🌞', 'sunny': '🌞',
    'rain': '🌧️', 'storm': '🌧️', 'drizzle': '🌧️', 'weather': '🌧️',
    'snowman': '⛄', 'winter': '⛄', 'cold': '⛄', 'snow': '⛄',
    'burger': '🍔', 'meal': '🍔', 'food': '🍔', 'fast food': '🍔',
    'coffee': '☕', 'drink': '☕', 'caffeine': '☕', 'beverage': '☕',
    'chocolate': '🍫', 'candy': '🍫', 'sweet': '🍫', 'dessert': '🍫',
    'flower': '🌸', 'blossom': '🌸', 'bloom': '🌸', 'nature': '🌸',
    'books': '📚', 'reading': '📚', 'study': '📚', 'learn': '📚',
    'plane': '✈️', 'travel': '✈️', 'flight': '✈️', 'trip': '✈️',
    'house': '🏠', 'home': '🏠', 'building': '🏠', 'residence': '🏠',
    'key': '🔑', 'unlock': '🔑', 'access': '🔑', 'open': '🔑',
    'calendar': '📅', 'schedule': '📅', 'date': '📅', 'event': '📅',
    'cupcake': '🧁', 'dessert': '🧁', 'sweet': '🧁', 'treat': '🧁',
};

export const emojiToText = (text) => {
    if (!text) return '';
    return text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD83C-\uDBFF\uDC00-\uDFFF]+)/g, (match) => {
        const words = emojiToTextMap[match];
        return words ? words[0] : match; // Choose the first synonym as default
    });
};

export const textToEmoji = (text) => {
    if (!text) return '';

    // Dynamically create a regex pattern from textToEmojiMap keys
    const keys = Object.keys(textToEmojiMap).map(escapeRegExp).join('|');
    const regex = new RegExp(`\\b(${keys})\\b`, 'gi'); // Case-insensitive match

    // Replace matches with the corresponding emoji
    return text.replace(regex, (match) => textToEmojiMap[match.toLowerCase()] || match);
};

// Helper function to escape special regex characters
const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
