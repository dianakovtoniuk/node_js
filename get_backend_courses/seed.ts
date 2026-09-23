import mongoose from 'mongoose';
import fs from 'fs';

mongoose.connect('mongodb://localhost/mongo-exercises');

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model('Course', courseSchema);

async function seed() {
  const data = JSON.parse(fs.readFileSync('exercise-data.json', 'utf-8'));
  await Course.collection.drop().catch(() => {});
  await Course.insertMany(data);
  console.log('Data imported');
  mongoose.disconnect();
}

seed();