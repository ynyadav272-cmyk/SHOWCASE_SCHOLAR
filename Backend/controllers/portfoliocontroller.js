const fs = require('fs').promises;
const path = require('path');

const dataPath = path.join(__dirname, '../data/portfolio.json');

// Helper function to read data
async function readData() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // Return default data structure if file doesn't exist
        return {
            students: [],
            projects: [],
            achievements: [],
            contacts: []
        };
    }
}

// Helper function to write data
async function writeData(data) {
    // Ensure data directory exists
    const dataDir = path.dirname(dataPath);
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Student controllers
exports.getAllStudents = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const data = await readData();
        const student = data.students.find(s => s.id === parseInt(req.params.id));
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const data = await readData();
        const newStudent = {
            id: data.students.length > 0 ? Math.max(...data.students.map(s => s.id)) + 1 : 1,
            ...req.body,
            createdAt: new Date().toISOString()
        };
        data.students.push(newStudent);
        await writeData(data);
        res.status(201).json(newStudent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const data = await readData();
        const index = data.students.findIndex(s => s.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Student not found' });
        }
        data.students[index] = { ...data.students[index], ...req.body, updatedAt: new Date().toISOString() };
        await writeData(data);
        res.json(data.students[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const data = await readData();
        const index = data.students.findIndex(s => s.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Student not found' });
        }
        data.students.splice(index, 1);
        await writeData(data);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Project controllers
exports.getAllProjects = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProjectById = async (req, res) => {
    try {
        const data = await readData();
        const project = data.projects.find(p => p.id === parseInt(req.params.id));
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProject = async (req, res) => {
    try {
        const data = await readData();
        const newProject = {
            id: data.projects.length > 0 ? Math.max(...data.projects.map(p => p.id)) + 1 : 1,
            ...req.body,
            date: req.body.date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        data.projects.push(newProject);
        await writeData(data);
        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProject = async (req, res) => {
    try {
        const data = await readData();
        const index = data.projects.findIndex(p => p.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }
        data.projects[index] = { ...data.projects[index], ...req.body, updatedAt: new Date().toISOString() };
        await writeData(data);
        res.json(data.projects[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProject = async (req, res) => {
    try {
        const data = await readData();
        const index = data.projects.findIndex(p => p.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Project not found' });
        }
        data.projects.splice(index, 1);
        await writeData(data);
        res.json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Achievement controllers
exports.getAllAchievements = async (req, res) => {
    try {
        const data = await readData();
        res.json(data.achievements);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAchievementById = async (req, res) => {
    try {
        const data = await readData();
        const achievement = data.achievements.find(a => a.id === parseInt(req.params.id));
        if (!achievement) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        res.json(achievement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createAchievement = async (req, res) => {
    try {
        const data = await readData();
        const newAchievement = {
            id: data.achievements.length > 0 ? Math.max(...data.achievements.map(a => a.id)) + 1 : 1,
            ...req.body,
            date: req.body.date || new Date().toISOString(),
            createdAt: new Date().toISOString()
        };
        data.achievements.push(newAchievement);
        await writeData(data);
        res.status(201).json(newAchievement);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateAchievement = async (req, res) => {
    try {
        const data = await readData();
        const index = data.achievements.findIndex(a => a.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        data.achievements[index] = { ...data.achievements[index], ...req.body, updatedAt: new Date().toISOString() };
        await writeData(data);
        res.json(data.achievements[index]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteAchievement = async (req, res) => {
    try {
        const data = await readData();
        const index = data.achievements.findIndex(a => a.id === parseInt(req.params.id));
        if (index === -1) {
            return res.status(404).json({ error: 'Achievement not found' });
        }
        data.achievements.splice(index, 1);
        await writeData(data);
        res.json({ message: 'Achievement deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Contact controller
exports.submitContact = async (req, res) => {
    try {
        const data = await readData();
        const newContact = {
            id: data.contacts.length > 0 ? Math.max(...data.contacts.map(c => c.id)) + 1 : 1,
            ...req.body,
            date: new Date().toISOString()
        };
        data.contacts.push(newContact);
        await writeData(data);
        res.status(201).json({ message: 'Contact form submitted successfully', contact: newContact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};