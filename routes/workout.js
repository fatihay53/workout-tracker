var express = require('express');
var router = express.Router()




// load the data model schema
const db = require('../models');

router.post("/api/workouts", async (req, res) => {
    db.Workout.create({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
})

router.get("/api/workouts", (req, res) => {

    db.Workout.find({}).then(dbWorkout => {
        dbWorkout.forEach(workout => {
            let total = 0;
            workout.exercises.forEach(data => {
                total += data.duration;
            });
            workout.totalDuration = total;
        });

        res.json(dbWorkout);
    }).catch(err => {
        res.json(err);
    });
});


router.get("/api/workouts/range", async (req, res) => {
    const data = await db.Workout.aggregate([
        {
            $addFields: {
                totalDuration: {
                    $sum: "$exercises.duration",
                },
            },
        },
    ])
    .sort({_id:-1})
    .limit(7)
    .then((dbWorkouts) => {

        res.json(dbWorkouts);
    })


})


router.put("/api/workouts/:id", async (req, res) => {
    let id = req.params.id
    let data = req.body

    const file = await db.Workout.findOneAndUpdate(
        { _id: id },
        {
            $inc: { totalDuration: data.duration },
            $push: { exercises: data }
        },
        { new: true, runValidators: true }
    )
    const result = await file.save();
    res.json(result);
})

  
module.exports = router;