const Joi = require('joi');
const express = require('express');
const { func } = require('joi');
const app = express();

//console.log(app);

//By default JSON parsing is not enabled in Node . Below code to enable it.
// app.use(Middleware) -> Middleware(express.json()) for parsing JSON Data
app.use(express.json());

const courses = [
    { id: 1 , name : 'course1' },
    { id: 2 , name : 'course2' },
    { id: 3 , name : 'course3' },
];

app.get('/',(req,res) => {
    res.send('Hello World!!!');
});

app.get('/api/courses',(req,res) => {
    res.send(courses);
});
/*
app.get('/api/courses/:id',(req,res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course)
        res.status(404).send("The course with the given ID was not found");

    res.send(course);
});

*/

// app.get('/api/courses/:year/:month',(req,res) => {
//     res.send(req.params);
// });

// app.get('/api/posts/:year/:month',(req,res) => {
//     res.send(req.query);
// });

app.post('/api/courses',(req,res) => {

    const { error }= validateCourse(req.body);
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }
    /*
    //Input Validation-> npm package joi makes it more easy
    //Code for manual validation
    if(!req.body.name || req.body.name.length < 3){
        //400 Bad Request
        res.status(400).send('Name is required and should be minimum 3 characters.');
        return;
    }
    */

    // 1. Create a new Course
    const course= {
        id: courses.length + 1,
        name : req.body.name
    };

    // 2. Add the new course to existing course object List
    courses.push(course);

    // 3. Send the new course object as a response
    res.send(course);
});

app.put('/api/courses/:id',(req,res) => {
    //Look up the course
    //If not exixting , then return 404.

    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course)
    {
        res.status(404).send("The course with the given ID was not found");
        return;
    }

    //Validate
    //If invalid , return 400 - Bad request

    const schema= Joi.object ({
        name : Joi.string().min(3).required()
    });

    //const result = validateCourse(req.body);

    //Using Object Destructuring
    const { error }= validateCourse(req.body);
    if(error)
    {
        res.status(400).send(error.details[0].message);
        return;
    }

    //Update course

    course.name = req.body.name;
    //Return the updated course

    res.send(course);
});

app.delete('/api/courses/:id',(req,res) => {
    //Lookup the course
    //Not existing , return 404

    const course = courses.find(c => c.id === parseInt(req.params.id));

    if(!course)
        return res.status(404).send("The course with the given ID was not found");


    //Delete

    const index = courses.indexOf(course);
    courses.splice(index,1);

    //Return the same course

    res.send(course);
});

function validateCourse(course) {

    const schema= Joi.object ({
        name : Joi.string().min(3).required()
    });

    return schema.validate(course);
    
}

const port = process.env.PORT || 3000;
app.listen(port , () => console.log(`Listening on port ${port}...`));