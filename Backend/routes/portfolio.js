const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfoliocontroller');

// Student routes
router.get('/students', portfolioController.getAllStudents);
router.get('/students/:id', portfolioController.getStudentById);
router.post('/students', portfolioController.createStudent);
router.put('/students/:id', portfolioController.updateStudent);
router.delete('/students/:id', portfolioController.deleteStudent);

// Project routes
router.get('/projects', portfolioController.getAllProjects);
router.get('/projects/:id', portfolioController.getProjectById);
router.post('/projects', portfolioController.createProject);
router.put('/projects/:id', portfolioController.updateProject);
router.delete('/projects/:id', portfolioController.deleteProject);

// Achievement routes
router.get('/achievements', portfolioController.getAllAchievements);
router.get('/achievements/:id', portfolioController.getAchievementById);
router.post('/achievements', portfolioController.createAchievement);
router.put('/achievements/:id', portfolioController.updateAchievement);
router.delete('/achievements/:id', portfolioController.deleteAchievement);

// Contact route
router.post('/contact', portfolioController.submitContact);

module.exports = router;