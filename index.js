const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.PORT || 4000;

//creating local storage

let mentor = [];
let student = [];
let assign = [];
let mentortemp = [];
let studenttemp = [];
let studentmentor = [];

//View the home page

app.get("/", (req,res)=>{
  res.status(200).send("This is the home page. Use /mentor to add mentor, /student to add student, /assign to assign students to mentor and /studentmentor to change mentors of students")
})

//Adding new mentor

app.post("/mentor", (req, res) => {
  mentor.push({ mentorid: mentor.length + 1, mentorname: req.body.mentorname });
  res.status(200).send("Mentor Added");
});

//Adding new student

app.post("/student", (req, res) => {
  student.push({
    studentid: student.length + 1,
    studentname: req.body.studentname,
  });
  studenttemp.push(req.body.studentname);
  res.status(200).send("Student Added");
});

//Assigning student to mentor

app.post("/assign", (req, res) => {
  // console.log(mentor);
  // console.log(student);
  // console.log(studenttemp);

  let t = 0;
  for (var i in mentor) {
    if (req.body.mentorname == mentor[i].mentorname) {
      t = 1;
    }
  }
  let p = 0;
  for (var i in mentortemp) {
    if (req.body.mentorname == mentortemp[i].mentorname) {
      p = 1;
    }
  }

  let x = 0;
  for (var i in studenttemp) {
    for (var k in req.body.student) {
      if (req.body.student[k] == studenttemp[i]) {
        x = x + 1;
      }
    }
  }

  let y = 0;
  for (var i in student) {
    for (var k in req.body.student) {
      if (req.body.student[k] == student[i].studentname) {
        y = y + 1;
      }
    }
  }

  // console.log(x);

  if (t == 0) {
    res
      .status(200)
      .send("Mentor doesn't exist. Please add the mentor into the system");
  } else {
    if (false) {
      res.status(200).send("Mentor has already been assigned students");
    } else {
      if (y != req.body.student.length) {
        res
          .status(200)
          .send(
            "One of more students doesn't exist. Please add the student into the system"
          );
      } else {
        if (x != req.body.student.length) {
          res
            .status(200)
            .send(
              "One of more students have already been assigned mentors. Please check the list of available students"
            );
        } else {
          for (var i in assign) {
            if (req.body.mentorname == assign[i].mentorname) {
              assign[i].student.push(req.body.studentname);
            }
            else{
              assign.push({
                mentorname: req.body.mentorname,
                student: req.body.student
            })
          }
          };
          for (var i in req.body.student) {
            studenttemp = studenttemp.filter((item) => {
              return item != req.body.student[i];
            });
            studentmentor.push({
              studentname: req.body.student[i],
              mentorname: req.body.mentorname,
            });
          }
          res.status(200).send("Students assigned to mentors");
        }
      }
    }
  }
});

//changing mentor of a particular student

app.put("/studentmentor", (req, res) => {
  let x = 0;
  for (var i in student) {
    if (req.body.studentname == student[i].studentname) {
      x = 1;
    }
  }
  let t = 0;
  for (var i in mentor) {
    if (req.body.mentorname == mentor[i].mentorname) {
      t = 1;
    }
  }

  // console.log(x);
  // console.log(t);

  if (x == 0) {
    res
      .status(200)
      .send(
        "The student name entered does not exist. Please check again or add the student first"
      );
  } else {
    if (t == 0) {
      res
        .status(200)
        .send(
          "The mentor name entered does not exist. Please check again or add the student first"
        );
    } else {
      for (var i in assign) {
        for (var k in assign[i].student) {
          if (req.body.studentname == assign[i].student[k]) {
            assign[i].student = assign[i].student.filter((item) => {
              return item != req.body.studentname;
            });
          }
        }
      }
      for (var i in assign) {
        if (req.body.mentorname == assign[i].mentorname) {
          assign[i].student.push(req.body.studentname);
        }
        else{
          assign.push({
            mentorname: req.body.mentorname,
            student: req.body.student
        })
      }
      }

      for (var i in studentmentor){
          if(req.body.studentname==studentmentor[i].studentname){
              studentmentor[i].mentorname = req.body.mentorname;
          }
      }
      res.status(200).send("Mentor updated for the student")
    }
  }
  console.log(assign);
  console.log(studentmentor);
});

//Viewing mentors

app.get("/mentor", (req, res) => {
  res.status(200).json({ mentor });
});

app.get("/mentor/:mentorname", (req, res) => {
  let mentorDetails = [];
  for (var i in mentor) {
    if (req.params.mentorname == mentor[i].mentorname) {
      mentorDetails.push(mentor[i]);
    }
  }
  if (mentorDetails.length > 0) {
    res.status(200).json({ mentorDetails });
  } else {
    res.status(200).send("Mentor does not exist. Please check the param");
  }
});

//Viewing students

app.get("/student", (req, res) => {
  res.status(200).json({ student });
});

//Viewing mentor and students

app.get("/assign", (req, res) => {
  res.status(200).json({ assign });
});

app.get("/assign/:mentorname", (req, res) => {
  let MentorStudentDetails = [];
  for (var i in assign) {
    if (req.params.mentorname == assign[i].mentorname) {
      MentorStudentDetails.push(assign[i]);
    }
  }
  if (MentorStudentDetails.length > 0) {
    res.status(200).json({ MentorStudentDetails });
  } else {
    res.status(200).send("Mentor does not exist or has not been assigned any student yet. Please check the param");
  }
});

//Viewing student and their mentors

app.get("/studentmentor", (req, res) => {
  res.status(200).json({ studentmentor });
});

//Viewing students who are without mentors 

app.get("/availablestudents", (req, res) => {
    res.status(200).json({ studenttemp });
  });

//Listening to port

app.listen(port, () => {
  console.log("listening to port", port);
});
