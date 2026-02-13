db = db.getSiblingDB('linguaaccess');

// Create collections with initial structure
db.createCollection('lessons');
db.createCollection('assessments');
db.createCollection('sections');
db.createCollection('media');
db.createCollection('templates');

// Create indexes for performance
db.lessons.createIndex({ educatorId: 1 });
db.lessons.createIndex({ createdAt: -1 });
db.assessments.createIndex({ educatorId: 1 });
db.assessments.createIndex({ createdAt: -1 });
db.sections.createIndex({ lessonId: 1 });
db.media.createIndex({ uploadedBy: 1 });
db.media.createIndex({ uploadDate: -1 });

print('MongoDB initialized with linguaaccess database');
