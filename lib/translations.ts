/**
 * TRANSLATIONS DICTIONARY
 * 
 * Complete English ↔ Tamil translations for all UI text
 * Organized by page/section for easy maintenance
 */

export type Language = 'en' | 'ta';

export interface Translations {
    // Navigation
    nav: {
        dashboard: string;
        lessons: string;
        progress: string;
        profile: string;
        settings: string;
        signOut: string;
    };

    // Common/Shared
    common: {
        loading: string;
        error: string;
        tryAgain: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        confirm: string;
        back: string;
        next: string;
        previous: string;
        complete: string;
        start: string;
        continue: string;
        close: string;
        search: string;
        filter: string;
        all: string;
        language: string;
        addLanguage: string;
        uiLanguage: string;
    };

    // Dashboard
    dashboard: {
        welcome: string;
        welcomeBack: string;
        yourLearningJourney: string;
        streak: string;
        daysInRow: string;
        lessons: string;
        completed: string;
        words: string;
        wordsLearned: string;
        practice: string;
        minutesTotal: string;
        currentGoal: string;
        focusMode: string;
        focusModeDesc: string;
        suggestedForYou: string;
        startLesson: string;
        continueLesson: string;
        recentActivity: string;
        achievements: string;
        viewAll: string;
    };

    // Lessons Page
    lessons: {
        title: string;
        available: string;
        browsePace: string;
        searchLessons: string;
        allStatuses: string;
        notStarted: string;
        inProgress: string;
        completed: string;
        mastered: string;
        noLessonsFound: string;
        adjustFilters: string;
        beginLesson: string;
        resumeLesson: string;
        retakeLesson: string;
        duration: string;
        minutes: string;
        beginner: string;
        intermediate: string;
        advanced: string;
    };

    // Lesson Detail
    lessonDetail: {
        loading: string;
        notFound: string;
        step: string;
        of: string;
        instructions: string;
        vocabulary: string;
        examples: string;
        practice: string;
        practiceQuestions: string;
        summary: string;
        nextStep: string;
        previousStep: string;
        completeLesson: string;
        checkAnswer: string;
        correct: string;
        tryAgain: string;
        wellDone: string;
        keepPracticing: string;
    };

    // Progress Page
    progress: {
        title: string;
        overview: string;
        statistics: string;
        totalLessons: string;
        lessonsCompleted: string;
        averageScore: string;
        timeSpent: string;
        currentStreak: string;
        longestStreak: string;
        wordsLearned: string;
        masteredTopics: string;
        byLanguage: string;
        recentProgress: string;
    };

    // Profile Page
    profile: {
        title: string;
        personalInfo: string;
        name: string;
        email: string;
        age: string;
        learningLanguages: string;
        accessibility: string;
        preferences: string;
        editProfile: string;
        changePassword: string;
        accountSettings: string;
    };

    // Settings Page
    settings: {
        title: string;
        general: string;
        accessibility: string;
        notifications: string;
        privacy: string;
        appearance: string;
        fontSize: string;
        fontFamily: string;
        lineSpacing: string;
        letterSpacing: string;
        highContrast: string;
        reducedMotion: string;
        screenReader: string;
        adhdMode: string;
        dyslexiaMode: string;
        textToSpeech: string;
        speechRecognition: string;
    };

    // Status Messages
    status: {
        savingProgress: string;
        progressSaved: string;
        lessonCompleted: string;
        achievementEarned: string;
        errorOccurred: string;
        connectionLost: string;
        dataLoading: string;
    };
}

