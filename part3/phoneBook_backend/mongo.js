const mongoose = require('mongoose');

if (process.argv.length <= 2) {
  console.log('password is required');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://root:${password}@cluster0.jvtigtv.mongodb.net/phoneBook?retryWrites=true&w=majority&appName=Cluster0`;
mongoose.set('strictQuery', true);
mongoose.connect(url);

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log(`phonebook:`);
    result.forEach((res) => {
      console.log(`${res.name} ${res.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then((result) => {
    console.log(`Added ${result.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
