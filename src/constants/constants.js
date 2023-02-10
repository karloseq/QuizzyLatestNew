export const TAG_SUGGESTIONS = [
    /*Mathematics*/
    "Pre-Algebra",
    "Algebra 1",
    "Algebra 2",
    "Geometry",
    "Trigonometry",
    "Pre-Calculus",
    "Calculus",
    "Differential Equations",
    "Statistics",
    "Integrated math",
    "Abstract Algebra",
    "Probability and statistics",
    
    /*History*/
    "American History",
    "World History",
    "Geography",
    "US Government",
    "European history",
    "International relations",
    "Economics",
    "Psychology",
    "Women's studies",
    "Religious studies",
    "Sociology",
    "Anthropology",
    "Political science",
    "Current events",
    "World religions",
    /*Science*/
    "Earth science",
    "Physical science",
    "Biology",
    "Chemistry",
    "Organic chemistry",
    "Physics",
    "Life science",
    "Environmental science",
    "Astronomy",
    "Zoology",
    "Oceanography",
    "Forensic science",
    "Botany",
    /*Health*/
    "Health",
    "Mental Health",
    "Nursing",
    /*Foreign Languages*/
    "Spanish",
    "French",
    "German",
    "Latin",
    "American Sign Language",
    "Portuguese",
    "Arabic",
    "Chinese",
    "Japanese",
    "Korean",
    "Italian",
    "Russian",
    "Hindi",
    "Nepali", //hehe
    /*Electives*/
    /*Language & Arts*/
    "African literature",
    "Asian literature",
    "British literature",
    "Cinema studies",
    "Contemporary literature",
    "Creative writing",
    "Debate",
    "Film study",
    "Gothic literature",
    "Humanities",
    "Journalism",
    "Poetry",
    "Popular literature",
    "Practical writing",
    "Public speaking",
    "Rhetoric",
    "Works of Shakespeare",
    "World literature",
    /*Performing Arts*/
    "Choir",
    "Jazz band",
    "Concert band",
    "Marching band",
    "Orchestra",
    "Music theory",
    "Dance",
    "Drama",
    /*Visual Arts*/
    "Art history",
    "Drawing",
    "Painting",
    "Digital media",
    "Film production",
    "Photography",
    "Printmaking",
    "Sculpture",
    "Ceramics",
    /*Physical Education*/
    "Team sports",
    "Health",
    "Wellness",
    "Swimming",
    "Gymnastics",
    "Weight training",
    "Aerobics",
    "Racket sports",
    "Yoga",
    "Physical education",
    /*Business*/
    "Accounting",
    "Entrepreneurship",
    "Marketing",
    "Personal finance",
    "Business",
    /*Computer Science and Information Technology*/
    "Artificial Intelligence",
    "Computer literacy",
    "Computer programming",
    "Computer science",
    "Graphic design",
    "Film production",
    "Music production",
    "Web design",
    "Word processing",
    "Media studies",
    /*Family and Consumer Science*/
    "Culinary arts",
    "Chemistry of foods",
    "Early childhood development",
    "Fashion and retail merchandising",
    "Home economics",
    "Nutrition",
    "CPR",
    "Fashion design",
    "Retail marketing",
    /*Vocational Education*/
    "Auto repair",
    "Woodworking",
    "Computer-aided drafting",
    "Driver education",
    "Cosmetology",
    "JROTC",
    "Networking",
    "Metalworking",
    "Robotics",
    "FFA",
    "Electronics",
    /*Advanced Placement*/
    "AP Research",
    "AP Seminar",
    "AP Art & Design",
    "AP Music Theory",
    "AP English Language & Composition",
    "AP English Literature & Composition",
    "AP Comparative Government and Politics",
    "AP European History",
    "AP Human Geography",
    "AP Macroeconomics",
    "AP Microeconomics",
    "AP Psychology",
    "AP United States Government and Politics",
    "AP United States History",
    "AP World History: Modern",
    "AP Calculus AB",
    "AP Calculus BC",
    "AP Computer Science A",
    "AP Computer Science Principles",
    "AP Statistics",
    "AP Biology",
    "AP Chemistry",
    "AP Environmental Science",
    "AP Physics 1: Algebra-Based",
    "AP Physics 2: Algebra-Based",
    "AP Physics C: Electricity and Magnetism",
    "AP Physics C: Mechanics",
    "AP Chinese Language and Culture",
    "AP French Language and Culture",
    "AP German Language and Culture",
    "AP Italian Language and Culture",
    "AP Japanese Language and Culture",
    "AP Latin",
    "AP Spanish Language and Culture",
    "AP Spanish Literature and Culture",
    /*Misc*/
    "Vocabulary",
    "SAT Prep",
]

export const CHECKMARK_ICON = "https://quizzynow.com/images/user/check.svg"

export const evaluateTags = function(str, tags) {
    if (str == "") {
        return [];
    }
    str = str.toLowerCase();
    var ptCopy = [];
    TAG_SUGGESTIONS.map((s) => {
        if (s.toLowerCase().search(str) != -1 && ptCopy.length < 3 && tags.indexOf(s) == -1) {
            ptCopy.push(s);
        }
    })
    return ptCopy;
}

export const hasAndOr = function(has, Or) {
    return has ? has : Or; 
}

export const MAX_IMG_SIZE_MB_PER_MEMBERSHIP = [
    1,
    3,
    10,
    20
]

export const PLAN_DATA = [
    "Quizzy+ Basic Monthly",
    "Quizzy+ Basic Annually",
    "Quizzy+ Standard Monthly",
    "Quizzy+ Standard Annually",
    "Quizzy+ Professional Monthly",
    "Quizzy+ Professional Annually",
]