export const translations: Record<Language, Translations> = {
    en: {
        nav: {
            dashboard: 'Dashboard',
            lessons: 'Lessons',
            progress: 'Progress',
            profile: 'Profile',
            settings: 'Settings',
            signOut: 'Sign out',
        },

        common: {
            loading: 'Loading...',
            error: 'Error',
            tryAgain: 'Try again',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            confirm: 'Confirm',
            back: 'Back',
            next: 'Next',
            previous: 'Previous',
            complete: 'Complete',
            start: 'Start',
            continue: 'Continue',
            close: 'Close',
            search: 'Search',
            filter: 'Filter',
            all: 'All',
            language: 'Language',
            addLanguage: 'Add a language',
            uiLanguage: 'Interface Language',
        },

        dashboard: {
            welcome: 'Welcome',
            welcomeBack: 'Welcome back',
            yourLearningJourney: 'Your learning journey at your own pace.',
            streak: 'Streak',
            daysInRow: 'days in a row',
            lessons: 'Lessons',
            completed: 'completed',
            words: 'Words',
            wordsLearned: 'words learned',
            practice: 'Practice',
            minutesTotal: 'minutes total',
            currentGoal: 'Current Goal',
            focusMode: 'Focus Mode',
            focusModeDesc: 'Minimize distractions and focus on one lesson at a time',
            suggestedForYou: 'Suggested for you',
            startLesson: 'Start lesson',
            continueLesson: 'Continue lesson',
            recentActivity: 'Recent Activity',
            achievements: 'Achievements',
            viewAll: 'View all',
        },

        lessons: {
            title: 'Lessons',
            available: 'lessons available. Browse at your own pace.',
            browsePace: 'Browse at your own pace.',
            searchLessons: 'Search lessons...',
            allStatuses: 'All statuses',
            notStarted: 'Not started',
            inProgress: 'In progress',
            completed: 'Completed',
            mastered: 'Mastered',
            noLessonsFound: 'No matching lessons found',
            adjustFilters: 'Try adjusting your search or filters.',
            beginLesson: 'Begin Lesson',
            resumeLesson: 'Resume Lesson',
            retakeLesson: 'Retake Lesson',
            duration: 'Duration',
            minutes: 'minutes',
            beginner: 'Beginner',
            intermediate: 'Intermediate',
            advanced: 'Advanced',
        },

        lessonDetail: {
            loading: 'Loading lesson...',
            notFound: 'Lesson not found',
            step: 'Step',
            of: 'of',
            instructions: 'Instructions',
            vocabulary: 'Vocabulary',
            examples: 'Examples',
            practice: 'Practice',
            practiceQuestions: 'Practice Questions',
            summary: 'Summary',
            nextStep: 'Next Step',
            previousStep: 'Previous Step',
            completeLesson: 'Complete Lesson',
            checkAnswer: 'Check Answer',
            correct: 'Correct!',
            tryAgain: 'Try again',
            wellDone: 'Well done!',
            keepPracticing: 'Keep practicing!',
        },

        progress: {
            title: 'Progress',
            overview: 'Overview',
            statistics: 'Statistics',
            totalLessons: 'Total Lessons',
            lessonsCompleted: 'Lessons Completed',
            averageScore: 'Average Score',
            timeSpent: 'Time Spent',
            currentStreak: 'Current Streak',
            longestStreak: 'Longest Streak',
            wordsLearned: 'Words Learned',
            masteredTopics: 'Mastered Topics',
            byLanguage: 'By Language',
            recentProgress: 'Recent Progress',
        },

        profile: {
            title: 'Profile',
            personalInfo: 'Personal Information',
            name: 'Name',
            email: 'Email',
            age: 'Age',
            learningLanguages: 'Learning Languages',
            accessibility: 'Accessibility',
            preferences: 'Preferences',
            editProfile: 'Edit Profile',
            changePassword: 'Change Password',
            accountSettings: 'Account Settings',
        },

        settings: {
            title: 'Settings',
            general: 'General',
            accessibility: 'Accessibility',
            notifications: 'Notifications',
            privacy: 'Privacy',
            appearance: 'Appearance',
            fontSize: 'Font Size',
            fontFamily: 'Font Family',
            lineSpacing: 'Line Spacing',
            letterSpacing: 'Letter Spacing',
            highContrast: 'High Contrast',
            reducedMotion: 'Reduced Motion',
            screenReader: 'Screen Reader',
            adhdMode: 'ADHD Mode',
            dyslexiaMode: 'Dyslexia Mode',
            textToSpeech: 'Text to Speech',
            speechRecognition: 'Speech Recognition',
        },

        status: {
            savingProgress: 'Saving progress...',
            progressSaved: 'Progress saved',
            lessonCompleted: 'Lesson completed!',
            achievementEarned: 'Achievement earned!',
            errorOccurred: 'An error occurred',
            connectionLost: 'Connection lost',
            dataLoading: 'Loading your data...',
        },
    },

    ta: {
        nav: {
            dashboard: 'டாஷ்போர்டு',
            lessons: 'பாடங்கள்',
            progress: 'முன்னேற்றம்',
            profile: 'சுயவிவரம்',
            settings: 'அமைப்புகள்',
            signOut: 'வெளியேறு',
        },

        common: {
            loading: 'ஏற்றுகிறது...',
            error: 'பிழை',
            tryAgain: 'மீண்டும் முயற்சிக்கவும்',
            save: 'சேமி',
            cancel: 'ரத்து செய்',
            delete: 'நீக்கு',
            edit: 'திருத்து',
            confirm: 'உறுதிப்படுத்து',
            back: 'பின்',
            next: 'அடுத்து',
            previous: 'முந்தைய',
            complete: 'முழுமை',
            start: 'தொடங்கு',
            continue: 'தொடர்',
            close: 'மூடு',
            search: 'தேடு',
            filter: 'வடிகட்டி',
            all: 'அனைத்தும்',
            language: 'மொழி',
            addLanguage: 'மொழி சேர்க்கவும்',
            uiLanguage: 'இடைமுக மொழி',
        },

        dashboard: {
            welcome: 'வரவேற்பு',
            welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
            yourLearningJourney: 'உங்கள் கற்றல் பயணம் உங்கள் சொந்த வேகத்தில்.',
            streak: 'தொடர்ச்சி',
            daysInRow: 'நாட்கள் தொடர்ந்து',
            lessons: 'பாடங்கள்',
            completed: 'முடிந்தது',
            words: 'சொற்கள்',
            wordsLearned: 'சொற்கள் கற்றது',
            practice: 'பயிற்சி',
            minutesTotal: 'மொத்த நிமிடங்கள்',
            currentGoal: 'தற்போதைய இலக்கு',
            focusMode: 'கவன முறை',
            focusModeDesc: 'கவனச்சிதறல்களைக் குறைத்து ஒரு நேரத்தில் ஒரு பாடத்தில் கவனம் செலுத்துங்கள்',
            suggestedForYou: 'உங்களுக்கான பரிந்துரைகள்',
            startLesson: 'பாடம் தொடங்கவும்',
            continueLesson: 'பாடம் தொடரவும்',
            recentActivity: 'சமீபத்திய செயல்பாடு',
            achievements: 'சாதனைகள்',
            viewAll: 'அனைத்தையும் பார்',
        },

        lessons: {
            title: 'பாடங்கள்',
            available: 'பாடங்கள் கிடைக்கின்றன. உங்கள் வேகத்தில் உலாவவும்.',
            browsePace: 'உங்கள் சொந்த வேகத்தில் உலாவவும்.',
            searchLessons: 'பாடங்களைத் தேடு...',
            allStatuses: 'அனைத்து நிலைகள்',
            notStarted: 'தொடங்கவில்லை',
            inProgress: 'முன்னேற்றத்தில்',
            completed: 'முடிந்தது',
            mastered: 'தேர்ச்சி பெற்றது',
            noLessonsFound: 'பொருத்தமான பாடங்கள் இல்லை',
            adjustFilters: 'உங்கள் தேடல் அல்லது வடிகட்டிகளை சரிசெய்யவும்.',
            beginLesson: 'பாடத்தைத் தொடங்கு',
            resumeLesson: 'பாடத்தைத் தொடரவும்',
            retakeLesson: 'பாடத்தை மீண்டும் எடு',
            duration: 'காலம்',
            minutes: 'நிமிடங்கள்',
            beginner: 'தொடக்க நிலை',
            intermediate: 'இடைநிலை',
            advanced: 'மேம்பட்ட',
        },

        lessonDetail: {
            loading: 'பாடம் ஏற்றுகிறது...',
            notFound: 'பாடம் கிடைக்கவில்லை',
            step: 'படி',
            of: 'இல்',
            instructions: 'வழிமுறைகள்',
            vocabulary: 'சொல்லகராதி',
            examples: 'எடுத்துக்காட்டுகள்',
            practice: 'பயிற்சி',
            practiceQuestions: 'பயிற்சி கேள்விகள்',
            summary: 'சுருக்கம்',
            nextStep: 'அடுத்த படி',
            previousStep: 'முந்தைய படி',
            completeLesson: 'பாடத்தை முடிக்கவும்',
            checkAnswer: 'பதிலைச் சரிபார்க்கவும்',
            correct: 'சரி!',
            tryAgain: 'மீண்டும் முயற்சிக்கவும்',
            wellDone: 'நன்றாக செய்தீர்கள்!',
            keepPracticing: 'தொடர்ந்து பயிற்சி செய்யுங்கள்!',
        },

        progress: {
            title: 'முன்னேற்றம்',
            overview: 'மேலோட்டம்',
            statistics: 'புள்ளிவிவரங்கள்',
            totalLessons: 'மொத்த பாடங்கள்',
            lessonsCompleted: 'முடிந்த பாடங்கள்',
            averageScore: 'சராசரி மதிப்பெண்',
            timeSpent: 'செலவழித்த நேரம்',
            currentStreak: 'தற்போதைய தொடர்ச்சி',
            longestStreak: 'நீண்ட தொடர்ச்சி',
            wordsLearned: 'கற்ற சொற்கள்',
            masteredTopics: 'தேர்ச்சி பெற்ற தலைப்புகள்',
            byLanguage: 'மொழி வாரியாக',
            recentProgress: 'சமீபத்திய முன்னேற்றம்',
        },

        profile: {
            title: 'சுயவிவரம்',
            personalInfo: 'தனிப்பட்ட தகவல்',
            name: 'பெயர்',
            email: 'மின்னஞ்சல்',
            age: 'வயது',
            learningLanguages: 'கற்கும் மொழிகள்',
            accessibility: 'அணுகல்தன்மை',
            preferences: 'விருப்பத்தேர்வுகள்',
            editProfile: 'சுயவிவரத்தை திருத்து',
            changePassword: 'கடவுச்சொல்லை மாற்று',
            accountSettings: 'கணக்கு அமைப்புகள்',
        },

        settings: {
            title: 'அமைப்புகள்',
            general: 'பொது',
            accessibility: 'அணுகல்தன்மை',
            notifications: 'அறிவிப்புகள்',
            privacy: 'தனியுரிமை',
            appearance: 'தோற்றம்',
            fontSize: 'எழுத்துரு அளவு',
            fontFamily: 'எழுத்துரு குடும்பம்',
            lineSpacing: 'வரி இடைவெளி',
            letterSpacing: 'எழுத்து இடைவெளி',
            highContrast: 'உயர் வேறுபாடு',
            reducedMotion: 'குறைக்கப்பட்ட இயக்கம்',
            screenReader: 'திரை வாசிப்பான்',
            adhdMode: 'ADHD முறை',
            dyslexiaMode: 'டிஸ்லெக்ஸியா முறை',
            textToSpeech: 'உரையிலிருந்து பேச்சு',
            speechRecognition: 'பேச்சு அங்கீகாரம்',
        },

        status: {
            savingProgress: 'முன்னேற்றம் சேமிக்கப்படுகிறது...',
            progressSaved: 'முன்னேற்றம் சேமிக்கப்பட்டது',
            lessonCompleted: 'பாடம் முடிந்தது!',
            achievementEarned: 'சாதனை பெற்றது!',
            errorOccurred: 'பிழை ஏற்பட்டது',
            connectionLost: 'இணைப்பு துண்டிக்கப்பட்டது',
            dataLoading: 'உங்கள் தரவை ஏற்றுகிறது...',
        },
    },
};
