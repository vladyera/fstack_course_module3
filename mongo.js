const mongoose = require('mongoose');

// Checking for arguments (first two are the Node.js executable and path to the script file)
if (process.argv.length < 3) {
  console.error('Missing required arguments');
  return;
}

const password = process.argv[2];

// Setting up the mongoose
const mongoUrl = `mongodb+srv://noisycab:${password}@cluster0.frwql6q.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false);
mongoose.connect(mongoUrl);

// Schema
const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  // Password is the only parameter sent, display all the entries instead
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(`${person.name} ${person.phone}`);
    })
    mongoose.connection.close();
  });
} else {
  const nameToAdd = process.argv[3];
  const phoneToAdd = process.argv[4];
  // Saving
  const person = new Person({
    name: nameToAdd,
    phone: phoneToAdd,
  });
  person.save().then(result => {
    console.log(`added ${nameToAdd} number ${phoneToAdd} to phonebook`);
    mongoose.connection.close();
  });
}
