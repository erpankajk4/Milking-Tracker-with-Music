export type Language = 'hi' | 'en';

export const translations = {
  hi: {
    appTitle: 'दुहाई',
    appSubtitle: 'शांत संगीत के साथ',
    heroTitle: 'शांत संगीत के साथ दुहाई',
    heroSubtitle: 'समय और दूध की मात्रा दर्ज करें।',
    navMilking: 'दुहाई',
    navHistory: 'इतिहास',
    langToggle: 'English',

    // Running / Paused Titles
    runningTitle: 'दुहाई जारी है',
    pausedTitle: 'दुहाई रुकी हुई है',

    // Badges
    musicPlayingBadge: 'शांत संगीत चल रहा है',
    musicPausedBadge: 'संगीत रुका है',
    musicFailed: 'संगीत शुरू नहीं हो सका',
    musicRetry: 'संगीत पुनः चलाएं',
    musicRetryHint: 'टाइमर सुचारू रूप से चल रहा है। आप संगीत पुनः शुरू कर सकते हैं।',

    // Timer labels
    activeTimeLabel: 'सक्रिय समय',
    pausedTimeNotice: 'विराम का समय अवधि में नहीं जुड़ेगा।',

    // Controls
    startMilking: 'दुहाई शुरू करें',
    pause: 'विराम',
    resume: 'जारी रखें',
    stop: 'समाप्त करें',
    saveSession: 'दूध दर्ज करें',
    notNow: 'अभी नहीं',
    discardSession: 'सत्र छोड़ें',
    saving: 'दर्ज कर रहे हैं...',
    cancel: 'वापस जाएं',
    retry: 'पुनः प्रयास करें',

    // Quantity Modal (UI-05)
    quantityModalTitle: 'कितना दूध मिला?',
    quantityModalSubtitle: 'एकत्र किए गए दूध की मात्रा दर्ज करें।',
    quantityLabel: 'दूध की मात्रा',
    quantityPlaceholder: '5.2',
    quantityHelp: 'लीटर में मात्रा दर्ज करें',
    quantityRequired: 'दूध की मात्रा दर्ज करना आवश्यक है',
    quantityInvalid: 'कृपया 0 से अधिक वैध मात्रा दर्ज करें',
    sessionEndedLabel: 'सत्र समाप्त हुआ',
    totalActiveTimeLabel: 'कुल सक्रिय समय',

    // Discard Modal
    discardTitle: 'क्या आप सत्र छोड़ना चाहते हैं?',
    discardMessage: 'यह विवरण अभी दर्ज नहीं हुआ है। छोड़ने पर यह डेटा स्थायी रूप से मिट जाएगा।',
    confirmDiscard: 'हाँ, सत्र छोड़ें',
    keepSession: 'नहीं, वापस जाएं',

    // Alerts / Errors
    saveSuccess: 'दूध सफलतापूर्वक दर्ज किया गया!',
    saveFailed: 'दूध दर्ज करने में समस्या आई। कृपया पुनः प्रयास करें।',

    // History (UI-09)
    historyTitle: 'दुहाई का इतिहास',
    historySubtitle: 'आपके हाल के सत्र',
    refreshHistory: 'ताज़ा करें',
    tableDate: 'तारीख',
    tableStartTime: 'शुरू',
    tableEndTime: 'समाप्त',
    tableDuration: 'अवधि',
    tableMilkQuantity: 'दूध',
    scrollHint: 'और जानकारी देखने के लिए दाईं ओर स्क्रॉल करें',
    litresUnit: 'लीटर',
    emptyHistoryTitle: 'कोई पिछला सत्र नहीं मिला',
    emptyHistorySubtitle: 'आपने अभी तक कोई दुहाई सत्र दर्ज नहीं किया है।',
    startFirstSession: 'पहला सत्र शुरू करें',
    historyErrorTitle: 'इतिहास लोड नहीं हो सका',

    // Time units
    hours: 'घंटे',
    minutes: 'मिनट',
    seconds: 'सेकंड',
    am: 'सुबह',
    pm: 'शाम'
  },
  en: {
    appTitle: 'Milking',
    appSubtitle: 'With Calming Music',
    heroTitle: 'Milking with Calming Music',
    heroSubtitle: 'Track session time and log milk collected.',
    navMilking: 'Milking',
    navHistory: 'History',
    langToggle: 'हिंदी',

    // Running / Paused Titles
    runningTitle: 'Milking in Progress',
    pausedTitle: 'Milking Paused',

    // Badges
    musicPlayingBadge: 'Calming music playing',
    musicPausedBadge: 'Music paused',
    musicFailed: 'Music playback could not start',
    musicRetry: 'Retry Music',
    musicRetryHint: 'Timer continues normally. You may retry playing the music.',

    // Timer labels
    activeTimeLabel: 'Active Time',
    pausedTimeNotice: 'Paused time is not added to active duration.',

    // Controls
    startMilking: 'Start Milking',
    pause: 'Pause',
    resume: 'Resume',
    stop: 'Stop',
    saveSession: 'Save Session',
    notNow: 'Not Now',
    discardSession: 'Discard Session',
    saving: 'Saving...',
    cancel: 'Cancel',
    retry: 'Retry',

    // Quantity Modal
    quantityModalTitle: 'How much milk was collected?',
    quantityModalSubtitle: 'Please enter the collected milk quantity.',
    quantityLabel: 'Milk Quantity',
    quantityPlaceholder: '5.2',
    quantityHelp: 'Enter quantity in litres',
    quantityRequired: 'Milk quantity is required',
    quantityInvalid: 'Please enter a valid number greater than 0',
    sessionEndedLabel: 'Session Ended',
    totalActiveTimeLabel: 'Total Active Time',

    // Discard Modal
    discardTitle: 'Discard this session?',
    discardMessage: 'This session has not been saved. Discarding will permanently lose this data.',
    confirmDiscard: 'Yes, Discard Session',
    keepSession: 'No, Keep Session',

    // Alerts / Errors
    saveSuccess: 'Session saved successfully!',
    saveFailed: 'Failed to save session. Please retry.',

    // History
    historyTitle: 'Milking History',
    historySubtitle: 'Your recent sessions',
    refreshHistory: 'Refresh',
    tableDate: 'Date',
    tableStartTime: 'Start',
    tableEndTime: 'End',
    tableDuration: 'Duration',
    tableMilkQuantity: 'Milk',
    scrollHint: 'Scroll right to view more session details',
    litresUnit: 'Litres',
    emptyHistoryTitle: 'No Sessions Found',
    emptyHistorySubtitle: 'You have not recorded any milking sessions yet.',
    startFirstSession: 'Start First Session',
    historyErrorTitle: 'Failed to Load History',

    // Time units
    hours: 'hrs',
    minutes: 'min',
    seconds: 'sec',
    am: 'AM',
    pm: 'PM'
  }
};
