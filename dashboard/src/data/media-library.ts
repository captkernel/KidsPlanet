export interface MediaItem {
  id: string;
  src: string;
  alt: string;
  category: MediaCategory;
  thumbnail?: string;
}

export type MediaCategory = "campus" | "classroom" | "activities" | "events" | "sports" | "faculty" | "gallery";

export const MEDIA_CATEGORIES: Record<MediaCategory, string> = {
  campus: "Campus & Building",
  classroom: "Classrooms",
  activities: "Activities & Crafts",
  events: "Events & Celebrations",
  sports: "Sports & Outdoors",
  faculty: "Faculty & Staff",
  gallery: "Student Life",
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

  // --- Faculty ---
  { id: "faculty-faculty-group", src: "/images/faculty/faculty-group.jpg", alt: "Faculty group photo", category: "faculty" },
  { id: "faculty-investiture-ceremony", src: "/images/faculty/investiture-ceremony.jpg", alt: "Investiture ceremony", category: "faculty" },
  { id: "faculty-school-captains", src: "/images/faculty/school-captains.jpg", alt: "School captains with faculty", category: "faculty" },

  // --- Gallery (Student Life) ---
  { id: "gallery-color-day", src: "/images/gallery/color-day.jpg", alt: "Color day celebration", category: "gallery" },
  { id: "gallery-student-closeup", src: "/images/gallery/student-closeup.jpg", alt: "Student closeup portrait", category: "gallery" },
  { id: "gallery-student-portrait", src: "/images/gallery/student-portrait.jpg", alt: "Student portrait", category: "gallery" },
  { id: "gallery-student-with-teacher", src: "/images/gallery/student-with-teacher.jpg", alt: "Student with teacher", category: "gallery" },
  { id: "gallery-teacher-nurturing", src: "/images/gallery/teacher-nurturing.jpg", alt: "Teacher nurturing young student", category: "gallery" },
  { id: "gallery-tilak-welcome", src: "/images/gallery/tilak-welcome.jpg", alt: "Traditional tilak welcome", category: "gallery" },
  { id: "gallery-trophy-winners", src: "/images/gallery/trophy-winners.jpg", alt: "Trophy winners celebration", category: "gallery" },
];
