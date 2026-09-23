import mongoose from 'mongoose';

interface Course {
  name: string;
  author: string;
  tags: string[];
  date: Date;
  isPublished: boolean;
  price?: number;
}

mongoose.connect('mongodb://localhost/mongo-exercises');

const courseSchema = new mongoose.Schema<Course>({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model<Course>('Course', courseSchema);

async function getCourses() {
  return await Course.find({ isPublished: true, tags: 'backend' })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();