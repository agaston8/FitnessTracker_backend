const express = require('express');
const routineActivitiesRouter = express.Router();
const {
    updateRoutineActivity,
    destroyRoutineActivity,
    canEditRoutineActivity,
} = require("../db")
const jwt = require('jsonwebtoken')

// PATCH /api/routine_activities/:routineActivityId
routineActivitiesRouter.patch("/:routineActivityId", async (req, res)=>{
    const {routineActivityId} = req.params;
    const {count, duration} = req.body;
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    const token = auth.slice(prefix.length);
    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET);
    
      
    try {
        const theUserCanEdit = await canEditRoutineActivity(routineActivityId, loggedInUser.id)
        if (theUserCanEdit == true) {
            const routineActivity = await updateRoutineActivity({id:routineActivityId, count:count, duration:duration})
                res.send(routineActivity);
        } else {
            res.status(403).send({
                message:`User ${loggedInUser.username} is not allowed to update In the evening`,
                name:"error",
                error:"error"
            })
        }
     } catch(error) {
         console.error(error);
     }
})

// DELETE /api/routine_activities/:routineActivityId
routineActivitiesRouter.delete("/:routineActivityId", async (req, res)=>{
    const {routineActivityId} = req.params;
    const prefix = 'Bearer ';
    const auth = req.header('Authorization');
    const token = auth.slice(prefix.length);
    const loggedInUser = jwt.verify(token, process.env.JWT_SECRET);
    
      
    try {
        const theUserCanEdit = await canEditRoutineActivity(routineActivityId, loggedInUser.id)
        if (theUserCanEdit == true) {
            const deletedRoutine = await destroyRoutineActivity(routineActivityId);
            res.send(deletedRoutine);
        } else {
            res.status(403).send({
                message:`User ${loggedInUser.username} is not allowed to delete In the afternoon`,
                name:"error",
                error:"error"
            })
        }
     } catch(error) {
         console.error(error);
     }
    
})

module.exports = routineActivitiesRouter;


