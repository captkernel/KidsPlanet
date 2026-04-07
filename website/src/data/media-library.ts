export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  category: MediaCategory;
  thumbnail?: string;
}

export type MediaCategory = "campus" | "classroom" | "activities" | "events" | "sports" | "faculty" | "gallery" | "class-groups" | "excursions";

export const MEDIA_CATEGORIES: Record<MediaCategory, string> = {
  campus: "Campus & Building",
  classroom: "Classrooms",
  activities: "Activities & Crafts",
  events: "Events & Celebrations",
  sports: "Sports & Outdoors",
  faculty: "Faculty & Staff",
  gallery: "Student Life",
  "class-groups": "Class Group Photos",
  excursions: "Excursions & Trips",
};

export const MEDIA_LIBRARY: MediaItem[] = [
  // --- Activities ---
  { id: "activities-art-display", src: "/images/activities/art-display.jpg", alt: "Student art display showcase", category: "activities" },
  { id: "activities-craft-exhibition", src: "/images/activities/craft-exhibition.jpg", alt: "Craft exhibition with student projects", category: "activities" },
  { id: "activities-craft-medals", src: "/images/activities/craft-medals.jpg", alt: "Craft competition medals and awards", category: "activities" },
  { id: "activities-craft-project", src: "/images/activities/craft-project.jpg", alt: "Students working on craft project", category: "activities" },
  { id: "activities-group-painting", src: "/images/activities/group-painting.jpg", alt: "Group painting activity", category: "activities" },
  { id: "activities-handprint-art", src: "/images/activities/handprint-art.jpg", alt: "Colorful handprint art by students", category: "activities" },
  { id: "activities-outdoor-forest-learning", src: "/images/activities/outdoor-forest-learning.jpg", alt: "Outdoor forest learning session", category: "activities" },
  { id: "activities-paper-crafts", src: "/images/activities/paper-crafts.jpg", alt: "Paper crafts activity", category: "activities" },
  { id: "activities-paper-lanterns", src: "/images/activities/paper-lanterns.jpg", alt: "Paper lanterns made by students", category: "activities" },
  { id: "activities-planting-seedling", src: "/images/activities/planting-seedling.jpg", alt: "Students planting seedlings", category: "activities" },
  { id: "activities-science-exhibition", src: "/images/activities/science-exhibition.jpg", alt: "Science exhibition display", category: "activities" },
  { id: "activities-science-experiment", src: "/images/activities/science-experiment.jpg", alt: "Students conducting science experiment", category: "activities" },
  { id: "activities-student-drawing", src: "/images/activities/student-drawing.jpg", alt: "Student drawing in class", category: "activities" },
  { id: "activities-teacher-helping-plant", src: "/images/activities/teacher-helping-plant.jpg", alt: "Teacher helping students with planting", category: "activities" },

  // --- Campus ---
  { id: "campus-assembly-prayer", src: "/images/campus/assembly-prayer.jpg", alt: "Morning assembly prayer", category: "campus" },
  { id: "campus-assembly-wide", src: "/images/campus/assembly-wide.jpg", alt: "Wide view of school assembly", category: "campus" },
  { id: "campus-building-exterior", src: "/images/campus/building-exterior.jpg", alt: "Kids Planet school building exterior", category: "campus" },
  { id: "campus-courtyard-activities", src: "/images/campus/courtyard-activities.jpg", alt: "Activities in the school courtyard", category: "campus" },
  { id: "campus-morning-assembly", src: "/images/campus/morning-assembly.jpg", alt: "Morning assembly at Kids Planet", category: "campus" },
  { id: "campus-new-building-event", src: "/images/campus/new-building-event.jpg", alt: "New building inauguration event", category: "campus" },
  { id: "campus-yoga-day-assembly", src: "/images/campus/yoga-day-assembly.jpg", alt: "Yoga day assembly on campus", category: "campus" },

  // --- Classroom ---
  { id: "classroom-circle-time", src: "/images/classroom/circle-time.jpg", alt: "Circle time in the classroom", category: "classroom" },
  { id: "classroom-class-group-photo", src: "/images/classroom/class-group-photo.jpg", alt: "Class group photo", category: "classroom" },
  { id: "classroom-colorful-preschool", src: "/images/classroom/colorful-preschool.jpg", alt: "Colorful preschool classroom", category: "classroom" },
  { id: "classroom-decorated-classroom", src: "/images/classroom/decorated-classroom.jpg", alt: "Decorated classroom with learning materials", category: "classroom" },
  { id: "classroom-preschool-room", src: "/images/classroom/preschool-room.jpg", alt: "Preschool room setup", category: "classroom" },
  { id: "classroom-students-in-class", src: "/images/classroom/students-in-class.jpg", alt: "Students learning in class", category: "classroom" },
  { id: "classroom-teacher-reading", src: "/images/classroom/teacher-reading.jpg", alt: "Teacher reading to students", category: "classroom" },

  // --- Events ---
  { id: "events-childrens-day", src: "/images/events/childrens-day.jpg", alt: "Children's Day celebration", category: "events" },
  { id: "events-cultural-performance", src: "/images/events/cultural-performance.jpg", alt: "Cultural performance by students", category: "events" },
  { id: "events-fancy-dress-krishna", src: "/images/events/fancy-dress-krishna.jpg", alt: "Fancy dress competition - Krishna theme", category: "events" },
  { id: "events-fancy-dress-patriotic", src: "/images/events/fancy-dress-patriotic.jpg", alt: "Fancy dress competition - patriotic theme", category: "events" },
  { id: "events-farewell-ceremony", src: "/images/events/farewell-ceremony.jpg", alt: "Farewell ceremony for outgoing students", category: "events" },
  { id: "events-farewell-dance", src: "/images/events/farewell-dance.jpg", alt: "Farewell dance performance", category: "events" },
  { id: "events-farewell-group", src: "/images/events/farewell-group.jpg", alt: "Farewell group photo", category: "events" },
  { id: "events-festival-fun", src: "/images/events/festival-fun.jpg", alt: "Festival fun activities", category: "events" },
  { id: "events-fete-community", src: "/images/events/fete-community.jpg", alt: "Community school fete", category: "events" },
  { id: "events-fete-games", src: "/images/events/fete-games.jpg", alt: "Games at school fete", category: "events" },
  { id: "events-holi-celebration", src: "/images/events/holi-celebration.jpg", alt: "Holi celebration at school", category: "events" },
  { id: "events-holi-outdoor", src: "/images/events/holi-outdoor.jpg", alt: "Outdoor Holi festivities", category: "events" },
  { id: "events-holi-with-teacher", src: "/images/events/holi-with-teacher.jpg", alt: "Holi celebration with teacher", category: "events" },
  { id: "events-school-fete", src: "/images/events/school-fete.jpg", alt: "Annual school fete", category: "events" },
  { id: "events-traditional-dance", src: "/images/events/traditional-dance.jpg", alt: "Traditional dance performance", category: "events" },
  { id: "events-trophy-ceremony", src: "/images/events/trophy-ceremony.jpg", alt: "Trophy ceremony for winners", category: "events" },

  // --- Sports ---
  { id: "sports-adventure-activities", src: "/images/sports/adventure-activities.jpg", alt: "Adventure activities for students", category: "sports" },
  { id: "sports-balloon-play", src: "/images/sports/balloon-play.jpg", alt: "Balloon play activity", category: "sports" },
  { id: "sports-bouncy-castle", src: "/images/sports/bouncy-castle.jpg", alt: "Bouncy castle fun", category: "sports" },
  { id: "sports-morning-exercise", src: "/images/sports/morning-exercise.jpg", alt: "Morning exercise routine", category: "sports" },
  { id: "sports-outdoor-learning", src: "/images/sports/outdoor-learning.jpg", alt: "Outdoor learning session", category: "sports" },
  { id: "sports-park-trip", src: "/images/sports/park-trip.jpg", alt: "Park trip with students", category: "sports" },
  { id: "sports-picnic-outing", src: "/images/sports/picnic-outing.jpg", alt: "Picnic outing day", category: "sports" },
  { id: "sports-rocking-horses", src: "/images/sports/rocking-horses.jpg", alt: "Children on rocking horses", category: "sports" },
  { id: "sports-slide-fun", src: "/images/sports/slide-fun.jpg", alt: "Children having fun on the slide", category: "sports" },
  { id: "sports-yoga-stretch", src: "/images/sports/yoga-stretch.jpg", alt: "Yoga stretching session", category: "sports" },
  { id: "sports-basketball-01", src: "/images/sports/basketball/courtyard-01.jpg", alt: "Students playing basketball in the school courtyard", category: "sports" },
  { id: "sports-basketball-02", src: "/images/sports/basketball/courtyard-02.jpg", alt: "Students lined up for basketball practice in courtyard", category: "sports" },
  { id: "sports-basketball-03", src: "/images/sports/basketball/shooting-01.jpg", alt: "Student shooting basketball at courtyard hoop", category: "sports" },
  { id: "sports-basketball-04", src: "/images/sports/basketball/shooting-02.jpg", alt: "Basketball shooting practice in school courtyard", category: "sports" },
  { id: "sports-table-tennis-01", src: "/images/sports/table-tennis/game-01.jpg", alt: "Students playing table tennis in the Kids Planet indoor hall", category: "sports" },
  { id: "sports-table-tennis-02", src: "/images/sports/table-tennis/game-02.jpg", alt: "Table tennis match between students", category: "sports" },
  { id: "sports-table-tennis-03", src: "/images/sports/table-tennis/game-03.jpg", alt: "Students practicing table tennis", category: "sports" },
  { id: "sports-table-tennis-04", src: "/images/sports/table-tennis/game-04.jpg", alt: "Table tennis game in progress", category: "sports" },
  { id: "sports-table-tennis-05", src: "/images/sports/table-tennis/game-05.jpg", alt: "Students enjoying table tennis after classes", category: "sports" },
  { id: "sports-table-tennis-06", src: "/images/sports/table-tennis/game-06.jpg", alt: "Table tennis doubles game in indoor hall", category: "sports" },
  { id: "sports-table-tennis-collage", src: "/images/sports/table-tennis/collage.jpg", alt: "Table tennis activity collage — multiple angles of students playing", category: "sports" },

  // --- Faculty & Staff ---
  { id: "faculty-faculty-group", src: "/images/faculty/faculty-group.jpg", alt: "Faculty group photo", category: "faculty" },
  { id: "faculty-investiture-ceremony", src: "/images/faculty/investiture-ceremony.jpg", alt: "Investiture ceremony", category: "faculty" },
  { id: "faculty-school-captains", src: "/images/faculty/school-captains.jpg", alt: "School captains with faculty", category: "faculty" },
  { id: "faculty-santosh-kumari", src: "/images/staff/santosh-kumari.jpg", alt: "Mrs. Santosh Kumari — Class 2 Teacher", category: "faculty" },
  { id: "faculty-pragya", src: "/images/staff/pragya.jpg", alt: "Mrs. Pragya — Class 4 Teacher (10 years experience)", category: "faculty" },
  { id: "faculty-shivya", src: "/images/staff/shivya.jpg", alt: "Mrs. Shivya — Class 1 Teacher", category: "faculty" },
  { id: "faculty-pragya-sharma", src: "/images/staff/pragya-sharma.jpg", alt: "Mrs. Pragya Sharma — Class 5 Senior Teacher (15 years experience)", category: "faculty" },
  { id: "faculty-rashmi", src: "/images/staff/rashmi.jpg", alt: "Mrs. Rashmi — Class 4 Teacher", category: "faculty" },
  { id: "faculty-teacher-02", src: "/images/staff/teacher-02.jpg", alt: "Kids Planet teacher portrait", category: "faculty" },
  { id: "faculty-teacher-04", src: "/images/staff/teacher-04.jpg", alt: "Kids Planet teacher portrait", category: "faculty" },
  { id: "faculty-teacher-06", src: "/images/staff/teacher-06.jpg", alt: "Kids Planet teacher portrait", category: "faculty" },
  { id: "faculty-teacher-08", src: "/images/staff/teacher-08.jpg", alt: "Kids Planet teaching assistant", category: "faculty" },
  { id: "faculty-teacher-10", src: "/images/staff/teacher-10.jpg", alt: "Kids Planet teacher in classroom", category: "faculty" },
  { id: "faculty-teacher-11", src: "/images/staff/teacher-11.jpg", alt: "Kids Planet senior staff member", category: "faculty" },
  { id: "faculty-director", src: "/images/staff/director.jpg", alt: "Kids Planet Director at his office", category: "faculty" },

  // --- Class Group Photos ---
  { id: "class-groups-nursery", src: "/images/class-groups/nursery.jpg", alt: "Nursery class group photo — 26 students in yellow uniforms", category: "class-groups" },
  { id: "class-groups-lkg", src: "/images/class-groups/lkg.jpg", alt: "LKG class group photo — 30 students in yellow uniforms", category: "class-groups" },
  { id: "class-groups-lkg-02", src: "/images/class-groups/lkg-02.jpg", alt: "LKG class group photo — alternate angle", category: "class-groups" },
  { id: "class-groups-ukg", src: "/images/class-groups/ukg.jpg", alt: "UKG class group photo — 22 students in yellow uniforms", category: "class-groups" },
  { id: "class-groups-class-1", src: "/images/class-groups/class-1.jpg", alt: "Class 1 group photo — 19 students in green uniforms with teacher", category: "class-groups" },
  { id: "class-groups-class-2", src: "/images/class-groups/class-2.jpg", alt: "Class 2 group photo — 21 students in green uniforms with teacher", category: "class-groups" },
  { id: "class-groups-class-3", src: "/images/class-groups/class-3.jpg", alt: "Class 3 group photo — 16 students in green uniforms with teacher", category: "class-groups" },
  { id: "class-groups-class-5", src: "/images/class-groups/class-5.jpg", alt: "Class 5 group photo — students in green uniforms with Mrs. Pragya Sharma", category: "class-groups" },
  { id: "class-groups-class-5-02", src: "/images/class-groups/class-5-02.jpg", alt: "Class 5 standing group photo with teacher", category: "class-groups" },

  // --- Excursions & Trips ---
  { id: "excursions-temple-visit-01", src: "/images/excursions/temple-visit-01.jpg", alt: "Class 8 temple excursion — group photo at historic temple", category: "excursions" },
  { id: "excursions-temple-visit-02", src: "/images/excursions/temple-visit-02.jpg", alt: "Class 8 temple excursion — students and teachers at temple steps", category: "excursions" },
  { id: "excursions-temple-visit-03", src: "/images/excursions/temple-visit-03.jpg", alt: "Class 8 temple excursion — group photo at temple entrance", category: "excursions" },

  // --- Gallery (Student Life) ---
  { id: "gallery-color-day", src: "/images/gallery/color-day.jpg", alt: "Color day celebration", category: "gallery" },
  { id: "gallery-student-closeup", src: "/images/gallery/student-closeup.jpg", alt: "Student closeup portrait", category: "gallery" },
  { id: "gallery-student-portrait", src: "/images/gallery/student-portrait.jpg", alt: "Student portrait", category: "gallery" },
  { id: "gallery-student-with-teacher", src: "/images/gallery/student-with-teacher.jpg", alt: "Student with teacher", category: "gallery" },
  { id: "gallery-teacher-nurturing", src: "/images/gallery/teacher-nurturing.jpg", alt: "Teacher nurturing young student", category: "gallery" },
  { id: "gallery-tilak-welcome", src: "/images/gallery/tilak-welcome.jpg", alt: "Traditional tilak welcome", category: "gallery" },
  { id: "gallery-trophy-winners", src: "/images/gallery/trophy-winners.jpg", alt: "Trophy winners celebration", category: "gallery" },
];
