var express = require('express');
var router = express.Router()




// load the data model schema
const db = require('../models');

router.post ("/api/workouts", async (req,res)=>{
    await db.Workout.create({})
    return
})


router.get("/api/workouts", async (req,res)=>{
    const data = await db.Workout.find({})
    res.json(data)
    // console.log(data)
})


router.get("/api/workouts/range", async (req,res)=>{
    const data = await db.Workout.find()
    res.json(data)
    
})


router.put("/api/workouts/:id", async (req,res)=>{
    let id = req.params.id
    let data = req.body
    console.log(data)
    console.log(id)
    const file = await db.Workout.findOneAndUpdate (
        {_id:id},
        {
           $push:{exercises:data}
        },
        { new: true, runValidators: true }
    )
      const result = await file.save();
      res.json(result);
})

// router.delete


module.exports = router;