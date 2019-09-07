export const DEFAULT = 'EN';
export const SECONDARY = 'HE';

const locale = {
  HE: {
    slogan: 'קראתי',
    subSlogan: 'קראת ? החלפת',
    auth: { 
      profile: 'הפרופיל שלי',
      stats: 'נתונים',
      settings: 'ההגדרות שלי'
    },
    myShelf: {
      button: 'המדף שלי'
    },
    wishlist: {
      button: 'תודיעו לי כשזה זמין'
    },
    myMatches: {
      primary: 'ההתאמות שלי'
    },
    myProposals: {
      button: 'ההצעות שלי'
    },
    mySwipes: {
      button: 'ספרים שרציתי'
    },
    nearby: {
      button: 'להחלפה מסביבי'
    },
    explore: {
      browse: 'דפדוף',
      swipe: 'החלקה'
    },
    header: {
      explore: 'ספרים להחלפה מסביבי',
      myStuff: 'שאר העניינים'
    },
    preview: {
      myShelf: {
        primary: 'החליפו ספרים שכבר קראתם במקום שיעלו אבק',
        secondary: 'כן, להחליף ספרים זה כיף אני רוצה גם'
      },
      nearby: {
        primary: 'קפצו ראש לתוך ההרפתקה הבאה שלכם',
        secondary: 'תראה לי מה אנשים אחרים מציעים מסביבי להחלפה'
      }
    }
  },

  EN: {
    slogan: 'Karati',
    subSlogan: 'Read it ? Swap it',
    auth: { 
      profile: 'My Profile',
      stats: 'Infographics',
      settings: 'Settings'
    },
    myShelf: {
      button: 'My Shelf'
    },
    wishlist: {
      button: 'My Wishlist'
    },
    myMatches: {
      primary: 'My Matches'
    },
    myProposals: {
      button: 'My Proposals'
    },
    mySwipes: {
      button: 'Books I marked'
    },
    nearby: {
      button: 'Books Nearby'
    },
    explore: {
      browse: 'Browse',
      swipe: 'Swipe'
    },
    header: {
      explore: 'Explore Books Around You',
      myStuff: 'My Stuff'
    },
    preview: {
      myShelf: {
        primary: 'Give away your old, dusty books',
        secondary: 'Add some of my old books up for exchange'
      },
      nearby: {
        primary: 'Dive into new, untold adventures',
        secondary: 'See whats up for grabs around my location'
      }
    }
  }
};

export const getString = (language, stringId) => {
  if (!language) {
    console.warn('getString, language is undefined');
    return;
  }

  if (stringId.includes('.'))
    stringId = stringId.split('.');

  let getStr = locale[language];
  if (!getStr) {
    console.warn(`getString, invalid language received: ${language}`);
    const alternativeLanguage = language === DEFAULT ? SECONDARY : DEFAULT;
    getStr = locale[alternativeLanguage];
  }

  if (Array.isArray(stringId)) {
    let i = 0;

    while (i < stringId.length) {
      getStr = getStr[stringId[i]];

      i++;

      if (!getStr) {
        console.warn(
          `getString, string not found in any language. ID: ${stringId}`
        );
        return;
      }
    }
  } else {
    getStr = getStr[stringId];
  }

  return getStr;
};
